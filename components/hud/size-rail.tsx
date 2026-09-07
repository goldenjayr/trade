import { cn } from "@/lib/utils";

export function SizeRail({
  cash,
  min,
  max,
  aPlus,
  tone,
  unit,
}: {
  cash: number;
  min: number;
  max: number;
  aPlus?: number;
  tone: "coins" | "gotrade";
  unit: string;
}) {
  const cap = Math.max(cash, aPlus ?? max, max) * 1.15;
  const pct = (n: number) => `${(n / cap) * 100}%`;
  const bar = tone === "coins" ? "bg-coins" : "bg-gotrade";

  return (
    <div className="space-y-2">
      <div className="relative h-2 rounded-full bg-muted">
        <div
          className="absolute inset-y-0 rounded-full bg-foreground/10"
          style={{ left: pct(min), width: `calc(${pct(max)} - ${pct(min)})` }}
        />
        {aPlus ? (
          <div
            className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
            style={{ left: pct(aPlus) }}
          />
        ) : null}
        <div
          className={cn("absolute inset-y-0 rounded-full opacity-80", bar)}
          style={{ width: pct(Math.min(cash, cap)) }}
        />
      </div>
      <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
        <span>
          min {unit}
          {min.toLocaleString()}
        </span>
        <span>
          max {unit}
          {max.toLocaleString()}
        </span>
        {aPlus ? <span>A+ {unit}{aPlus.toLocaleString()}</span> : null}
        <span className="text-foreground">
          cash {unit}
          {cash.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
