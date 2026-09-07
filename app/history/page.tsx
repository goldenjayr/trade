import { PageHeader } from "@/components/page-header";
import { StanceBadge } from "@/components/stance-badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { money, venueLabel } from "@/lib/format";
import { loadDays, loadTrades } from "@/lib/load";

export const metadata = {
  title: "Trade history",
};

export default function HistoryPage() {
  const trades = loadTrades();
  const days = [...loadDays()].reverse();

  return (
    <div>
      <PageHeader
        kicker="Tape"
        title="Trade history"
        description="Fills, skips, and NO TRADE days. Seed week is flat — cash is the position."
      />

      <Card className="mb-6">
        <CardContent className="pt-4">
          {trades.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center">
              <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
                No fills
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                2026-09-07 is a sample NO TRADE day. History will list Coins.ph and Gotrade
                clips here after the first post-FOMC ticket.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Side</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Fees</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((t) => (
                  <TableRow key={t.id} className={t.skipped ? "opacity-60" : undefined}>
                    <TableCell className="font-mono text-xs">{t.date}</TableCell>
                    <TableCell>{venueLabel(t.venue)}</TableCell>
                    <TableCell className="font-mono">{t.symbol}</TableCell>
                    <TableCell className="uppercase">{t.side}</TableCell>
                    <TableCell className="text-right font-mono">{t.qty}</TableCell>
                    <TableCell className="text-right font-mono">
                      {money(t.price, t.venue === "coins" ? "PHP" : "USD")}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {money(t.fees, t.venue === "coins" ? "PHP" : "USD")}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {t.skipped ? t.skipReason : t.notes}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <h2 className="mb-3 font-heading text-sm tracking-[0.16em] text-muted-foreground uppercase">
        Day log
      </h2>
      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Stance</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead className="text-right">Trades</TableHead>
                <TableHead className="text-right">Coins</TableHead>
                <TableHead className="text-right">Gotrade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {days.map((d) => (
                <TableRow key={d.date}>
                  <TableCell className="font-mono text-xs">{d.date}</TableCell>
                  <TableCell>
                    <StanceBadge stance={d.stance} />
                  </TableCell>
                  <TableCell className="max-w-md text-sm text-muted-foreground">
                    {d.summary}
                  </TableCell>
                  <TableCell className="text-right font-mono">{d.tradeCount}</TableCell>
                  <TableCell className="text-right font-mono">
                    {money(d.coinsEquity, "PHP")}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {money(d.gotradeEquity, "USD")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
