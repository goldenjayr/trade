import type { ReactNode } from "react";

import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { StanceBadge } from "@/components/stance-badge";
import { Term } from "@/components/term";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadJournal } from "@/lib/load";
import { formatManilaLong } from "@/lib/manila";
import { cn } from "@/lib/utils";

export function JournalView({ date, dates }: { date: string; dates: string[] }) {
  const entry = loadJournal(date);

  return (
    <div>
      <PageHeader
        kicker="Daily research"
        title={formatManilaLong(date)}
        description={entry.headline}
        actions={<StanceBadge stance={entry.stance} />}
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {dates.map((d) => (
          <Link
            key={d}
            href={`/journal/${d}`}
            className={cn(
              buttonVariants({ variant: d === date ? "default" : "outline", size: "sm" }),
              "font-mono",
            )}
          >
            {d}
          </Link>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <DeskCard
          kicker={
            <>
              01 <Term id="scout">Scout</Term>
            </>
          }
          title={entry.scout.headline}
          tone="coins"
        >
          <ul className="space-y-2 text-sm text-muted-foreground">
            {entry.scout.bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          {entry.scout.sources?.length ? (
            <p className="mt-4 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              {entry.scout.sources.join(" · ")}
            </p>
          ) : null}
        </DeskCard>

        <DeskCard
          kicker={
            <>
              02 <Term id="analyst">Analyst</Term>
            </>
          }
          title="Map, not a ticket"
          tone="gotrade"
        >
          <p className="mb-4 text-sm text-muted-foreground">{entry.analyst.thesis}</p>
          <div className="space-y-2">
            {entry.analyst.levels.map((lvl) => (
              <div key={lvl.symbol} className="rounded-lg border border-border/70 px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">{lvl.symbol}</span>
                  <Badge variant="outline">
                    <Term id="level-watch">watch</Term>
                  </Badge>
                </div>
                {lvl.note ? (
                  <p className="mt-1 text-sm text-muted-foreground">{lvl.note}</p>
                ) : null}
                {lvl.invalidation ? (
                  <p className="mt-1 text-xs text-loss">
                    <Term id="invalidation">Invalidation</Term>: {lvl.invalidation}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{entry.analyst.notes}</p>
        </DeskCard>

        <DeskCard
          kicker={
            <>
              03 <Term id="risk">Risk</Term>
            </>
          }
          title={entry.risk.sizeNote}
          tone="loss"
        >
          <p className="mb-3 text-sm text-muted-foreground">
            <Term id="rails">Rails</Term>: {entry.risk.railsCheck}
          </p>
          <p className="mb-3 text-sm">
            <Term id="fee-skip">Fee-skip</Term>: {entry.risk.feeSkip}
          </p>
          <ul className="space-y-1.5 text-sm">
            {entry.risk.kills.map((k) => (
              <li
                key={k}
                className="rounded-md border border-loss/30 bg-loss/10 px-2.5 py-1.5 text-loss"
              >
                {k}
              </li>
            ))}
          </ul>
        </DeskCard>

        <DeskCard
          kicker={
            <>
              04 <Term id="desk">Desk</Term>
            </>
          }
          title={entry.desk.decision}
          tone="primary"
        >
          <ul className="mb-4 space-y-2 text-sm text-muted-foreground">
            {entry.desk.actions.map((a) => (
              <li key={a} className="flex gap-2">
                <span className="text-primary">→</span>
                {a}
              </li>
            ))}
          </ul>
          <p className="text-sm">
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              Next open
            </span>
            <br />
            {entry.desk.nextOpen}
          </p>
        </DeskCard>
      </div>
    </div>
  );
}

function DeskCard({
  kicker,
  title,
  children,
  tone,
}: {
  kicker: ReactNode;
  title: string;
  children: ReactNode;
  tone: "coins" | "gotrade" | "loss" | "primary";
}) {
  const color =
    tone === "coins"
      ? "text-coins"
      : tone === "gotrade"
        ? "text-gotrade"
        : tone === "loss"
          ? "text-loss"
          : "text-primary";
  return (
    <Card className="bg-card/80">
      <CardHeader>
        <p className={cn("font-mono text-[10px] tracking-[0.2em] uppercase", color)}>
          {kicker}
        </p>
        <CardTitle className="text-base leading-snug">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
