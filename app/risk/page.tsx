import { SizeRail } from "@/components/hud/size-rail";
import { PageHeader } from "@/components/page-header";
import { FeeSkipCalc } from "@/components/risk/fee-skip-calc";
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
        title="Risk rails"
        description="Size, stops, fee-skip, kills. Today the rails are green and the event cluster still zeros permission."
      />

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription className="font-mono tracking-[0.18em] text-coins uppercase">
              Coins.ph · PHP
            </CardDescription>
            <CardTitle>₱{risk.coins.sizeMin.toLocaleString()}–₱{risk.coins.sizeMax.toLocaleString()}</CardTitle>
            <p className="text-sm text-muted-foreground">
              A+ ~₱{risk.coins.sizeAPlus.toLocaleString()} · stop {pct(risk.coins.stopPct, 0)} · target{" "}
              {pct(risk.coins.targetPct, 0)} · {rr.toFixed(0)}R
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
            <List title="Fee-skip" items={risk.coins.feeSkip} />
            <List title="Kills" items={risk.coins.kills} danger />
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
              Bias ${risk.gotrade.sizeBiasMin}–${risk.gotrade.sizeBiasMax} · cash $
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
            <List title="Fee-skip" items={risk.gotrade.feeSkip} />
            <List title="Kills" items={risk.gotrade.kills} danger />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Global kills</CardTitle>
            <CardDescription>If any of these are live, stance is NO TRADE.</CardDescription>
          </CardHeader>
          <CardContent>
            <List items={risk.globalKills} danger />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fee-skip calculator</CardTitle>
            <CardDescription>
              Coins skip &gt; 0.8% of notional. Gotrade skip &gt; 1% of a floor ticket.
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
  title?: string;
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
