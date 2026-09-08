"use client";

import { useSyncExternalStore } from "react";

import { Term } from "@/components/term";
import { MANILA_TZ } from "@/lib/manila";

function subscribe(onStoreChange: () => void) {
  const id = window.setInterval(onStoreChange, 1000);
  return () => window.clearInterval(id);
}

function getSnapshot() {
  return Math.floor(Date.now() / 1000);
}

function getServerSnapshot() {
  return 0;
}

export function ManilaClock() {
  const epochSec = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const now = epochSec === 0 ? null : new Date(epochSec * 1000);

  const time = now
    ? new Intl.DateTimeFormat("en-GB", {
        timeZone: MANILA_TZ,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now)
    : "—:—:—";

  const date = now
    ? new Intl.DateTimeFormat("en-US", {
        timeZone: MANILA_TZ,
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(now)
    : "";

  return (
    <div className="flex items-baseline gap-2 font-mono tabular">
      <span className="text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
        <Term id="manila-time">Manila</Term>
      </span>
      <span className="text-sm text-foreground">{time}</span>
      <span className="text-xs text-muted-foreground">{date}</span>
    </div>
  );
}
