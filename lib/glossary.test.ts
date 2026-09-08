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
});
