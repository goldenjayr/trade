import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <p className="font-mono text-[10px] tracking-[0.22em] text-primary uppercase">
        404
      </p>
      <h1 className="mt-2 text-2xl font-semibold">No such pane</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        That route is not on the desk map.
      </p>
      <Link href="/" className={buttonVariants({ variant: "outline", size: "sm", className: "mt-6" })}>
        Return to HUD
      </Link>
    </div>
  );
}
