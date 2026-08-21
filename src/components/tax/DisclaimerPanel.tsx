import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";

const NOTES = [
  "Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.",
  "Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.",
  "Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.",
  "Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term.",
  "Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted.",
];

export function DisclaimerPanel() {
  const [open, setOpen] = useState(true);

  return (
    <section className="rounded-xl border border-info-border bg-info-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <Info className="size-4 shrink-0 text-info-accent" aria-hidden />
        <span className="flex-1 text-sm font-semibold text-foreground">
          Important Notes &amp; Disclaimers
        </span>
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <ul className="list-disc space-y-2 px-9 pb-4 text-sm text-muted-foreground marker:text-info-accent">
          {NOTES.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
