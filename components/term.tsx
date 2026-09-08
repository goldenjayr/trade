"use client";

import type { ReactNode } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getTerm, type GlossaryId } from "@/lib/glossary";
import { cn } from "@/lib/utils";

export function Term({
  id,
  children,
  className,
  nested = false,
}: {
  id: GlossaryId;
  children?: ReactNode;
  className?: string;
  /** Hover-only when the term already sits inside a link or button. */
  nested?: boolean;
}) {
  const entry = getTerm(id);

  return (
    <Tooltip>
      <TooltipTrigger
        delay={200}
        render={
          <span
            tabIndex={nested ? undefined : 0}
            className={cn(
              "cursor-help rounded-[2px] underline decoration-dotted decoration-muted-foreground/70 underline-offset-[0.22em]",
              "transition-colors hover:decoration-primary",
              "focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:outline-none focus-visible:decoration-primary",
              className,
            )}
          />
        }
      >
        {children ?? entry.label}
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        sideOffset={6}
        className="max-w-72 flex-col items-start gap-1 border border-primary/40 bg-popover px-3 py-2 text-left text-[13px] leading-relaxed whitespace-normal text-popover-foreground shadow-[0_0_24px_oklch(0.8_0.11_195/0.18)]"
      >
        <span className="font-mono text-[10px] tracking-[0.16em] text-primary uppercase">
          {entry.label}
        </span>
        <span className="text-pretty">{entry.definition}</span>
      </TooltipContent>
    </Tooltip>
  );
}
