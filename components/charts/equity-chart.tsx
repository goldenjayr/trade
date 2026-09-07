"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { combinedNavUsd } from "@/lib/books";
import type { Snapshot } from "@/lib/types";

export function EquityChart({ snapshots }: { snapshots: Snapshot[] }) {
  const data = snapshots.map((s) => ({
    date: s.date.slice(5),
    combined: combinedNavUsd(s.coinsEquity, s.gotradeEquity, s.usdphp),
    coinsUsd: combinedNavUsd(s.coinsEquity, 0, s.usdphp),
    gotrade: s.gotradeEquity,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="navFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.8 0.11 195)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="oklch(0.8 0.11 195)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="oklch(0.93 0.012 230 / 0.08)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "oklch(0.72 0.02 230)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "oklch(0.72 0.02 230)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={48}
            tickFormatter={(v: number) => `$${v.toFixed(0)}`}
          />
          <Tooltip
            contentStyle={{
              background: "oklch(0.185 0.02 250)",
              border: "1px solid oklch(0.93 0.012 230 / 0.1)",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value) => {
              const n = typeof value === "number" ? value : Number(value);
              return [`$${n.toFixed(2)}`, ""];
            }}
          />
          <Area
            type="monotone"
            dataKey="combined"
            stroke="oklch(0.8 0.11 195)"
            fill="url(#navFill)"
            strokeWidth={2}
            name="Combined USD"
          />
          <Area
            type="monotone"
            dataKey="gotrade"
            stroke="oklch(0.84 0.13 75)"
            fill="transparent"
            strokeWidth={1.5}
            name="Gotrade"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
