import { PageHeader } from "@/components/page-header";
import { Term } from "@/components/term";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isGlossaryId } from "@/lib/glossary";
import { money, pct, pnlClass } from "@/lib/format";
import { loadWatchlists } from "@/lib/load";
import type { WatchItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Watchlists",
};

export default function WatchlistsPage() {
  const lists = loadWatchlists();

  return (
    <div>
      <PageHeader
        kicker="Universe"
        title="Watchlists"
        description={
          <>
            Desk marks as of {lists.asOf}. BTC and XRP are{" "}
            <Term id="primary">primaries</Term>. US <Term id="book">book</Term> is megacaps
            + ETFs — <Term id="benchmark">benchmarks</Term> until{" "}
            <Term id="permission">permission</Term>.
          </>
        }
      />

      <Tabs defaultValue="crypto">
        <TabsList>
          <TabsTrigger value="crypto">
            Crypto · <Term id="coins" nested>Coins.ph</Term>
          </TabsTrigger>
          <TabsTrigger value="us">
            US · <Term id="gotrade" nested>Gotrade</Term>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="crypto" className="mt-4">
          <WatchTable items={lists.crypto} />
        </TabsContent>
        <TabsContent value="us" className="mt-4">
          <WatchTable items={lists.us} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function WatchTable({ items }: { items: WatchItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          {items.length} names · marks are desk snapshots, not a live feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>
                Role
              </TableHead>
              <TableHead className="text-right">Last</TableHead>
              <TableHead className="text-right">Day</TableHead>
              <TableHead className="hidden md:table-cell">Thesis</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.symbol}
                className={item.role === "primary" ? "bg-primary/5" : undefined}
              >
                <TableCell>
                  <div className="font-mono font-medium">{item.symbol}</div>
                  <div className="text-xs text-muted-foreground">{item.name}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={item.role === "primary" ? "default" : "outline"}>
                    {isGlossaryId(item.role) ? (
                      <Term id={item.role}>{item.role}</Term>
                    ) : (
                      item.role
                    )}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono tabular">
                  {money(item.last, item.currency, item.last >= 100 ? 2 : 4)}
                </TableCell>
                <TableCell
                  className={cn("text-right font-mono tabular", pnlClass(item.changePct))}
                >
                  {pct(item.changePct)}
                </TableCell>
                <TableCell className="hidden max-w-md text-sm text-muted-foreground md:table-cell">
                  {item.thesis}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
