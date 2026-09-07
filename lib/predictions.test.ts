import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { predictionSchema } from "./schema";
import type { Prediction } from "./types";
import {
  filterPredictions,
  formatLevel,
  outcomeBadge,
  scorePredictions,
  sortCallsForDisplay,
  upsertPredictions,
} from "./predictions";

function call(
  partial: Partial<Prediction> & Pick<Prediction, "id" | "status" | "conviction">,
): Prediction {
  return {
    dateOpened: "2026-09-08",
    symbol: "BTC",
    venue: "coins",
    thesis: "test call",
    direction: "long_wait",
    invalidation: "below structure",
    horizon: "event",
    source: "analyst",
    ...partial,
  };
}

describe("scorePredictions", () => {
  it("returns null hit rate when nothing is graded", () => {
    const stats = scorePredictions([
      call({ id: "a", status: "open", conviction: 3 }),
      call({ id: "b", status: "cancelled", conviction: 6 }),
      call({ id: "c", status: "expired", conviction: 4 }),
      call({ id: "d", status: "hit_entry", conviction: 5 }),
    ]);
    assert.equal(stats.graded, 0);
    assert.equal(stats.hitRate, null);
    assert.equal(stats.avgConvictionHits, null);
    assert.equal(stats.avgConvictionMisses, null);
    assert.equal(stats.open, 1);
    assert.equal(stats.live, 1);
    assert.equal(stats.cancelled, 1);
    assert.equal(stats.expired, 1);
  });

  it("computes hit rate from hit_target vs invalidated only", () => {
    const stats = scorePredictions([
      call({ id: "hit-1", status: "hit_target", conviction: 8 }),
      call({ id: "hit-2", status: "hit_target", conviction: 6 }),
      call({ id: "miss-1", status: "invalidated", conviction: 4 }),
      call({ id: "open-1", status: "open", conviction: 3 }),
      call({ id: "exp-1", status: "expired", conviction: 2 }),
    ]);
    assert.equal(stats.hits, 2);
    assert.equal(stats.misses, 1);
    assert.equal(stats.graded, 3);
    assert.equal(stats.hitRate, 2 / 3);
    assert.equal(stats.avgConvictionHits, 7);
    assert.equal(stats.avgConvictionMisses, 4);
  });
});

describe("upsertPredictions", () => {
  it("inserts new ids and replaces existing ones", () => {
    const existing = [call({ id: "btc", status: "open", conviction: 3 })];
    const incoming = [
      call({ id: "btc", status: "hit_entry", conviction: 3, thesis: "updated" }),
      call({ id: "xrp", status: "open", conviction: 3, symbol: "XRP" }),
    ];
    const next = upsertPredictions(existing, incoming);
    assert.equal(next.length, 2);
    assert.equal(next.find((p) => p.id === "btc")?.status, "hit_entry");
    assert.equal(next.find((p) => p.id === "btc")?.thesis, "updated");
    assert.equal(next.find((p) => p.id === "xrp")?.symbol, "XRP");
  });
});

describe("filterPredictions", () => {
  const book = [
    call({ id: "btc", status: "open", conviction: 3, symbol: "BTC", venue: "coins" }),
    call({
      id: "macro",
      status: "open",
      conviction: 7,
      symbol: "MACRO",
      venue: "macro",
    }),
    call({
      id: "sui",
      status: "cancelled",
      conviction: 6,
      symbol: "SUI",
      venue: "coins",
    }),
  ];

  it("filters by symbol, book, and open vs closed", () => {
    assert.deepEqual(
      filterPredictions(book, { symbol: "btc" }).map((p) => p.id),
      ["btc"],
    );
    assert.deepEqual(
      filterPredictions(book, { venue: "macro" }).map((p) => p.id),
      ["macro"],
    );
    assert.deepEqual(
      filterPredictions(book, { status: "closed" }).map((p) => p.id),
      ["sui"],
    );
    assert.deepEqual(
      filterPredictions(book, { status: "open_book" }).map((p) => p.id),
      ["btc", "macro"],
    );
  });
});

describe("sortCallsForDisplay", () => {
  it("orders primary, then scout, then stance", () => {
    const ordered = sortCallsForDisplay([
      call({ id: "m", status: "open", conviction: 7, symbol: "MACRO", role: "stance" }),
      call({ id: "b", status: "open", conviction: 2, symbol: "BNB", role: "scout" }),
      call({ id: "x", status: "open", conviction: 3, symbol: "XRP", role: "primary" }),
      call({ id: "t", status: "open", conviction: 3, symbol: "BTC", role: "primary" }),
    ]);
    assert.deepEqual(
      ordered.map((p) => p.symbol),
      ["BTC", "XRP", "BNB", "MACRO"],
    );
  });
});

describe("formatLevel", () => {
  it("keeps wait-zone thousands readable", () => {
    assert.equal(formatLevel(78000), "$78.0k");
    assert.equal(formatLevel(78800), "$78.8k");
    assert.equal(formatLevel(1.33), "$1.33");
  });
});

describe("outcomeBadge", () => {
  it("maps closed statuses to HIT / MISS / EXPIRED", () => {
    assert.equal(outcomeBadge("hit_target"), "HIT");
    assert.equal(outcomeBadge("invalidated"), "MISS");
    assert.equal(outcomeBadge("expired"), "EXPIRED");
    assert.equal(outcomeBadge("cancelled"), "CANCELLED");
    assert.equal(outcomeBadge("open"), "OPEN");
    assert.equal(outcomeBadge("hit_entry"), "LIVE");
  });
});

describe("predictionSchema", () => {
  it("accepts a wait-zone call with entry band and invalidation text", () => {
    const parsed = predictionSchema.parse({
      id: "btc-wait-2026-09-08",
      dateOpened: "2026-09-08",
      symbol: "BTC",
      venue: "coins",
      role: "primary",
      thesis: "Primary wait 78–78.8k",
      direction: "long_wait",
      entryZone: { low: 78000, high: 78800 },
      target: { t1: 82800, t2: 86000 },
      invalidation: "Below structure or chase into CPI",
      invalidationPrice: 77200,
      conviction: 3,
      horizon: "event",
      status: "open",
      source: "analyst",
    });
    assert.equal(parsed.conviction, 3);
    assert.deepEqual(parsed.entryZone, { low: 78000, high: 78800 });
  });

  it("rejects conviction outside 1–10 and missing invalidation", () => {
    const base = {
      id: "bad",
      dateOpened: "2026-09-08",
      symbol: "BTC",
      venue: "coins",
      thesis: "x",
      direction: "long_wait",
      horizon: "swing",
      status: "open",
      source: "desk",
    };
    assert.equal(predictionSchema.safeParse({ ...base, conviction: 11, invalidation: "x" }).success, false);
    assert.equal(predictionSchema.safeParse({ ...base, conviction: 3 }).success, false);
    assert.equal(
      predictionSchema.safeParse({ ...base, conviction: 3, invalidationPrice: 100 }).success,
      true,
    );
  });
});
