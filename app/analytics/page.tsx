import { EquityChart } from "@/components/charts/equity-chart";
import { PageHeader } from "@/components/page-header";
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
        description="Combined NAV in USD. Sample is a funded, flat week into CPI — not a trading edge yet."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat
          label="Combined NAV"
          value={money(endUsd, "USD")}
          hint={`vs ${money(startUsd, "USD")} on ${first?.date ?? "—"}`}
        />
        <Stat
          label="Path delta"
          value={money(delta, "USD")}
          hint="Cash/FX dust. Zero trading P&L."
        />
        <Stat
          label="Fills / NO TRADE days"
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
            First clip after FOMC is the start of a real P&L series. Until then this page is a
            cash path, not a scoreboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          <p>Win rate — n/a (0 fills)</p>
          <p>Expectancy — n/a</p>
          <p>By venue — both books flat</p>
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
  label: string;
  value: string;
  hint: string;
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
