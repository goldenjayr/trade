import { money, pnlClass, signedMoney } from "@/lib/format";
import type { Currency } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Money({
  value,
  currency,
  signed = false,
  className,
}: {
  value: number;
  currency: Currency;
  signed?: boolean;
  className?: string;
}) {
  const text = signed ? signedMoney(value, currency) : money(value, currency);
  return (
    <span className={cn("font-mono tabular", signed && pnlClass(value), className)}>
      {text}
    </span>
  );
}
