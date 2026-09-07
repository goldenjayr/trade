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

export const predictionVenueSchema = z.enum(["coins", "gotrade", "macro"]);

export const predictionDirectionSchema = z.enum([
  "long_wait",
  "short_watch",
  "range",
  "breakout",
  "none",
]);

export const predictionHorizonSchema = z.enum(["intraday", "swing", "event"]);

export const predictionStatusSchema = z.enum([
  "open",
  "hit_entry",
  "hit_target",
  "invalidated",
  "expired",
  "cancelled",
]);

export const predictionSourceSchema = z.enum(["analyst", "desk"]);

export const predictionRoleSchema = z.enum(["primary", "scout", "stance"]);

const entryZoneSchema = z
  .object({
    low: z.number(),
    high: z.number(),
  })
  .refine((z0) => z0.high >= z0.low, {
    message: "entryZone.high must be >= entryZone.low",
  });

const predictionTargetSchema = z.union([
  z.number(),
  z.object({
    t1: z.number(),
    t2: z.number().optional(),
  }),
]);

export const predictionSchema = z
  .object({
    id: z.string().min(1),
    dateOpened: z.string().regex(dateRe),
    symbol: z.string().min(1),
    venue: predictionVenueSchema,
    thesis: z.string().min(1),
    direction: predictionDirectionSchema,
    entryZone: entryZoneSchema.optional(),
    target: predictionTargetSchema.optional(),
    invalidation: z.string().min(1).optional(),
    invalidationPrice: z.number().optional(),
    conviction: z.number().int().min(1).max(10),
    horizon: predictionHorizonSchema,
    status: predictionStatusSchema,
    resolvedAt: z.string().regex(dateRe).optional(),
    outcomeNote: z.string().optional(),
    source: predictionSourceSchema,
    role: predictionRoleSchema.optional(),
  })
  .refine(
    (p) => Boolean(p.invalidation) || p.invalidationPrice !== undefined,
    { message: "invalidation text and/or invalidationPrice is required" },
  );

export const predictionsFileSchema = z.object({
  asOf: z.string().regex(dateRe),
  disclaimer: z.string().optional(),
  calls: z.array(predictionSchema),
});

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
  predictions: z.array(predictionSchema).optional(),
});

export type DailyPacketParsed = z.infer<typeof dailyPacketSchema>;
