# Tax Loss Harvesting

A responsive React (TanStack Start + Tailwind) tool that shows crypto capital gains before and after tax-loss harvesting.

## Setup

```bash
bun install
bun run dev   # http://localhost:8080
```

## Structure

- `src/lib/tax/api.ts` — mock Holdings + Capital Gains APIs (promise-based, simulated latency)
- `src/lib/tax/calculations.ts` — net/realised gain math, harvesting application, formatters
- `src/components/tax/` — disclaimer panel, gains cards, holdings table
- `src/routes/index.tsx` — page composition and selection state

## Behaviour

- Pre Harvesting card renders short/long term profits, losses and net gains from the Capital Gains API.
- Selecting holdings adds each positive gain to profits and each negative gain (absolute) to losses, updating the After Harvesting card in real time.
- The savings line appears only when realised gains drop after harvesting.
- Holdings table supports row/select-all checkboxes, "View all" expansion, loading skeletons and an error retry state.

## Assumptions

- Amounts are displayed with the `$` symbol using Indian digit grouping, matching the design.
- Holdings are sorted by absolute short-term gain (largest harvesting impact first).
- Duplicate coin tickers are de-duplicated by index-based keys.
