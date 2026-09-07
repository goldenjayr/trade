import type { Currency, Stance, Venue } from "./types";

export function money(value: number, currency: Currency, digits = 2): string {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
  return currency === "PHP" ? `₱${formatted}` : `$${formatted}`;
}

export function compactMoney(value: number, currency: Currency): string {
  if (Math.abs(value) >= 1000) {
    const k = value / 1000;
    return currency === "PHP" ? `₱${k.toFixed(2)}k` : `$${k.toFixed(2)}k`;
  }
  return money(value, currency);
}

export function pct(value: number, digits = 2): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${(value * 100).toFixed(digits)}%`;
}

export function signedMoney(value: number, currency: Currency): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  const abs = money(Math.abs(value), currency);
  return `${sign}${abs}`;
}

export function pnlClass(value: number): string {
  if (value > 0) return "text-profit";
  if (value < 0) return "text-loss";
  return "text-muted-foreground";
}

export function stanceLabel(stance: Stance): string {
  return stance.replaceAll("_", " ");
}

export function venueLabel(venue: Venue): string {
  return venue === "coins" ? "Coins.ph" : "Gotrade";
}

export function round(value: number, digits = 2): number {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}
