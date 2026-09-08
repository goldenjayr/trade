import type { ReactNode } from "react";

import { EquityChart } from "@/components/charts/equity-chart";
import { PageHeader } from "@/components/page-header";
import { Term } from "@/components/term";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { combinedNavUsd } from "@/lib/books";
import { money } from "@/lib/format";
import { loadDays, loadSettings, loadSnapshots, loadTrades } from "@/lib/load";

export const metadata = {
  title: "P&L analytics",
};

export default function AnalyticsPage() {
  const snapshots = loadSnapshots();
  const trades = loadTrades();
  const days = loadDays();
  const settings = loadSettings();
  const first = snapshots[0];
  const last = snapshots[snapshots.length - 1];
  const startUsd = first
    ? combinedNavUsd(first.coinsEquity, first.gotradeEquity, first.usdphp)
    : 0;
  const endUsd = last
    ? combinedNavUsd(last.coinsEquity, last.gotradeEquity, last.usdphp)
    : 0;
  const delta = endUsd - startUsd;
  const noTradeDays = days.filter((d) => d.stance === "NO_TRADE").length;
  const fills = trades.filter((t) => !t.skipped);

  return (
    <div>
      <PageHeader
        kicker="Performance"
        title="P&L analytics"
        description={
          <>
            <Term id="combined-nav">Combined NAV</Term> in USD. Sample is a funded,{" "}
            <Term id="flatten">flat</Term> week into <Term id="CPI">CPI</Term> — not a
            trading edge yet.
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat
          label={<Term id="combined-nav">Combined NAV</Term>}
          value={money(endUsd, "USD")}
          hint={`vs ${money(startUsd, "USD")} on ${first?.date ?? "—"}`}
        />
        <Stat
          label="Path delta"
          value={money(delta, "USD")}
          hint={
            <>
              Cash/<Term id="FX">FX</Term> dust. Zero trading{" "}
              <Term id="realized-pnl">realized P&L</Term>.
            </>
          }
        />
        <Stat
          label={
            <>
              <Term id="fill">Fills</Term> / <Term id="NO_TRADE">NO TRADE</Term> days
            </>
          }
          value={`${fills.length} / ${noTradeDays}`}
          hint={`${days.length} sessions on the tape`}
        />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Combined equity (USD)</CardTitle>
          <CardDescription>
            Coins.ph translated at each snapshot’s USDPHP · Gotrade native USD · FX {settings.usdphp}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EquityChart snapshots={snapshots} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sample size</CardTitle>
          <CardDescription>
            First <Term id="clip">clip</Term> after <Term id="FOMC">FOMC</Term> is the
            start of a real P&L series. Until then this page is a cash path, not a
            scoreboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          <p>
            Win rate — n/a (0 <Term id="fill">fills</Term>)
          </p>
          <p>Expectancy — n/a</p>
          <p>
            By <Term id="venue">venue</Term> — both <Term id="book">books</Term>{" "}
            <Term id="flatten">flat</Term>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: ReactNode;
  value: string;
  hint: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription className="font-mono text-[10px] tracking-[0.18em] uppercase">
          {label}
        </CardDescription>
        <CardTitle className="font-mono text-2xl tabular">{value}</CardTitle>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardHeader>
    </Card>
  );
}
