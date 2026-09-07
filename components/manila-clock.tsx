"use client";

import { useEffect, useState } from "react";

import { MANILA_TZ } from "@/lib/manila";

export function ManilaClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const value = now ?? new Date(0);

  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: MANILA_TZ,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(value);

  const date = new Intl.DateTimeFormat("en-US", {
    timeZone: MANILA_TZ,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(value);

  return (
    <div className="flex items-baseline gap-2 font-mono tabular">
      <span className="text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
        Manila
      </span>
      <span className="text-sm text-foreground" suppressHydrationWarning>
        {now ? time : "—:—:—"}
      </span>
      <span className="text-xs text-muted-foreground" suppressHydrationWarning>
        {now ? date : ""}
      </span>
    </div>
  );
}
