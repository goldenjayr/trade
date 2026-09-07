import {
  BookOpen,
  CalendarClock,
  ChartLine,
  LayoutDashboard,
  Radar,
  ScrollText,
  Settings2,
  ShieldAlert,
} from "lucide-react";

export const NAV = [
  { href: "/", label: "HUD", icon: LayoutDashboard },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/watchlists", label: "Watchlists", icon: Radar },
  { href: "/history", label: "History", icon: ScrollText },
  { href: "/analytics", label: "Analytics", icon: ChartLine },
  { href: "/risk", label: "Risk rails", icon: ShieldAlert },
  { href: "/calendar", label: "Calendar", icon: CalendarClock },
  { href: "/settings", label: "Settings", icon: Settings2 },
] as const;
