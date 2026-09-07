import { z } from "zod";

const dateRe = /^\d{4}-\d{2}-\d{2}$/;

export const stanceSchema = z.enum([
  "NO_TRADE",
  "WATCH",
  "ARMED",
  "IN_TRADE",
  "REDUCE",
]);

export const venueSchema = z.enum(["coins", "gotrade"]);

const positionInputSchema = z.object({
  symbol: z.string().min(1),
  name: z.string().min(1),
  qty: z.number(),
  avgCost: z.number(),
  mark: z.number(),
});

export const bookInputSchema = z.object({
  venue: venueSchema,
  label: z.string().optional(),
  currency: z.enum(["PHP", "USD"]),
  cash: z.number(),
  dayPnl: z.number().optional(),
  totalPnl: z.number().optional(),
  positions: z.array(positionInputSchema),
});

export const catalystSchema = z.object({
  id: z.string().min(1),
  date: z.string().regex(dateRe),
  timeManila: z.string().optional(),
  title: z.string().min(1),
  impact: z.enum(["low", "medium", "high"]),
  status: z.enum(["upcoming", "live", "done"]),
  notes: z.string(),
});

export const journalSchema = z.object({
  date: z.string().regex(dateRe),
  stance: stanceSchema,
  headline: z.string().min(1),
  scout: z.object({
    headline: z.string(),
    bullets: z.array(z.string()),
    sources: z.array(z.string()).optional(),
  }),
  analyst: z.object({
    thesis: z.string(),
    levels: z.array(
      z.object({
        symbol: z.string(),
        support: z.number().optional(),
        resistance: z.number().optional(),
        invalidation: z.string().optional(),
        note: z.string().optional(),
      }),
    ),
    notes: z.string(),
  }),
  risk: z.object({
    railsCheck: z.string(),
    sizeNote: z.string(),
    kills: z.array(z.string()),
    feeSkip: z.string(),
  }),
  desk: z.object({
    decision: z.string(),
    actions: z.array(z.string()),
    nextOpen: z.string(),
  }),
});

export const tradeSchema = z.object({
  id: z.string().min(1),
  date: z.string().regex(dateRe),
  venue: venueSchema,
  symbol: z.string(),
  side: z.enum(["buy", "sell"]),
  qty: z.number(),
  price: z.number(),
  fees: z.number(),
  notional: z.number(),
  skipped: z.boolean(),
  skipReason: z.string().optional(),
  notes: z.string().optional(),
});

export const dailyPacketSchema = z.object({
  date: z.string().regex(dateRe),
  stance: stanceSchema,
  stanceReason: z.string().min(1),
  primaries: z.array(z.string()).optional(),
  books: z.object({
    coins: bookInputSchema,
    gotrade: bookInputSchema,
  }),
  journal: journalSchema,
  trades: z.array(tradeSchema).optional(),
  catalysts: z.array(catalystSchema).optional(),
  watchlistMarks: z
    .array(
      z.object({
        symbol: z.string(),
        last: z.number(),
        changePct: z.number().optional(),
      }),
    )
    .optional(),
  usdphp: z.number().positive().optional(),
  notes: z.string().optional(),
});

export type DailyPacketParsed = z.infer<typeof dailyPacketSchema>;
