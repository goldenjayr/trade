"use client";

import { useEffect, useState } from "react";

import { Switch } from "@/components/ui/switch";

const PREFS = {
  combined: "tv.combinedNav",
  compact: "tv.compact",
} as const;

export function DisplayPrefs() {
  const [combined, setCombined] = useState(true);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    setCombined(window.localStorage.getItem(PREFS.combined) !== "0");
    setCompact(window.localStorage.getItem(PREFS.compact) === "1");
  }, []);

  return (
    <div className="space-y-4">
      <label className="flex items-center justify-between gap-3 text-sm">
        Show combined NAV on HUD
        <Switch
          checked={combined}
          onCheckedChange={(checked) => {
            setCombined(checked);
            window.localStorage.setItem(PREFS.combined, checked ? "1" : "0");
          }}
        />
      </label>
      <label className="flex items-center justify-between gap-3 text-sm">
        Compact numbers
        <Switch
          checked={compact}
          onCheckedChange={(checked) => {
            setCompact(checked);
            window.localStorage.setItem(PREFS.compact, checked ? "1" : "0");
          }}
        />
      </label>
      <p className="text-xs text-muted-foreground">
        Stored in this browser only. Seeded HUD always shows combined NAV.
      </p>
    </div>
  );
}
