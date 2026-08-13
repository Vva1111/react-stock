import type { HoldingDraft } from '../types'

type PortfolioFormProps = {
  draft: HoldingDraft
  onDraftChange: (nextDraft: HoldingDraft) => void
  onAddHolding: () => void
}

function PortfolioForm({
  draft,
  onDraftChange,
  onAddHolding,
}: PortfolioFormProps) {
  return (
    <section className="form-panel" aria-label="Add holding">
      <label>
        Symbol
        <input
          value={draft.symbol}
          onChange={(event) =>
            onDraftChange({ ...draft, symbol: event.target.value.toUpperCase() })
          }
          placeholder="TSLA"
        />
      </label>
      <label>
        Company
        <input
          value={draft.company}
          onChange={(event) =>
            onDraftChange({ ...draft, company: event.target.value })
          }
          placeholder="Tesla"
        />
      </label>
      <label>
        Shares
        <input
          value={draft.shares}
          onChange={(event) =>
            onDraftChange({ ...draft, shares: event.target.value })
          }
          inputMode="decimal"
          placeholder="10"
        />
      </label>
      <label>
        Avg Price
        <input
          value={draft.averagePrice}
          onChange={(event) =>
            onDraftChange({ ...draft, averagePrice: event.target.value })
          }
          inputMode="decimal"
          placeholder="220"
        />
      </label>
      <label>
        Current Price
        <input
          value={draft.currentPrice}
          onChange={(event) =>
            onDraftChange({ ...draft, currentPrice: event.target.value })
          }
          inputMode="decimal"
          placeholder="245"
        />
      </label>
      <button type="button" onClick={onAddHolding}>
        Add
      </button>
    </section>
  )
}

export default PortfolioForm
