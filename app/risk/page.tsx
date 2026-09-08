import type { ReactNode } from "react";

import { SizeRail } from "@/components/hud/size-rail";
import { PageHeader } from "@/components/page-header";
import { FeeSkipCalc } from "@/components/risk/fee-skip-calc";
import { Term } from "@/components/term";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loadDesk, loadRisk } from "@/lib/load";
import { pct } from "@/lib/format";

export const metadata = {
  title: "Risk rails",
};

export default function RiskPage() {
  const risk = loadRisk();
  const desk = loadDesk();
  const rr = Math.abs(risk.coins.targetPct / risk.coins.stopPct);

  return (
    <div>
      <PageHeader
        kicker="Permission"
        title={
          <>
            Risk <Term id="rails">rails</Term>
          </>
        }
        description={
          <>
            Size, <Term id="stop">stops</Term>, <Term id="fee-skip">fee-skip</Term>,{" "}
            <Term id="kill">kills</Term>. Today the rails are green and the event cluster
            still zeros <Term id="permission">permission</Term>.
          </>
        }
      />

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription className="font-mono tracking-[0.18em] text-coins uppercase">
              Coins.ph · PHP
            </CardDescription>
            <CardTitle>₱{risk.coins.sizeMin.toLocaleString()}–₱{risk.coins.sizeMax.toLocaleString()}</CardTitle>
            <p className="text-sm text-muted-foreground">
              <Term id="a-plus-size">A+</Term> ~₱{risk.coins.sizeAPlus.toLocaleString()} ·{" "}
              <Term id="hard-stop">stop</Term> {pct(risk.coins.stopPct, 0)} ·{" "}
              <Term id="take-profit">target</Term> {pct(risk.coins.targetPct, 0)} ·{" "}
              {rr.toFixed(0)}
              <Term id="r-r">R</Term>
              {" · "}
              <Term id="max-1">max-1</Term>
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              After every buy <Term id="fill">fill</Term>, immediately place{" "}
              <Term id="stop-market">Stop-Market</Term> at entry×0.97 for full
              size — before anything else. +6%{" "}
              <Term id="take-profit">take-profit</Term> is a separate limit sell.{" "}
              <Term id="coins">Coins</Term> has native{" "}
              <Term id="stop-market">Stop-Market</Term> and{" "}
              <Term id="stop-limit">Stop-Limit</Term>; no{" "}
              <Term id="oco">OCO</Term>.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <SizeRail
              cash={desk.books.coins.cash}
              min={risk.coins.sizeMin}
              max={risk.coins.sizeMax}
              aPlus={risk.coins.sizeAPlus}
              tone="coins"
              unit="₱"
            />
            <List title={<Term id="fee-skip">Fee-skip</Term>} items={risk.coins.feeSkip} />
            <List title={<Term id="kill">Kills</Term>} items={risk.coins.kills} danger />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="font-mono tracking-[0.18em] text-gotrade uppercase">
              Gotrade · USD
            </CardDescription>
            <CardTitle>
              ${risk.gotrade.sizeMin}–${risk.gotrade.sizeMax}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              <Term id="bias-size">Bias</Term> ${risk.gotrade.sizeBiasMin}–$
              {risk.gotrade.sizeBiasMax} · cash $
              {desk.books.gotrade.cash} ≈{" "}
              {(desk.books.gotrade.cash / risk.gotrade.sizeBiasMin).toFixed(1)} clips
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <SizeRail
              cash={desk.books.gotrade.cash}
              min={risk.gotrade.sizeMin}
              max={risk.gotrade.sizeMax}
              tone="gotrade"
              unit="$"
            />
            <List title={<Term id="fee-skip">Fee-skip</Term>} items={risk.gotrade.feeSkip} />
            <List title={<Term id="kill">Kills</Term>} items={risk.gotrade.kills} danger />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              Global <Term id="kill-switch">kills</Term>
            </CardTitle>
            <CardDescription>
              If any of these are live, <Term id="stance">stance</Term> is{" "}
              <Term id="NO_TRADE">NO TRADE</Term>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <List items={risk.globalKills} danger />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <Term id="fee-skip">Fee-skip</Term> calculator
            </CardTitle>
            <CardDescription>
              <Term id="coins">Coins</Term> skip &gt; 0.8% of <Term id="notional">notional</Term>.{" "}
              <Term id="gotrade">Gotrade</Term> skip &gt; 1% of a floor ticket.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FeeSkipCalc />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function List({
  title,
  items,
  danger = false,
}: {
  title?: ReactNode;
  items: string[];
  danger?: boolean;
}) {
  return (
    <div>
      {title ? (
        <p className="mb-2 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
          {title}
        </p>
      ) : null}
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item}
            className={
              danger
                ? "rounded-md border border-loss/25 bg-loss/8 px-2.5 py-1.5 text-sm"
                : "rounded-md bg-muted/40 px-2.5 py-1.5 text-sm text-muted-foreground"
            }
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
