"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Venue } from "@/lib/types";

const DEFAULTS: Record<Venue, { notional: number; fee: number; threshold: number }> = {
  coins: { notional: 1000, fee: 12, threshold: 0.008 },
  gotrade: { notional: 22, fee: 0.35, threshold: 0.01 },
};

export function FeeSkipCalc() {
  const [venue, setVenue] = useState<Venue>("coins");
  const [notional, setNotional] = useState(String(DEFAULTS.coins.notional));
  const [fee, setFee] = useState(String(DEFAULTS.coins.fee));

  const result = useMemo(() => {
    const n = Number(notional);
    const f = Number(fee);
    if (!Number.isFinite(n) || !Number.isFinite(f) || n <= 0) {
      return { ratio: 0, skip: true, reason: "Enter a positive notional." };
    }
    const ratio = f / n;
    const threshold = DEFAULTS[venue].threshold;
    const skip = ratio > threshold;
    return {
      ratio,
      skip,
      reason: skip
        ? `Fee ${ (ratio * 100).toFixed(2) }% > ${ (threshold * 100).toFixed(1) }% rail — skip.`
        : `Fee ${ (ratio * 100).toFixed(2) }% inside the ${ (threshold * 100).toFixed(1) }% rail.`,
    };
  }, [fee, notional, venue]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={venue === "coins" ? "default" : "outline"}
          onClick={() => {
            setVenue("coins");
            setNotional(String(DEFAULTS.coins.notional));
            setFee(String(DEFAULTS.coins.fee));
          }}
        >
          Coins.ph
        </Button>
        <Button
          size="sm"
          variant={venue === "gotrade" ? "default" : "outline"}
          onClick={() => {
            setVenue("gotrade");
            setNotional(String(DEFAULTS.gotrade.notional));
            setFee(String(DEFAULTS.gotrade.fee));
          }}
        >
          Gotrade
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1 text-xs text-muted-foreground">
          Notional
          <Input
            value={notional}
            onChange={(e) => setNotional(e.target.value)}
            inputMode="decimal"
            className="font-mono"
          />
        </label>
        <label className="space-y-1 text-xs text-muted-foreground">
          Fees
          <Input
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            inputMode="decimal"
            className="font-mono"
          />
        </label>
      </div>
      <p
        className={
          result.skip
            ? "rounded-lg border border-loss/40 bg-loss/10 px-3 py-2 text-sm text-loss"
            : "rounded-lg border border-profit/40 bg-profit/10 px-3 py-2 text-sm text-profit"
        }
      >
        {result.skip ? "SKIP" : "CLEAR"} — {result.reason}
      </p>
    </div>
  );
}
