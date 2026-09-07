import { stanceLabel } from "@/lib/format";
import type { Stance } from "@/lib/types";
import { cn } from "@/lib/utils";

const styles: Record<Stance, string> = {
  NO_TRADE: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  WATCH: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  ARMED: "border-primary/50 bg-primary/10 text-primary",
  IN_TRADE: "border-profit/50 bg-profit/10 text-profit",
  REDUCE: "border-orange-400/40 bg-orange-400/10 text-orange-200",
};

export function StanceBadge({
  stance,
  className,
}: {
  stance: Stance;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-[0.14em] uppercase",
        styles[stance],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
      {stanceLabel(stance)}
    </span>
  );
}
