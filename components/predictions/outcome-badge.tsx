import { Term } from "@/components/term";
import type { PredictionOutcome } from "@/lib/types";
import { cn } from "@/lib/utils";

const styles: Record<PredictionOutcome, string> = {
  HIT: "border-profit/50 bg-profit/12 text-profit",
  MISS: "border-loss/50 bg-loss/12 text-loss",
  EXPIRED: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  CANCELLED: "border-border bg-muted/50 text-muted-foreground",
  OPEN: "border-primary/40 bg-primary/10 text-primary",
  LIVE: "border-sky-400/40 bg-sky-400/10 text-sky-200",
};

export function OutcomeBadge({
  outcome,
  className,
}: {
  outcome: PredictionOutcome;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-[0.14em] uppercase",
        styles[outcome],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
      <Term id={outcome}>{outcome}</Term>
    </span>
  );
}
