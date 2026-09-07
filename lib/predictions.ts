import type {
  Prediction,
  PredictionOutcome,
  PredictionStatus,
  PredictionsFile,
} from "./types";

export interface PredictionFilters {
  symbol?: string;
  status?: string;
  venue?: string;
}

export interface PredictionScorecard {
  open: number;
  live: number;
  hits: number;
  misses: number;
  expired: number;
  cancelled: number;
  graded: number;
  hitRate: number | null;
  avgConvictionHits: number | null;
  avgConvictionMisses: number | null;
}

const CLOSED: PredictionStatus[] = [
  "hit_target",
  "invalidated",
  "expired",
  "cancelled",
];

export function isOpenCall(call: Prediction): boolean {
  return call.status === "open" || call.status === "hit_entry";
}

export function isClosedCall(call: Prediction): boolean {
  return CLOSED.includes(call.status);
}

export function outcomeBadge(status: PredictionStatus): PredictionOutcome {
  switch (status) {
    case "hit_target":
      return "HIT";
    case "invalidated":
      return "MISS";
    case "expired":
      return "EXPIRED";
    case "cancelled":
      return "CANCELLED";
    case "hit_entry":
      return "LIVE";
    case "open":
      return "OPEN";
  }
}

function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, n) => sum + n, 0) / values.length;
}

export function scorePredictions(calls: Prediction[]): PredictionScorecard {
  const hits = calls.filter((c) => c.status === "hit_target");
  const misses = calls.filter((c) => c.status === "invalidated");
  const graded = hits.length + misses.length;
  return {
    open: calls.filter((c) => c.status === "open").length,
    live: calls.filter((c) => c.status === "hit_entry").length,
    hits: hits.length,
    misses: misses.length,
    expired: calls.filter((c) => c.status === "expired").length,
    cancelled: calls.filter((c) => c.status === "cancelled").length,
    graded,
    hitRate: graded === 0 ? null : hits.length / graded,
    avgConvictionHits: mean(hits.map((c) => c.conviction)),
    avgConvictionMisses: mean(misses.map((c) => c.conviction)),
  };
}

export function upsertPredictions(
  existing: Prediction[],
  incoming: Prediction[],
): Prediction[] {
  const byId = new Map(existing.map((call) => [call.id, call]));
  for (const call of incoming) {
    byId.set(call.id, call);
  }
  return [...byId.values()].sort(
    (a, b) => a.dateOpened.localeCompare(b.dateOpened) || a.id.localeCompare(b.id),
  );
}

export function mergePredictionsFile(
  existing: PredictionsFile | undefined,
  incoming: Prediction[],
  packetDate: string,
): PredictionsFile {
  const prior = existing ?? {
    asOf: packetDate,
    disclaimer:
      "Scenario calls with invalidation — not guaranteed predictions.",
    calls: [],
  };
  return {
    asOf: packetDate >= prior.asOf ? packetDate : prior.asOf,
    disclaimer: prior.disclaimer,
    calls: upsertPredictions(prior.calls, incoming),
  };
}

export function filterPredictions(
  calls: Prediction[],
  filters: PredictionFilters,
): Prediction[] {
  const symbol = filters.symbol?.trim().toUpperCase();
  const status = filters.status?.trim();
  const venue = filters.venue?.trim();

  return calls.filter((call) => {
    if (symbol && symbol !== "ALL" && call.symbol.toUpperCase() !== symbol) {
      return false;
    }
    if (venue && venue !== "all" && call.venue !== venue) {
      return false;
    }
    if (!status || status === "all") return true;
    if (status === "open_book") return isOpenCall(call);
    if (status === "closed") return isClosedCall(call);
    return call.status === status;
  });
}

export function formatLevel(value: number): string {
  if (Math.abs(value) >= 1000) {
    const k = value / 1000;
    const digits = Number.isInteger(k) ? 0 : 1;
    return `$${k.toFixed(digits)}k`;
  }
  if (Math.abs(value) >= 100) return `$${value.toFixed(0)}`;
  return `$${value.toFixed(2)}`;
}

export function formatEntryZone(zone?: { low: number; high: number }): string | null {
  if (!zone) return null;
  return `${formatLevel(zone.low)}–${formatLevel(zone.high)}`;
}

export function formatTarget(target?: Prediction["target"]): string | null {
  if (target === undefined) return null;
  if (typeof target === "number") return formatLevel(target);
  return target.t2 === undefined
    ? formatLevel(target.t1)
    : `${formatLevel(target.t1)} / ${formatLevel(target.t2)}`;
}

export function directionLabel(direction: Prediction["direction"]): string {
  return direction.replaceAll("_", " ");
}

export function predictionVenueLabel(venue: Prediction["venue"]): string {
  if (venue === "coins") return "Coins.ph";
  if (venue === "gotrade") return "Gotrade";
  return "Macro";
}
