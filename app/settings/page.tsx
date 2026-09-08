import type { ReactNode } from "react";

import { PageHeader } from "@/components/page-header";
import { DisplayPrefs } from "@/components/settings/display-prefs";
import { Term } from "@/components/term";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loadSettings } from "@/lib/load";

export const metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  const settings = loadSettings();

  return (
    <div>
      <PageHeader
        kicker="Desk config"
        title="Settings"
        description={
          <>
            Timezone is locked to <Term id="manila-time">Asia/Manila</Term>. Display prefs
            stay in this browser. <Term id="book">Books</Term> live in git JSON — never in
            secrets.
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Identity</CardTitle>
            <CardDescription>From data/settings.json</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 font-mono text-sm">
            <Row k="Desk" v={settings.deskName} />
            <Row k="Operator" v={settings.operator} />
            <Row k={<Term id="manila-time">Timezone</Term>} v={settings.timezone} />
            <Row k={<Term id="USDPHP">USDPHP</Term>} v={`${settings.usdphp} · ${settings.fxAsOf}`} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Term id="venue">Venues</Term>
            </CardTitle>
            <CardDescription>
              Dual <Term id="book">books</Term>, native currency
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-coins">{settings.venues.coins.label}</p>
              <p className="text-muted-foreground">{settings.venues.coins.note}</p>
            </div>
            <div>
              <p className="font-medium text-gotrade">{settings.venues.gotrade.label}</p>
              <p className="text-muted-foreground">{settings.venues.gotrade.note}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Display</CardTitle>
            <CardDescription>Local only. Does not change published data.</CardDescription>
          </CardHeader>
          <CardContent>
            <DisplayPrefs />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily publish</CardTitle>
            <CardDescription>For agents. Never commit secrets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 font-mono text-xs text-muted-foreground">
            <p>1. Write inbox/YYYY-MM-DD.json (DailyPacket)</p>
            <p>2. Optional predictions[] upserts data/predictions.json</p>
            <p>3. npm run desk:ingest</p>
            <p>4. npm run desk:publish</p>
            <p>Commit message: desk: YYYY-MM-DD (Manila)</p>
            <p>No-op if data/ is clean. Refuses .env, keys, pems.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: ReactNode; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right text-foreground">{v}</span>
    </div>
  );
}
