export const VENUES = ["coins", "gotrade"] as const;
export type Venue = (typeof VENUES)[number];

export const CURRENCIES = ["PHP", "USD"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const STANCES = [
  "NO_TRADE",
  "WATCH",
  "ARMED",
  "IN_TRADE",
  "REDUCE",
] as const;
export type Stance = (typeof STANCES)[number];

export const JOURNAL_DESKS = ["scout", "analyst", "risk", "desk"] as const;
export type JournalDesk = (typeof JOURNAL_DESKS)[number];

export const ROLES = ["primary", "satellite", "benchmark"] as const;
export type WatchRole = (typeof ROLES)[number];

export const ASSET_CLASSES = ["crypto", "equity", "etf"] as const;
export type AssetClass = (typeof ASSET_CLASSES)[number];

export const WEEKDAYS = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export interface Position {
  symbol: string;
  name: string;
  qty: number;
  avgCost: number;
  mark: number;
  marketValue: number;
  pnl: number;
  pnlPct: number;
}

export interface Book {
  venue: Venue;
  label: string;
  currency: Currency;
  cash: number;
  equity: number;
  dayPnl: number;
  totalPnl: number;
  positions: Position[];
}

export interface Catalyst {
  id: string;
  date: string;
  timeManila?: string;
  title: string;
  impact: "low" | "medium" | "high";
  status: "upcoming" | "live" | "done";
  notes: string;
}

export interface DeskState {
  asOf: string;
  timezone: "Asia/Manila";
  stance: Stance;
  stanceReason: string;
  primaries: string[];
  books: {
    coins: Book;
    gotrade: Book;
  };
  catalysts: Catalyst[];
}

export interface JournalLevel {
  symbol: string;
  support?: number;
  resistance?: number;
  invalidation?: string;
  note?: string;
}

export interface JournalEntry {
  date: string;
  stance: Stance;
  headline: string;
  scout: {
    headline: string;
    bullets: string[];
    sources?: string[];
  };
  analyst: {
    thesis: string;
    levels: JournalLevel[];
    notes: string;
  };
  risk: {
    railsCheck: string;
    sizeNote: string;
    kills: string[];
    feeSkip: string;
  };
  desk: {
    decision: string;
    actions: string[];
    nextOpen: string;
  };
}

export interface Trade {
  id: string;
  date: string;
  venue: Venue;
  symbol: string;
  side: "buy" | "sell";
  qty: number;
  price: number;
  fees: number;
  notional: number;
  skipped: boolean;
  skipReason?: string;
  notes?: string;
}

export interface DayLog {
  date: string;
  stance: Stance;
  summary: string;
  tradeCount: number;
  coinsEquity: number;
  gotradeEquity: number;
}

export interface Snapshot {
  date: string;
  coinsEquity: number;
  gotradeEquity: number;
  coinsCash: number;
  gotradeCash: number;
  usdphp: number;
}

export interface WatchItem {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  role: WatchRole;
  venues: Venue[];
  last: number;
  currency: Currency;
  changePct: number;
  thesis: string;
}

export interface Watchlists {
  asOf: string;
  crypto: WatchItem[];
  us: WatchItem[];
}

export interface RiskRails {
  coins: {
    sizeMin: number;
    sizeMax: number;
    sizeAPlus: number;
    stopPct: number;
    targetPct: number;
    feeSkip: string[];
    kills: string[];
  };
  gotrade: {
    sizeMin: number;
    sizeMax: number;
    sizeBiasMin: number;
    sizeBiasMax: number;
    feeSkip: string[];
    kills: string[];
  };
  globalKills: string[];
}

export interface Routine {
  id: string;
  title: string;
  time: string;
  days: Weekday[] | "daily" | "weekdays";
  owner: JournalDesk | "desk";
  checklist: string[];
  notes: string;
}

export interface Settings {
  deskName: string;
  operator: string;
  timezone: "Asia/Manila";
  usdphp: number;
  fxAsOf: string;
  venues: {
    coins: { label: string; currency: Currency; note: string };
    gotrade: { label: string; currency: Currency; note: string };
  };
}

export interface DailyPacket {
  date: string;
  stance: Stance;
  stanceReason: string;
  primaries?: string[];
  books: {
    coins: BookInput;
    gotrade: BookInput;
  };
  journal: JournalEntry;
  trades?: Trade[];
  catalysts?: Catalyst[];
  watchlistMarks?: Array<{
    symbol: string;
    last: number;
    changePct?: number;
  }>;
  usdphp?: number;
  notes?: string;
}

export interface BookInput {
  venue: Venue;
  label?: string;
  currency: Currency;
  cash: number;
  dayPnl?: number;
  totalPnl?: number;
  positions: Array<{
    symbol: string;
    name: string;
    qty: number;
    avgCost: number;
    mark: number;
  }>;
}
