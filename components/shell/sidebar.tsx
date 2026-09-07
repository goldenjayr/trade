"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV } from "@/components/shell/nav";
import { cn } from "@/lib/utils";

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="relative flex size-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
        <span className="size-2 rotate-45 bg-primary shadow-[0_0_12px_oklch(0.8_0.11_195)]" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-heading text-[11px] tracking-[0.28em] text-primary uppercase">
          Trade
        </span>
        <span className="font-heading text-sm font-semibold tracking-[0.12em]">
          Vision
        </span>
      </span>
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
              active
                ? "bg-sidebar-accent text-foreground shadow-[inset_2px_0_0_oklch(0.8_0.11_195)]"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
            )}
          >
            <Icon className={cn("size-4", active && "text-primary")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 px-3 py-4 backdrop-blur-md lg:flex">
      <div className="px-1 pb-5">
        <Brand />
      </div>
      <NavLinks />
      <p className="mt-auto px-2 pt-6 font-mono text-[10px] tracking-[0.16em] text-muted-foreground/70 uppercase">
        Dual-book desk
      </p>
    </aside>
  );
}

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="lg:hidden" />
        }
      >
        <Menu className="size-4" />
        <span className="sr-only">Open navigation</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-sidebar p-0">
        <SheetHeader className="border-b border-sidebar-border">
          <SheetTitle>
            <Brand />
          </SheetTitle>
        </SheetHeader>
        <div className="p-3">
          <NavLinks />
        </div>
      </SheetContent>
    </Sheet>
  );
}
