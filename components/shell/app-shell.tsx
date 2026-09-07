import type { ReactNode } from "react";

import { Topbar } from "@/components/shell/topbar";
import { Sidebar } from "@/components/shell/sidebar";
import type { Stance } from "@/lib/types";

export function AppShell({
  children,
  stance,
  asOf,
}: {
  children: ReactNode;
  stance: Stance;
  asOf: string;
}) {
  return (
    <div className="flex min-h-full">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar stance={stance} asOf={asOf} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
