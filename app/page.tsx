import Link from "next/link";

import { BookPanel } from "@/components/hud/book-panel";
import { SizeRail } from "@/components/hud/size-rail";
import { PageHeader } from "@/components/page-header";
import { StanceBadge } from "@/components/stance-badge";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { combinedNavPhp, combinedNavUsd } from "@/lib/books";
import { money } from "@/lib/format";
import {
  loadDesk,
  loadLatestJournal,
  loadRisk,
  loadSettings,
  loadWatchlists,
} from "@/lib/load";
import { formatManilaLong } from "@/lib/manila";

export const metadata = {
  title: "HUD",
};

export default function HudPage() {
  const desk = loadDesk();
  const settings = loadSettings();
  const journal = loadLatestJournal();
  const risk = loadRisk();
  const watch = loadWatchlists();
  const navUsd = combinedNavUsd(
    desk.books.coins.equity,
    desk.books.gotrade.equity,
    settings.usdphp,
  );
  const navPhp = combinedNavPhp(
    desk.books.coins.equity,
    desk.books.gotrade.equity,
    settings.usdphp,
  );
  const primaries = watch.crypto.filter((w) => desk.primaries.includes(w.symbol));

  return (
    <div>
      <PageHeader
        kicker="Heads-up display"
        title="Dual-book desk"
        description={`${formatManilaLong(desk.asOf)} · ${desk.stanceReason}`}
        actions={
          <Link href="/journal" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Open journal
          </Link>
        }
      />

      <Card className="mb-6 border-amber-400/25 bg-amber-400/8">
        <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <StanceBadge stance={desk.stance} />
            <div>
              <p className="text-sm font-medium">CPI → FOMC stand-down</p>
              <p className="text-sm text-muted-foreground">
                Primaries{" "}
                {desk.primaries.map((p) => (
                  <span key={p} className="mr-1 font-mono text-primary">
                    {p}
                  </span>
                ))}
                stay mapped. Permission is not granted.
              </p>
            </div>
          </div>
          <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
            As of {desk.asOf}
          </p>
        </CardContent>
      </Card>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <BookPanel
          book={desk.books.coins}
          footer={
            <div className="mt-4">
              <SizeRail
                cash={desk.books.coins.cash}
                min={risk.coins.sizeMin}
                max={risk.coins.sizeMax}
                aPlus={risk.coins.sizeAPlus}
                tone="coins"
                unit="₱"
              />
            </div>
          }
        />
        <BookPanel
          book={desk.books.gotrade}
          footer={
            <div className="mt-4">
              <SizeRail
                cash={desk.books.gotrade.cash}
                min={risk.gotrade.sizeMin}
                max={risk.gotrade.sizeMax}
                tone="gotrade"
                unit="$"
              />
              <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                Bias ${risk.gotrade.sizeBiasMin}–${risk.gotrade.sizeBiasMax} · ~
                {Math.floor(desk.books.gotrade.cash / risk.gotrade.sizeBiasMin)} clips
              </p>
            </div>
          }
        />
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardDescription className="font-mono tracking-[0.18em] uppercase">
              Combined NAV
            </CardDescription>
            <CardTitle className="font-mono text-3xl tabular">{money(navUsd, "USD")}</CardTitle>
            <p className="font-mono text-sm text-muted-foreground">{money(navPhp, "PHP")}</p>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              FX {settings.usdphp} USDPHP as of {settings.fxAsOf}. Display only — books stay
              native.
            </p>
            <div className="flex flex-wrap gap-2">
              {primaries.map((p) => (
                <Badge key={p.symbol} variant="outline" className="font-mono">
                  {p.symbol} {money(p.last, "USD", p.last >= 100 ? 0 : 2)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Catalysts</CardTitle>
            <CardDescription>Event cluster that zeros permission.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {desk.catalysts.map((c) => (
              <div
                key={c.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-border/80 px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.notes}</p>
                </div>
                <div className="text-right">
                  <Badge variant={c.impact === "high" ? "destructive" : "outline"}>
                    {c.impact}
                  </Badge>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    {c.date}
                    {c.timeManila ? ` ${c.timeManila}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Desk tape</CardTitle>
            <CardDescription>{journal.headline}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Tape label="Scout" body={journal.scout.headline} />
            <Tape label="Analyst" body={journal.analyst.thesis} />
            <Tape label="Risk" body={journal.risk.railsCheck} />
            <Tape label="Desk" body={journal.desk.decision} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Tape({ label, body }: { label: string; body: string }) {
  return (
    <div className="rounded-lg bg-muted/40 px-3 py-2.5">
      <p className="mb-1 font-mono text-[10px] tracking-[0.18em] text-primary uppercase">
        {label}
      </p>
      <p className="line-clamp-4 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
