export interface GlossaryEntry {
  label: string;
  definition: string;
}

export const GLOSSARY = {
  stance: {
    label: "stance",
    definition:
      "The desk’s permission for the day: whether you may trade, only watch, are ready to enter, already in a position, or cutting size.",
  },
  NO_TRADE: {
    label: "NO TRADE",
    definition:
      "Do not open new trades. Events, fees, or risk have zeroed permission. Journal it — do not negotiate.",
  },
  WATCH: {
    label: "WATCH",
    definition:
      "Watch prices and news, but do not enter yet. The map is live; permission is not.",
  },
  ARMED: {
    label: "ARMED",
    definition:
      "The setup is mapped and size is allowed. Ready to enter only if price reaches the planned zone.",
  },
  IN_TRADE: {
    label: "IN TRADE",
    definition:
      "You already have a position. Manage it by the plan — do not invent a new one mid-clip.",
  },
  REDUCE: {
    label: "REDUCE",
    definition:
      "Cut size or take profit. Do not add. The job is smaller risk, not a bigger bet.",
  },
  primary: {
    label: "primary",
    definition:
      "The main name the desk is focused on today (for this book: BTC and XRP). Everything else is secondary.",
  },
  scout: {
    label: "scout",
    definition:
      "The research desk that gathers headlines, flows, and overnight tape before anyone maps a trade.",
  },
  analyst: {
    label: "analyst",
    definition:
      "The desk that draws the map: levels, thesis, invalidation. A map is not a ticket.",
  },
  risk: {
    label: "risk",
    definition:
      "The desk that checks size, stops, fee-skip, and kill switches before permission is granted.",
  },
  desk: {
    label: "desk",
    definition:
      "The decision seat. Owns stance, cancels, and the written actions for the session.",
  },
  "wait-zone": {
    label: "wait zone",
    definition:
      "A price band you are waiting for. It is a map, not a ticket — do not chase above it.",
  },
  "entry-zone": {
    label: "entry zone",
    definition:
      "The price band where a planned buy or sell is valid. Outside this band, the idea is not the same trade.",
  },
  invalidation: {
    label: "invalidation",
    definition:
      "The price or event that proves the call wrong. If it hits, the idea is dead — exit or stand down.",
  },
  conviction: {
    label: "conviction",
    definition:
      "How strongly the desk believes the call, from 1 (weak) to 10 (very strong). Low conviction means small size or no ticket.",
  },
  horizon: {
    label: "horizon",
    definition:
      "How long the call is meant to last: same day (intraday), a few days (swing), or around a specific event.",
  },
  PLAN: {
    label: "PLAN",
    definition:
      "Written rules before the trade: size, entry, stop, target. If it is not on the plan, do not do it.",
  },
  rails: {
    label: "rails",
    definition:
      "Hard risk limits: how big a ticket can be, where the stop lives, when fees force a skip, and which events kill permission.",
  },
  "fee-skip": {
    label: "fee-skip",
    definition:
      "Skip the trade if fees eat too much of the ticket. Coins: more than 0.8% of notional. Gotrade: more than 1% of a floor ticket.",
  },
  notional: {
    label: "notional",
    definition:
      "The money size of the ticket: price × quantity. Fees are judged as a percent of this number.",
  },
  "max-1": {
    label: "max-1",
    definition:
      "At most one clip at a time when armed. Do not stack extra tickets to feel active.",
  },
  "take-profit": {
    label: "take-profit",
    definition:
      "The price where you sell (or cover) to lock in gains. Also written as TP.",
  },
  TP: {
    label: "TP",
    definition:
      "Take-profit. The planned exit that banks the win. Coins target is +6% from entry.",
  },
  stop: {
    label: "stop",
    definition:
      "The price where you exit to cap the loss. Honor it — hoping is not a plan.",
  },
  "hard-stop": {
    label: "hard stop",
    definition:
      "A stop you must honor, no averaging down. Coins hard stop is −3% from entry.",
  },
  "stop-market": {
    label: "Stop-Market",
    definition:
      "A sell or buy that becomes a market order once a trigger price is hit. After every Coins buy fill, place this first at entry × 0.97 (−3%) for the full size.",
  },
  "stop-limit": {
    label: "Stop-Limit",
    definition:
      "A sell or buy that becomes a limit order at your limit price once the stop trigger hits. It may not fill if price gaps through the limit.",
  },
  oco: {
    label: "OCO",
    definition:
      "One-cancels-the-other: when one order fills, the other is cancelled. Coins does not offer OCO — place the stop and the +6% take-profit as two separate orders.",
  },
  "r-r": {
    label: "R:R",
    definition:
      "Reward-to-risk. How much you aim to make versus how much you risk. 2R means the target is twice the stop.",
  },
  "kill-switch": {
    label: "kill switch",
    definition:
      "A rule that immediately forbids new trades — CPI, FOMC, flatten, revenge clips. If a kill is live, stance is NO TRADE.",
  },
  flatten: {
    label: "flatten",
    definition:
      "Close every position and sit in cash. Flat means cash is the position.",
  },
  CPI: {
    label: "CPI",
    definition:
      "US Consumer Price Index — the big inflation print. This desk stands down into the window; do not invent a setup.",
  },
  FOMC: {
    label: "FOMC",
    definition:
      "Federal Open Market Committee — the Fed’s rate decision and press conference. High-impact. No new tickets through the statement.",
  },
  PPI: {
    label: "PPI",
    definition:
      "Producer Price Index — upstream inflation data that can move markets the day before CPI.",
  },
  "etf-flows": {
    label: "ETF flows",
    definition:
      "Money going into or out of ETFs (for example Bitcoin ETFs). A flow signal, not a reason to chase.",
  },
  spot: {
    label: "Spot",
    definition:
      "Buying or selling the actual coin or share at the market price — not a swap or derivative.",
  },
  convert: {
    label: "Convert",
    definition:
      "Coins.ph swap from one asset to another. Often a worse spread than a clean spot clip — treat it as a fee.",
  },
  "spot-vs-convert": {
    label: "Spot vs Convert",
    definition:
      "Spot is a real buy/sell of the asset. Convert is a Coins.ph swap, usually pricier. Prefer spot when the rails allow a clip.",
  },
  maker: {
    label: "maker",
    definition:
      "You add a resting order to the book. Usually cheaper fees than taking someone else’s order.",
  },
  taker: {
    label: "taker",
    definition:
      "You hit an existing order and trade immediately. Usually more expensive fees than making.",
  },
  "maker-taker": {
    label: "maker/taker",
    definition:
      "Maker rests an order (cheaper). Taker hits one (faster, pricier). Fees count toward the fee-skip rail.",
  },
  long_wait: {
    label: "long wait",
    definition:
      "Bullish idea, but waiting for a cheaper entry. Do not chase spot above the wait zone.",
  },
  short_watch: {
    label: "short watch",
    definition:
      "Bearish idea on watch only. You are mapping a fade, not shorting yet.",
  },
  breakout: {
    label: "breakout",
    definition:
      "Price pushing through a level and continuing that way. Needs the level to hold as support or resistance after the push.",
  },
  range: {
    label: "range",
    definition:
      "Price bouncing between a floor and a ceiling. Fade the edges; do not pretend it is a trend.",
  },
  none: {
    label: "none",
    definition:
      "No directional call. The desk is mapping or standing down, not picking a side.",
  },
  HIT: {
    label: "HIT",
    definition:
      "The call reached its target. Graded right. Hit rate is HIT ÷ (HIT + MISS).",
  },
  MISS: {
    label: "MISS",
    definition:
      "The call was invalidated. Graded wrong. Expired and cancelled do not count as a miss.",
  },
  EXPIRED: {
    label: "EXPIRED",
    definition:
      "Time ran out before a hit or a miss. Does not enter the hit-rate sample.",
  },
  OPEN: {
    label: "OPEN",
    definition:
      "The call is still live and waiting. Not graded yet.",
  },
  LIVE: {
    label: "LIVE",
    definition:
      "Price reached the entry zone. The call is in play, still waiting for target or invalidation.",
  },
  CANCELLED: {
    label: "CANCELLED",
    definition:
      "The desk pulled the call. Not a hit or a miss — it never got a grade.",
  },
  "day-pnl": {
    label: "day P&L",
    definition:
      "Profit or loss for today’s session only, in that book’s native currency.",
  },
  "realized-pnl": {
    label: "realized P&L",
    definition:
      "Profit or loss from closed trades — cash that is actually in the book. Unrealized is still sitting in an open position.",
  },
  book: {
    label: "book",
    definition:
      "One account / portfolio. This desk has two: Coins.ph (PHP crypto) and Gotrade (USD stocks and ETFs).",
  },
  venue: {
    label: "venue",
    definition:
      "Where the trade happens. Coins.ph for PHP crypto, Gotrade for USD US names.",
  },
  coins: {
    label: "Coins.ph",
    definition:
      "The PHP crypto venue. Size ₱800–₱1,200, A+ ~₱1,500, hard stop −3% / target +6%.",
  },
  gotrade: {
    label: "Gotrade",
    definition:
      "The USD US-equities and ETF venue. Clip $15–$25 with a $20–$25 bias size.",
  },
  macro: {
    label: "macro",
    definition:
      "A call about the event tape (CPI, FOMC, PPI), not a single Coins or Gotrade name.",
  },
  "manila-time": {
    label: "Manila time",
    definition:
      "Asia/Manila. The desk clock. Every date, routine, and as-of stamp uses this timezone.",
  },
  "level-watch": {
    label: "level watch",
    definition:
      "Watching support and resistance prices without trading them yet. Map only.",
  },
  "a-plus-size": {
    label: "A+ size",
    definition:
      "The biggest allowed ticket, only for the cleanest setups. Coins A+ is about ₱1,500.",
  },
  "bias-size": {
    label: "bias size",
    definition:
      "Preferred Gotrade ticket, $20–$25. $15 is the floor, not the habit.",
  },
  HUD: {
    label: "HUD",
    definition:
      "Heads-up display — the home screen with both books, stance, primaries, and the desk tape.",
  },
  NAV: {
    label: "NAV",
    definition:
      "Net asset value: cash plus positions. Combined NAV translates Coins pesos to dollars for display only.",
  },
  "combined-nav": {
    label: "combined NAV",
    definition:
      "Both books added together in USD (Coins translated at USDPHP). Display only — each book stays native.",
  },
  fill: {
    label: "fill",
    definition:
      "A trade that actually executed. History lists fills separately from skipped tickets.",
  },
  skip: {
    label: "skip",
    definition:
      "A ticket you chose not to send — usually because fees or a kill switch said no.",
  },
  clip: {
    label: "clip",
    definition:
      "One sized ticket inside the rails. Not a nibble, not an all-in.",
  },
  catalyst: {
    label: "catalyst",
    definition:
      "A scheduled event that can move markets (CPI, FOMC, PPI). High-impact catalysts zero permission.",
  },
  satellite: {
    label: "satellite",
    definition:
      "A name on the watchlist that is not a primary. Useful context, not today’s focus.",
  },
  benchmark: {
    label: "benchmark",
    definition:
      "A reference name (index or megacap ETF) used to judge the tape, not to trade by default.",
  },
  permission: {
    label: "permission",
    definition:
      "Whether the rails and the event calendar allow a ticket. Green rails plus a kill still means no permission.",
  },
  intraday: {
    label: "intraday",
    definition:
      "A call meant to resolve the same session. If the day ends, grade or expire it.",
  },
  swing: {
    label: "swing",
    definition:
      "A call meant to last a few days, not minutes. Needs overnight room and a clean invalidation.",
  },
  event: {
    label: "event",
    definition:
      "A call tied to a catalyst window (CPI, FOMC). The horizon dies with the print, not with a random hour.",
  },
  hit_entry: {
    label: "hit entry",
    definition:
      "Price reached the entry zone. The call is live — still waiting for target or invalidation.",
  },
  hit_target: {
    label: "hit target",
    definition:
      "Price reached the planned target. Graded HIT.",
  },
  invalidated: {
    label: "invalidated",
    definition:
      "The invalidation printed. Graded MISS. The idea is done.",
  },
  expired: {
    label: "expired",
    definition:
      "The horizon ended with no hit or miss. Does not change the hit rate.",
  },
  cancelled: {
    label: "cancelled",
    definition:
      "Desk cancelled the call before it could be graded.",
  },
  open: {
    label: "open",
    definition:
      "The call is still waiting. Not graded.",
  },
  "open-book": {
    label: "open book",
    definition:
      "Calls that are still in play: status open or hit-entry. Closed grades live on the other list.",
  },
  kill: {
    label: "kill",
    definition:
      "A standing rule that forbids a ticket. Global kills include CPI, FOMC, and a NO TRADE stance.",
  },
  FX: {
    label: "FX",
    definition:
      "Foreign exchange. USDPHP is the peso-per-dollar rate used only to display combined NAV.",
  },
  USDPHP: {
    label: "USDPHP",
    definition:
      "How many pesos one US dollar buys. Display FX only — Coins stays in ₱, Gotrade stays in $.",
  },
  PHT: {
    label: "PHT",
    definition:
      "Philippine Time. Same as Manila time (Asia/Manila) on the calendar grid.",
  },
} as const satisfies Record<string, GlossaryEntry>;

export type GlossaryId = keyof typeof GLOSSARY;

/** Exact key, or a different casing of a kebab/lowercase key (Stop-Market → stop-market, OCO → oco). */
export function resolveGlossaryId(id: string): GlossaryId | undefined {
  if (Object.hasOwn(GLOSSARY, id)) return id as GlossaryId;
  const folded = id.toLowerCase();
  if (folded !== id && Object.hasOwn(GLOSSARY, folded)) return folded as GlossaryId;
  return undefined;
}

export function isGlossaryId(id: string): id is GlossaryId {
  return resolveGlossaryId(id) !== undefined;
}

export function getTerm(id: GlossaryId | string): GlossaryEntry {
  const resolved = resolveGlossaryId(id);
  if (!resolved) {
    throw new Error(`Unknown glossary id: ${String(id)}`);
  }
  return GLOSSARY[resolved];
}
