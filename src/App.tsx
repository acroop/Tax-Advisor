import { useEffect, useMemo, useState } from "react";
import { AlertCircle, HelpCircle } from "lucide-react";

import { fetchCapitalGains, fetchHoldings } from "@/lib/tax/api";
import { applyHarvesting, netGains } from "@/lib/tax/calculations";
import type { Holding } from "@/lib/tax/types";

import { DisclaimerPanel } from "@/components/tax/DisclaimerPanel";
import {
  AfterHarvestingCard,
  PreHarvestingCard,
} from "@/components/tax/GainsCards";
import { HoldingsTable } from "@/components/tax/HoldingsTable";
import { Skeleton } from "@/components/ui/skeleton";

const keyOf = (h: Holding, i: number) => `${h.coin}-${i}`;

function App() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [baseGains, setBaseGains] = useState<
    Awaited<ReturnType<typeof fetchCapitalGains>>["capitalGains"] | undefined
  >(undefined);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      const [holdingsData, gainsData] = await Promise.all([
        fetchHoldings(),
        fetchCapitalGains(),
      ]);

      setHoldings(holdingsData);
      setBaseGains(gainsData.capitalGains);
    } catch (error) {
      console.error("Failed to load tax data:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const afterGains = useMemo(
    () =>
      baseGains
        ? applyHarvesting(baseGains, holdings, selected, keyOf)
        : undefined,
    [baseGains, holdings, selected],
  );

  const savings = useMemo(() => {
    if (!baseGains || !afterGains) return 0;

    return Math.max(
      0,
      netGains(baseGains).realised - netGains(afterGains).realised,
    );
  }, [baseGains, afterGains]);

  const toggle = (key: string) =>
    setSelected((prev) => {
      const next = new Set(prev);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });

  const toggleAll = (checked: boolean) =>
    setSelected(
      checked
        ? new Set(holdings.map((h, i) => keyOf(h, i)))
        : new Set(),
    );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card/60">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-4 sm:px-6">
          <span className="text-xl font-bold tracking-tight text-link">
            Koin<span className="text-gain">X</span>
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-foreground">
            Tax Harvesting
          </h1>

          <a
            href="#how-it-works"
            className="inline-flex items-center gap-1 text-sm text-link underline underline-offset-4"
          >
            <HelpCircle className="size-3.5" aria-hidden />
            How it works?
          </a>
        </div>

        <DisclaimerPanel />

        {isError && (
          <div className="flex items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground">
            <AlertCircle
              className="size-4 text-destructive"
              aria-hidden
            />

            Couldn't load your tax data.

            <button
              type="button"
              onClick={loadData}
              className="font-medium text-link underline underline-offset-4"
            >
              Retry
            </button>
          </div>
        )}

        {isLoading && !isError && (
          <>
            <div className="grid gap-5 lg:grid-cols-2">
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
            </div>

            <Skeleton className="h-96 rounded-xl" />
          </>
        )}

        {!isLoading && !isError && baseGains && afterGains && (
          <>
            <div className="grid gap-5 lg:grid-cols-2">
              <PreHarvestingCard gains={baseGains} />

              <AfterHarvestingCard
                gains={afterGains}
                savings={savings}
              />
            </div>

            <HoldingsTable
              holdings={holdings}
              selected={selected}
              keyOf={keyOf}
              onToggle={toggle}
              onToggleAll={toggleAll}
              showAll={showAll}
              onShowAll={setShowAll}
            />

            <section
              id="how-it-works"
              className="rounded-xl bg-card p-5 sm:p-6"
            >
              <h2 className="text-base font-semibold text-foreground">
                How it works
              </h2>

              <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                Select the holdings you would consider selling. Positive gains
                are added to your profits and negative gains to your losses,
                for both short-term and long-term buckets. The After Harvesting
                card recalculates your effective capital gains instantly, and
                shows your potential saving whenever the harvested position
                lowers your realised gains.
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;