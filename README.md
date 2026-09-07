# Trade Vision

Personal trading command center for a **Coins.ph (PHP crypto)** book and a **Gotrade (USD US equities/ETFs)** book. Next.js App Router, TypeScript, Tailwind, shadcn/ui, Recharts. All desk state is **typed JSON under `data/`** — no live brokerage API, no secrets in git.

Local Mac checkout: `/Users/dongje/dongje/personal/trade` (`git@github.com:goldenjayr/trade.git`).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # must pass before merge
```

## Information architecture

| Route | Page | What it is |
| --- | --- | --- |
| `/` | HUD | Dual books, cash, positions, P&L, stance, primaries, catalysts, Scout/Analyst/Risk/Desk tape |
| `/journal` | Daily research | Four desks: Scout → Analyst → Risk → Desk |
| `/journal/[date]` | Journal by day | Same briefing, dated |
| `/watchlists` | Watchlists | BTC ETH SOL XRP BNB LINK SUI · US megacaps + ETFs |
| `/history` | Trade history | Fills + skipped tickets + NO TRADE day log |
| `/analytics` | P&L analytics | Combined NAV path (USD), sample-size honesty |
| `/risk` | Risk rails | Coins ₱800–₱1,200 (A+ ~₱1,500) −3%/+6% · Gotrade $15–$25 bias $20–$25 · fee-skip · kills |
| `/calendar` | Routines | Manila 07:00 / 12:00 / 15:00 / 21:00 · Monday 08:00 weekly |
| `/settings` | Settings | Identity, FX, venues, local display prefs, publish cheat-sheet |

Timezone is **Asia/Manila** everywhere. Combined NAV on the HUD is display-only (USDPHP in `data/settings.json`); each book stays native.

## Seed — 2026-09-07 (Monday)

- Coins.ph **₱1,723** cash, **FLAT**
- Gotrade **$46.89** cash, **FLAT**
- Stance **NO TRADE** — US CPI into FOMC week
- Primaries **BTC** and **XRP**
- Sample NO TRADE day in `data/journal/2026-09-07.json` and `inbox/2026-09-07.json`

Marks on the watchlist are desk snapshots, not a live feed.

---

## For agents — daily publish

Do **not** put API keys, session cookies, `.env`, PEM/P12, or brokerage credentials in `data/`, `inbox/`, or any commit. `desk:publish` will refuse secret-like paths.

### 1. Write a daily packet

Drop `inbox/YYYY-MM-DD.json` (Manila date). Shape is `DailyPacket` in `lib/types.ts`, validated by `lib/schema.ts`.

Required:

- `date` (`YYYY-MM-DD`)
- `stance` — `NO_TRADE` \| `WATCH` \| `ARMED` \| `IN_TRADE` \| `REDUCE`
- `stanceReason`
- `books.coins` / `books.gotrade` — `cash`, `currency`, `positions[]` (`symbol`, `name`, `qty`, `avgCost`, `mark`)
- `journal` — Scout / Analyst / Risk / Desk (date must match packet date)

Optional: `primaries`, `trades`, `catalysts`, `watchlistMarks`, `usdphp`, `notes`.

Copy `inbox/2026-09-07.json` as the template.

### 2. Ingest — merge into `data/`

```bash
npm run desk:ingest
# or a single file:
npm run desk:ingest -- inbox/2026-09-08.json
```

Idempotent upsert for that date:

- `data/journal/YYYY-MM-DD.json` + `data/journal/index.json`
- `data/desk.json` if the packet date is the latest as-of
- `data/days.json`, `data/snapshots.json`
- `data/trades.json` (by trade `id`)
- watchlist last/change if `watchlistMarks` present
- `data/settings.json` FX if `usdphp` present

Equity is computed (`cash + Σ qty * mark`). Do not hand-edit computed fields unless you know why.

### 3. Publish — commit + push data only

```bash
npm run desk:publish
```

- Commit message: `desk: YYYY-MM-DD (Manila)` using **today in Asia/Manila**
- Stages only `data/` and `inbox/*.json`
- **No-op** if those trees are clean
- Never `-A`, never `.env*`, never key/pem/credential paths
- `git push -u origin HEAD`

App code changes are a normal PR. Daily marks are `desk:publish`.

---

## Data map

| File | Role |
| --- | --- |
| `data/desk.json` | Latest HUD snapshot (stance, books, catalysts) |
| `data/settings.json` | Operator, Manila TZ, USDPHP |
| `data/risk.json` | Rails, fee-skip, kills |
| `data/watchlists.json` | Crypto + US universe |
| `data/trades.json` | Fills / skips |
| `data/days.json` | One row per session |
| `data/snapshots.json` | Equity path |
| `data/routines.json` | Calendar windows |
| `data/journal/*.json` | Research briefings |

`lib/load.ts` is the only reader the UI uses. Scripts live in `scripts/desk-ingest.ts` and `scripts/desk-publish.ts`.
