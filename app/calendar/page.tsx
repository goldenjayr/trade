import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadDesk, loadRoutines } from "@/lib/load";
import { weekdayKey } from "@/lib/manila";
import type { Routine, Weekday } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Routines calendar",
};

const DAY_LABELS: { key: Weekday; label: string }[] = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

function matches(routine: Routine, day: Weekday) {
  if (routine.days === "daily") return true;
  if (routine.days === "weekdays") {
    return ["mon", "tue", "wed", "thu", "fri"].includes(day);
  }
  return routine.days.includes(day);
}

export default function CalendarPage() {
  const routines = loadRoutines();
  const desk = loadDesk();
  const todayKey = weekdayKey(desk.asOf) as Weekday;
  const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 06–22

  const highlight = new Set(["07:00", "12:00", "15:00", "21:00", "08:00"]);

  return (
    <div>
      <PageHeader
        kicker="Manila clock"
        title="Routines calendar"
        description="Daily 07:00 scout · 12:00 midday · 15:00 US open · 21:00 close. Monday 08:00 weekly. Week of the desk as-of date."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {routines.map((r) => (
          <Badge key={r.id} variant="outline" className="font-mono">
            {r.time} {r.title}
          </Badge>
        ))}
      </div>

      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-[4.5rem_repeat(7,minmax(0,1fr))] text-xs">
            <div className="border-b border-border bg-muted/40 px-2 py-2 font-mono text-muted-foreground">
              PHT
            </div>
            {DAY_LABELS.map((d) => (
              <div
                key={d.key}
                className={cn(
                  "border-b border-l border-border px-2 py-2 text-center font-medium",
                  d.key === todayKey && "bg-primary/10 text-primary",
                )}
              >
                {d.label}
              </div>
            ))}
            {hours.map((h) => (
              <HourRow
                key={h}
                hour={h}
                routines={routines}
                todayKey={todayKey}
                highlight={highlight}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {routines.map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <p className="font-mono text-[10px] tracking-[0.18em] text-primary uppercase">
                {r.time} · {typeof r.days === "string" ? r.days : r.days.join(", ")} · {r.owner}
              </p>
              <CardTitle>{r.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="mb-3 space-y-1.5 text-sm text-muted-foreground">
                {r.checklist.map((c) => (
                  <li key={c} className="flex gap-2">
                    <span className="text-primary">▹</span>
                    {c}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground">{r.notes}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function HourRow({
  hour,
  routines,
  todayKey,
  highlight,
}: {
  hour: number;
  routines: Routine[];
  todayKey: Weekday;
  highlight: Set<string>;
}) {
  const label = `${String(hour).padStart(2, "0")}:00`;
  const lit = highlight.has(label);

  return (
    <>
      <div
        className={cn(
          "border-t border-border px-2 py-3 font-mono text-muted-foreground",
          lit && "text-primary",
        )}
      >
        {label}
      </div>
      {DAY_LABELS.map((d) => {
        const hits = routines.filter(
          (r) => r.time.startsWith(String(hour).padStart(2, "0")) && matches(r, d.key),
        );
        return (
          <div
            key={d.key}
            className={cn(
              "border-t border-l border-border px-1 py-1 min-h-12",
              d.key === todayKey && "bg-primary/4",
            )}
          >
            {hits.map((r) => (
              <div
                key={r.id}
                className="rounded-md bg-primary/15 px-1.5 py-1 text-[11px] leading-tight text-primary"
              >
                {r.title}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}
