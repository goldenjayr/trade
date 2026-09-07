"use client";

import { useSyncExternalStore } from "react";

import { Switch } from "@/components/ui/switch";

const PREFS = {
  combined: "tv.combinedNav",
  compact: "tv.compact",
} as const;

const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function emit() {
  listeners.forEach((listener) => listener());
}

function readFlag(key: string, fallbackWhenMissing: boolean) {
  const raw = window.localStorage.getItem(key);
  if (raw === null) return fallbackWhenMissing;
  return raw === "1";
}

function getCombined() {
  return readFlag(PREFS.combined, true);
}

function getCompact() {
  return readFlag(PREFS.compact, false);
}

export function DisplayPrefs() {
  const combined = useSyncExternalStore(subscribe, getCombined, () => true);
  const compact = useSyncExternalStore(subscribe, getCompact, () => false);

  return (
    <div className="space-y-4">
      <label className="flex items-center justify-between gap-3 text-sm">
        Show combined NAV on HUD
        <Switch
          checked={combined}
          onCheckedChange={(checked) => {
            window.localStorage.setItem(PREFS.combined, checked ? "1" : "0");
            emit();
          }}
        />
      </label>
      <label className="flex items-center justify-between gap-3 text-sm">
        Compact numbers
        <Switch
          checked={compact}
          onCheckedChange={(checked) => {
            window.localStorage.setItem(PREFS.compact, checked ? "1" : "0");
            emit();
          }}
        />
      </label>
      <p className="text-xs text-muted-foreground">
        Stored in this browser only. Seeded HUD always shows combined NAV.
      </p>
    </div>
  );
}
