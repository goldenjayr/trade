export const MANILA_TZ = "Asia/Manila";

export function manilaDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: MANILA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function manilaWeekday(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: MANILA_TZ,
    weekday: "short",
  }).format(date);
}

export function parseISODate(iso: string): Date {
  return new Date(`${iso}T00:00:00+08:00`);
}

export function formatManilaLong(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: MANILA_TZ,
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parseISODate(iso));
}

export function weekdayKey(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: MANILA_TZ,
    weekday: "short",
  })
    .format(parseISODate(iso))
    .toLowerCase()
    .slice(0, 3);
}
