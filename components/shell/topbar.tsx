import { ManilaClock } from "@/components/manila-clock";
import { MobileNav } from "@/components/shell/sidebar";
import { StanceBadge } from "@/components/stance-badge";
import type { Stance } from "@/lib/types";

export function Topbar({
  stance,
  asOf,
}: {
  stance: Stance;
  asOf: string;
}) {
  return (
    <header className="flex items-center gap-3 border-b border-border bg-background/70 px-4 py-3 backdrop-blur-md sm:px-6">
      <MobileNav />
      <div className="min-w-0 flex-1">
        <p className="truncate font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
          Command center · books as of {asOf}
        </p>
      </div>
      <ManilaClock />
      <StanceBadge stance={stance} />
    </header>
  );
}
