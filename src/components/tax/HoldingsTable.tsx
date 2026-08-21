import { Checkbox } from "@/components/ui/checkbox";
import { CoinLogo } from "./CoinLogo";
import { formatAmount, formatCurrency, formatPrice, formatSignedCurrency } from "@/lib/tax/calculations";
import type { Holding } from "@/lib/tax/types";

interface Props {
  holdings: Holding[];
  selected: Set<string>;
  keyOf: (h: Holding, i: number) => string;
  onToggle: (key: string) => void;
  onToggleAll: (checked: boolean) => void;
  showAll: boolean;
  onShowAll: (v: boolean) => void;
}

const PREVIEW_COUNT = 6;

export function HoldingsTable({
  holdings,
  selected,
  keyOf,
  onToggle,
  onToggleAll,
  showAll,
  onShowAll,
}: Props) {
  const visible = showAll ? holdings : holdings.slice(0, PREVIEW_COUNT);
  const allSelected = holdings.length > 0 && selected.size === holdings.length;
  const someSelected = selected.size > 0 && !allSelected;

  const gainCell = (gain: number, balance: number, coin: string) => (
    <div className={gain >= 0 ? "text-gain" : "text-loss"}>
      <div className="font-medium tabular-nums">{formatSignedCurrency(gain)}</div>
      <div className="text-xs text-muted-foreground">{formatAmount(balance, coin)}</div>
    </div>
  );

  return (
    <section className="rounded-xl bg-card p-4 sm:p-6">
      <h2 className="mb-4 text-base font-semibold text-foreground">Holdings</h2>

      <div className="overflow-x-auto rounded-lg">
        <table className="w-full min-w-[860px] border-collapse text-sm">
          <thead>
            <tr className="bg-muted/60 text-xs text-muted-foreground">
              <th scope="col" className="w-10 rounded-l-lg py-3 pl-4">
                <Checkbox
                  aria-label="Select all holdings"
                  checked={allSelected ? true : someSelected ? "indeterminate" : false}
                  onCheckedChange={(v) => onToggleAll(v === true)}
                />
              </th>
              <th scope="col" className="py-3 text-left font-medium">
                Asset
              </th>
              <th scope="col" className="py-3 pr-4 text-right font-medium">
                Holdings
                <span className="block text-[10px] font-normal">Current Market Rate</span>
              </th>
              <th scope="col" className="py-3 pr-4 text-right font-medium">
                Total Current Value
              </th>
              <th scope="col" className="py-3 pr-4 text-right font-medium">
                Short-term
              </th>
              <th scope="col" className="py-3 pr-4 text-right font-medium">
                Long-Term
              </th>
              <th scope="col" className="rounded-r-lg py-3 pr-4 text-right font-medium">
                Amount to Sell
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((h, i) => {
              const key = keyOf(h, holdings.indexOf(h) === -1 ? i : holdings.indexOf(h));
              const isSelected = selected.has(key);
              return (
                <tr
                  key={key}
                  onClick={() => onToggle(key)}
                  className={`cursor-pointer border-b border-border/60 transition-colors last:border-0 ${
                    isSelected ? "bg-row-selected" : "hover:bg-muted/40"
                  }`}
                >
                  <td className="py-3 pl-4" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      aria-label={`Select ${h.coinName}`}
                      checked={isSelected}
                      onCheckedChange={() => onToggle(key)}
                    />
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <CoinLogo src={h.logo} alt={h.coin} />
                      <div className="min-w-0">
                        <div className="truncate font-medium text-foreground">{h.coinName}</div>
                        <div className="text-xs text-muted-foreground">{h.coin}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <div className="font-medium text-foreground tabular-nums">
                      {formatAmount(h.totalHolding, h.coin)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatPrice(h.averageBuyPrice)}/{h.coin}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-right font-medium text-foreground tabular-nums">
                    {formatCurrency(h.totalHolding * h.currentPrice)}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    {gainCell(h.stcg.gain, h.stcg.balance, h.coin)}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    {gainCell(h.ltcg.gain, h.ltcg.balance, h.coin)}
                  </td>
                  <td className="py-3 pr-4 text-right text-foreground tabular-nums">
                    {isSelected ? formatAmount(h.totalHolding, h.coin) : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {holdings.length > PREVIEW_COUNT && (
        <button
          type="button"
          onClick={() => onShowAll(!showAll)}
          className="mt-4 text-sm font-medium text-link underline underline-offset-4 hover:opacity-80"
        >
          {showAll ? "View less" : "View all"}
        </button>
      )}
    </section>
  );
}
