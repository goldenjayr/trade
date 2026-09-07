# Trade Vision

[![CI](https://github.com/goldenjayr/trade/actions/workflows/ci.yml/badge.svg)](https://github.com/goldenjayr/trade/actions/workflows/ci.yml)

Personal trading command center for a **Coins.ph (PHP crypto)** book and a **Gotrade (USD US equities/ETFs)** book. Next.js App Router, TypeScript, Tailwind, shadcn/ui, Recharts. All desk state is **typed JSON under `data/`** — no live brokerage API, no secrets in git.

Local Mac checkout: `/Users/dongje/dongje/personal/trade` (`git@github.com:goldenjayr/trade.git`).

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build    # must pass before merge
```

Pushes to `main` and pull requests run those same `lint` and `build` checks in [GitHub Actions](https://github.com/goldenjayr/trade/actions/workflows/ci.yml).

## Information architecture

| Route | Page | What it is |
| --- | --- | --- |
| `/` | HUD | Dual books, cash, positions, P&L, stance, primaries, catalysts, Scout/Analyst/Risk/Desk tape |
| `/journal` | Daily research | Four desks: Scout → Analyst → Risk → Desk |
| `/journal/[date]` | Journal by day | Same briefing, dated |
| `/predictions` | Calls scorecard | TA forecasts with invalidation — HIT / MISS / EXPIRED, not guarantees |
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

Optional: `primaries`, `trades`, `catalysts`, `watchlistMarks`, `predictions`, `usdphp`, `notes`.

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
- `data/predictions.json` (by prediction `id`) if `predictions` present
- watchlist last/change if `watchlistMarks` present
- `data/settings.json` FX if `usdphp` present

Equity is computed (`cash + Σ qty * mark`). Do not hand-edit computed fields unless you know why.

### Predictions / calls (Analyst + Desk)

`/predictions` is a **scorecard of scenario calls**, not a forecast feed. Every object is a map with invalidation. The UI says that on purpose.

Append or update calls from a morning brief by putting `predictions[]` on the DailyPacket (same file you already drop in `inbox/`). `desk:ingest` upserts by `id` into `data/predictions.json`. Re-ingest is safe.

```json
{
  "id": "btc-wait-2026-09-08",
  "dateOpened": "2026-09-08",
  "symbol": "BTC",
  "venue": "coins",
  "role": "primary",
  "thesis": "Primary wait. Do not chase into CPI.",
  "direction": "long_wait",
  "entryZone": { "low": 78000, "high": 78800 },
  "invalidation": "Below structure, or chase into CPI",
  "invalidationPrice": 77200,
  "conviction": 3,
  "horizon": "event",
  "status": "open",
  "source": "analyst"
}
```

| Field | Notes |
| --- | --- |
| `venue` | `coins` \| `gotrade` \| `macro` |
| `direction` | `long_wait` \| `short_watch` \| `range` \| `breakout` \| `none` |
| `horizon` | `intraday` \| `swing` \| `event` |
| `status` | `open` \| `hit_entry` \| `hit_target` \| `invalidated` \| `expired` \| `cancelled` |
| `conviction` | Integer 1–10 |
| `source` | `analyst` (levels/thesis) or `desk` (stance / cancel) |
| `role` | Optional `primary` \| `scout` \| `stance` |
| `target` | Optional number or `{ t1, t2 }` |
| `invalidation` | Text and/or `invalidationPrice` — at least one required |
| `resolvedAt` / `outcomeNote` | Set when you close the call |

**How to grade:** later packet, same `id`, new `status` + `resolvedAt`. HIT = `hit_target`. MISS = `invalidated`. EXPIRED = `expired`. Hit rate is HIT / (HIT + MISS). Cancelled and expired do not enter the rate. Open and `hit_entry` stay on the open book.

Analyst owns the map (`source: "analyst"`). Desk owns stance calls and cancels (`source: "desk"`). Copy the seeded objects in `inbox/2026-09-07.json` if you want a full morning-brief example.

The ledger is one file (`data/predictions.json`), same pattern as `trades.json`. Per-day copies under `data/predictions/` are not required.

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
| `data/predictions.json` | TA calls ledger (open + graded) |
| `data/days.json` | One row per session |
| `data/snapshots.json` | Equity path |
| `data/routines.json` | Calendar windows |
| `data/journal/*.json` | Research briefings |

`lib/load.ts` is the only reader the UI uses. Scripts live in `scripts/desk-ingest.ts` and `scripts/desk-publish.ts`.
