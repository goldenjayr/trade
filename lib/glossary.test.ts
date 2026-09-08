import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  GLOSSARY,
  getTerm,
  isGlossaryId,
  type GlossaryId,
} from "./glossary";

const REQUIRED_IDS = [
  "stance",
  "NO_TRADE",
  "WATCH",
  "ARMED",
  "IN_TRADE",
  "REDUCE",
  "primary",
  "scout",
  "wait-zone",
  "entry-zone",
  "invalidation",
  "conviction",
  "horizon",
  "PLAN",
  "rails",
  "fee-skip",
  "notional",
  "max-1",
  "take-profit",
  "TP",
  "stop",
  "hard-stop",
  "stop-market",
  "stop-limit",
  "oco",
  "r-r",
  "kill-switch",
  "flatten",
  "CPI",
  "FOMC",
  "PPI",
  "etf-flows",
  "spot-vs-convert",
  "maker-taker",
  "long_wait",
  "breakout",
  "range",
  "HIT",
  "MISS",
  "EXPIRED",
  "day-pnl",
  "realized-pnl",
  "book",
  "venue",
  "coins",
  "gotrade",
  "manila-time",
  "level-watch",
  "a-plus-size",
  "bias-size",
] as const;

describe("glossary", () => {
  it("registers every required beginner term with a plain-English definition", () => {
    for (const id of REQUIRED_IDS) {
      assert.equal(id in GLOSSARY, true, `missing glossary id: ${id}`);
      const entry = GLOSSARY[id as GlossaryId];
      assert.ok(entry.label.trim().length > 0, `${id} needs a label`);
      assert.ok(
        entry.definition.trim().length >= 24,
        `${id} needs a beginner-readable definition`,
      );
      assert.equal(
        /https?:\/\//.test(entry.definition),
        false,
        `${id} should stay plain English, not a link dump`,
      );
    }
  });

  it("looks up a term by id and rejects unknown ids", () => {
    const feeSkip = getTerm("fee-skip");
    assert.equal(feeSkip.label, "fee-skip");
    assert.match(feeSkip.definition, /fee/i);

    const stance = getTerm("NO_TRADE");
    assert.match(stance.definition, /not open|do not|don't|stand.?down|no new/i);

    assert.equal(isGlossaryId("fee-skip"), true);
    assert.equal(isGlossaryId("not-a-real-term"), false);
    assert.throws(() => getTerm("not-a-real-term" as GlossaryId), /unknown glossary/i);
  });

  it("registers Coins order types with beginner fill-rule copy", () => {
    const stopMarket = getTerm("stop-market");
    assert.match(stopMarket.label, /stop-market/i);
    assert.match(stopMarket.definition, /market order/i);
    assert.match(stopMarket.definition, /0\.97|−3%|-3%|3%/);
    assert.match(stopMarket.definition, /Coins|fill/i);

    const stopLimit = getTerm("stop-limit");
    assert.match(stopLimit.label, /stop-limit/i);
    assert.match(stopLimit.definition, /limit/i);
    assert.match(stopLimit.definition, /gap/i);

    const oco = getTerm("oco");
    assert.match(oco.label, /oco/i);
    assert.match(oco.definition, /one-cancels-the-other|one cancels the other/i);
    assert.match(oco.definition, /does not|doesn't|no OCO|not offer/i);
    assert.match(oco.definition, /separate/i);
  });

  it("resolves order-type aliases regardless of casing", () => {
    for (const alias of ["Stop-Market", "STOP-MARKET", "stop-market"] as const) {
      assert.equal(isGlossaryId(alias), true, `alias should resolve: ${alias}`);
      assert.equal(getTerm(alias).definition, getTerm("stop-market").definition);
    }
    for (const alias of ["Stop-Limit", "STOP-LIMIT", "stop-limit"] as const) {
      assert.equal(isGlossaryId(alias), true, `alias should resolve: ${alias}`);
      assert.equal(getTerm(alias).definition, getTerm("stop-limit").definition);
    }
    for (const alias of ["OCO", "oco"] as const) {
      assert.equal(isGlossaryId(alias), true, `alias should resolve: ${alias}`);
      assert.equal(getTerm(alias).definition, getTerm("oco").definition);
    }
  });
});
