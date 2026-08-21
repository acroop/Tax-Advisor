import { formatCurrency, netGains } from "@/lib/tax/calculations";
import type { CapitalGains } from "@/lib/tax/types";

interface RowProps {
  label: string;
  short: string;
  long: string;
  strong?: boolean;
  tone: "dark" | "blue";
}

function Row({ label, short, long, strong, tone }: RowProps) {
  const labelTone = tone === "dark" ? "text-muted-foreground" : "text-harvest-foreground/85";
  const valueTone = tone === "dark" ? "text-foreground" : "text-harvest-foreground";
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-2 text-sm sm:gap-8">
      <span className={strong ? `${valueTone} font-medium` : labelTone}>{label}</span>
      <span className={`w-24 text-right sm:w-28 ${valueTone} ${strong ? "font-semibold" : ""}`}>
        {short}
      </span>
      <span className={`w-24 text-right sm:w-28 ${valueTone} ${strong ? "font-semibold" : ""}`}>
        {long}
      </span>
    </div>
  );
}

function Header({ tone }: { tone: "dark" | "blue" }) {
  const cls = tone === "dark" ? "text-muted-foreground" : "text-harvest-foreground/85";
  return (
    <div className="grid grid-cols-[1fr_auto_auto] gap-4 pb-1 text-xs sm:gap-8 sm:text-sm">
      <span />
      <span className={`w-24 text-right sm:w-28 ${cls}`}>Short-term</span>
      <span className={`w-24 text-right sm:w-28 ${cls}`}>Long-term</span>
    </div>
  );
}

export function PreHarvestingCard({ gains }: { gains: CapitalGains }) {
  const net = netGains(gains);
  return (
    <section className="rounded-xl bg-card p-5 sm:p-6">
      <h2 className="mb-3 text-base font-semibold text-foreground">Pre Harvesting</h2>
      <Header tone="dark" />
      <Row
        tone="dark"
        label="Profits"
        short={formatCurrency(gains.stcg.profits)}
        long={formatCurrency(gains.ltcg.profits)}
      />
      <Row
        tone="dark"
        label="Losses"
        short={formatCurrency(-gains.stcg.losses)}
        long={formatCurrency(-gains.ltcg.losses)}
      />
      <Row
        tone="dark"
        label="Net Capital Gains"
        short={formatCurrency(net.stcg)}
        long={formatCurrency(net.ltcg)}
        strong
      />
      <div className="mt-5 flex flex-wrap items-baseline gap-3 border-t border-border pt-5">
        <span className="text-base font-semibold text-foreground">Realised Capital Gains:</span>
        <span className="text-2xl font-bold text-foreground">{formatCurrency(net.realised)}</span>
      </div>
    </section>
  );
}

export function AfterHarvestingCard({
  gains,
  savings,
}: {
  gains: CapitalGains;
  savings: number;
}) {
  const net = netGains(gains);
  return (
    <section className="harvest-gradient rounded-xl bg-harvest p-5 text-harvest-foreground shadow-harvest sm:p-6">
      <h2 className="mb-3 text-base font-semibold">After Harvesting</h2>
      <Header tone="blue" />
      <Row
        tone="blue"
        label="Profits"
        short={formatCurrency(gains.stcg.profits)}
        long={formatCurrency(gains.ltcg.profits)}
      />
      <Row
        tone="blue"
        label="Losses"
        short={formatCurrency(-gains.stcg.losses)}
        long={formatCurrency(-gains.ltcg.losses)}
      />
      <Row
        tone="blue"
        label="Net Capital Gains"
        short={formatCurrency(net.stcg)}
        long={formatCurrency(net.ltcg)}
        strong
      />
      <div className="mt-5 flex flex-wrap items-baseline gap-3 border-t border-harvest-foreground/20 pt-5">
        <span className="text-base font-semibold">Effective Capital Gains:</span>
        <span className="text-2xl font-bold">{formatCurrency(net.realised)}</span>
      </div>
      {savings > 0 && (
        <p className="mt-4 text-sm font-medium">
          <span aria-hidden>🎉</span> You are going to save upto {formatCurrency(savings)}
        </p>
      )}
    </section>
  );
}
