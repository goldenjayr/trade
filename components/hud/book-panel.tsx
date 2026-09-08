import type { ReactNode } from "react";

import { Money } from "@/components/money";
import { Term } from "@/components/term";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { money, pct } from "@/lib/format";
import type { Book, Venue } from "@/lib/types";
import { cn } from "@/lib/utils";

export function venueTone(venue: Venue) {
  return venue === "coins" ? "text-coins" : "text-gotrade";
}

export function BookPanel({
  book,
  footer,
}: {
  book: Book;
  footer?: ReactNode;
}) {
  const flat = book.positions.length === 0;

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader className="border-b border-border/60">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardDescription className={cn("font-mono tracking-[0.18em] uppercase", venueTone(book.venue))}>
              {book.label}
            </CardDescription>
            <CardTitle className="mt-1 font-mono text-3xl tabular">
              {money(book.equity, book.currency)}
            </CardTitle>
          </div>
          <Badge variant="outline" className="font-mono text-[10px] tracking-widest uppercase">
            {flat ? "Flat" : `${book.positions.length} pos`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4 pt-4">
        <Metric label="Cash" value={<Money value={book.cash} currency={book.currency} />} />
        <Metric
          label={<Term id="day-pnl">Day P&L</Term>}
          value={<Money value={book.dayPnl} currency={book.currency} signed />}
        />
        <Metric
          label="Total P&L"
          value={<Money value={book.totalPnl} currency={book.currency} signed />}
        />
      </CardContent>
      <div className="px-4 pb-4">
        {flat ? (
          <div className="rounded-lg border border-dashed border-border/80 px-3 py-6 text-center">
            <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              Books are flat
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Cash is the position.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Mark</TableHead>
                <TableHead className="text-right">P&L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {book.positions.map((p) => (
                <TableRow key={p.symbol}>
                  <TableCell className="font-medium">{p.symbol}</TableCell>
                  <TableCell className="text-right font-mono tabular">{p.qty}</TableCell>
                  <TableCell className="text-right font-mono tabular">
                    {money(p.mark, book.currency)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Money value={p.pnl} currency={book.currency} signed />
                    <span className="ml-1 font-mono text-xs text-muted-foreground">
                      {pct(p.pnlPct)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {footer}
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.16em] text-muted-foreground uppercase">{label}</p>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  );
}
