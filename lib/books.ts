import { round } from "./format";
import type { Book, BookInput, Settings } from "./types";

export function finalizeBook(input: BookInput, settings: Settings): Book {
  const label =
    input.label ??
    (input.venue === "coins"
      ? settings.venues.coins.label
      : settings.venues.gotrade.label);

  const positions = input.positions.map((p) => {
    const marketValue = round(p.qty * p.mark, 4);
    const cost = p.qty * p.avgCost;
    const pnl = round(marketValue - cost, 4);
    const pnlPct = cost === 0 ? 0 : round(pnl / cost, 6);
    return {
      symbol: p.symbol,
      name: p.name,
      qty: p.qty,
      avgCost: p.avgCost,
      mark: p.mark,
      marketValue,
      pnl,
      pnlPct,
    };
  });

  const positionsValue = positions.reduce((sum, p) => sum + p.marketValue, 0);
  const totalPnl =
    input.totalPnl ?? round(positions.reduce((sum, p) => sum + p.pnl, 0), 4);

  return {
    venue: input.venue,
    label,
    currency: input.currency,
    cash: round(input.cash, 4),
    equity: round(input.cash + positionsValue, 4),
    dayPnl: round(input.dayPnl ?? 0, 4),
    totalPnl,
    positions,
  };
}

export function combinedNavUsd(
  coinsEquityPhp: number,
  gotradeEquityUsd: number,
  usdphp: number,
): number {
  return round(coinsEquityPhp / usdphp + gotradeEquityUsd, 2);
}

export function combinedNavPhp(
  coinsEquityPhp: number,
  gotradeEquityUsd: number,
  usdphp: number,
): number {
  return round(coinsEquityPhp + gotradeEquityUsd * usdphp, 2);
}
