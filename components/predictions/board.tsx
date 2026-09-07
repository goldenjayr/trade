"use client";

import { useMemo, useState } from "react";

import { OutcomeBadge } from "@/components/predictions/outcome-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  directionLabel,
  filterPredictions,
  formatEntryZone,
  formatLevel,
  formatTarget,
  isClosedCall,
  isOpenCall,
  outcomeBadge,
  predictionVenueLabel,
  scorePredictions,
  sortCallsForDisplay,
} from "@/lib/predictions";
import type { Prediction, PredictionsFile } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "open_book", label: "Open book" },
  { value: "closed", label: "Closed" },
  { value: "open", label: "Open" },
  { value: "hit_entry", label: "Hit entry" },
  { value: "hit_target", label: "Hit target" },
  { value: "invalidated", label: "Invalidated" },
  { value: "expired", label: "Expired" },
  { value: "cancelled", label: "Cancelled" },
];

const BOOK_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All books" },
  { value: "coins", label: "Coins.ph" },
  { value: "gotrade", label: "Gotrade" },
  { value: "macro", label: "Macro" },
];

function uniqueSymbols(calls: Prediction[]): string[] {
  return [...new Set(calls.map((c) => c.symbol))].sort();
}

function fmtPct(value: number | null): string {
  if (value === null) return "n/a";
  return `${(value * 100).toFixed(0)}%`;
}

function fmtConv(value: number | null): string {
  if (value === null) return "n/a";
  return value.toFixed(1);
}

export function PredictionsBoard({ file }: { file: PredictionsFile }) {
  const [symbol, setSymbol] = useState("all");
  const [status, setStatus] = useState("all");
  const [venue, setVenue] = useState("all");

  const visible = useMemo(
    () => filterPredictions(file.calls, { symbol, status, venue }),
    [file.calls, symbol, status, venue],
  );
  const stats = useMemo(() => scorePredictions(file.calls), [file.calls]);
  const open = sortCallsForDisplay(visible.filter(isOpenCall));
  const closed = sortCallsForDisplay(visible.filter(isClosedCall));
  const symbols = uniqueSymbols(file.calls);

  return (
    <div>
      <Card className="mb-6 border-amber-400/25 bg-amber-400/8">
        <CardContent className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-amber-200 uppercase">
              Not a guarantee
            </p>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              {file.disclaimer ??
                "These are scenario calls with invalidation — not guaranteed predictions. A wait zone is a map, not a ticket."}
            </p>
          </div>
          <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
            Ledger {file.asOf}
          </p>
        </CardContent>
      </Card>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Open / live"
          value={`${stats.open} / ${stats.live}`}
          hint={`${file.calls.length} calls on the ledger`}
        />
        <Stat
          label="Hit rate"
          value={fmtPct(stats.hitRate)}
          hint={
            stats.graded === 0
              ? "No HIT/MISS grades yet — sample is empty"
              : `${stats.hits} HIT · ${stats.misses} MISS · n=${stats.graded}`
          }
        />
        <Stat
          label="Avg conv · HIT"
          value={fmtConv(stats.avgConvictionHits)}
          hint="Conviction 1–10 on hit_target only"
        />
        <Stat
          label="Avg conv · MISS"
          value={fmtConv(stats.avgConvictionMisses)}
          hint="Conviction 1–10 on invalidated only"
        />
      </div>

      <div className="mb-6 flex flex-col gap-2 sm:flex-row">
        <FilterSelect
          label="Symbol"
          value={symbol}
          onChange={setSymbol}
          options={[
            { value: "all", label: "All symbols" },
            ...symbols.map((s) => ({ value: s, label: s })),
          ]}
        />
        <FilterSelect
          label="Status"
          value={status}
          onChange={setStatus}
          options={STATUS_OPTIONS}
        />
        <FilterSelect
          label="Book"
          value={venue}
          onChange={setVenue}
          options={BOOK_OPTIONS}
        />
      </div>

      <h2 className="mb-3 font-heading text-sm tracking-[0.16em] text-muted-foreground uppercase">
        Open calls
      </h2>
      {open.length === 0 ? (
        <Empty note="No open calls match these filters." />
      ) : (
        <div className="mb-8 grid gap-4 lg:grid-cols-2">
          {open.map((call) => (
            <CallCard key={call.id} call={call} />
          ))}
        </div>
      )}

      <h2 className="mb-3 font-heading text-sm tracking-[0.16em] text-muted-foreground uppercase">
        Closed calls
      </h2>
      <Card>
        <CardContent className="pt-4">
          {closed.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No closed calls in this filter. HIT / MISS / EXPIRED land here after the horizon.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Opened</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead className="hidden md:table-cell">Levels</TableHead>
                  <TableHead className="text-right">Conv</TableHead>
                  <TableHead className="hidden lg:table-cell">Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {closed.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell className="font-mono text-xs">{call.dateOpened}</TableCell>
                    <TableCell>
                      <div className="font-mono font-medium">{call.symbol}</div>
                      <div className="text-xs text-muted-foreground">
                        {predictionVenueLabel(call.venue)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <OutcomeBadge outcome={outcomeBadge(call.status)} />
                    </TableCell>
                    <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                      {formatEntryZone(call.entryZone) ?? "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular">
                      {call.conviction}
                    </TableCell>
                    <TableCell className="hidden max-w-sm text-sm text-muted-foreground lg:table-cell">
                      {call.outcomeNote ?? call.thesis}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CallCard({ call }: { call: Prediction }) {
  const zone = formatEntryZone(call.entryZone);
  const target = formatTarget(call.target);
  const outcome = outcomeBadge(call.status);

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardDescription className="font-mono tracking-[0.18em] uppercase">
              {predictionVenueLabel(call.venue)} · {call.horizon} · {call.source}
            </CardDescription>
            <CardTitle className="font-mono text-2xl">{call.symbol}</CardTitle>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            <OutcomeBadge outcome={outcome} />
            {call.role ? (
              <Badge variant={call.role === "primary" ? "default" : "outline"}>
                {call.role}
              </Badge>
            ) : null}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{call.thesis}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Level k="Direction" v={directionLabel(call.direction)} />
          <Level k="Entry" v={zone ?? "—"} />
          <Level k="Target" v={target ?? "—"} />
          <Level
            k="Inv px"
            v={call.invalidationPrice === undefined ? "—" : formatLevel(call.invalidationPrice)}
          />
        </div>
        <p className="text-xs text-loss">Invalidation: {call.invalidation ?? "price only"}</p>
        <Conviction value={call.conviction} />
      </CardContent>
    </Card>
  );
}

function Level({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg bg-muted/40 px-2.5 py-2">
      <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
        {k}
      </p>
      <p className="font-mono text-xs capitalize">{v}</p>
    </div>
  );
}

function Conviction({ value }: { value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
        <span>Conviction</span>
        <span className="tabular text-foreground">
          {value}
          <span className="text-muted-foreground">/10</span>
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary shadow-[0_0_10px_oklch(0.8_0.11_195/0.55)]"
          style={{ width: `${value * 10}%` }}
        />
      </div>
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

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30",
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Empty({ note }: { note: string }) {
  return (
    <Card className="mb-8">
      <CardContent className="py-10 text-center text-sm text-muted-foreground">
        {note}
      </CardContent>
    </Card>
  );
}
