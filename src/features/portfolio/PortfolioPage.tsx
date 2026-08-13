import { useMemo, useState } from "react";
import PortfolioForm from "./components/PortfolioForm";
import PortfolioSummary from "./components/PortfolioSummary";
import PortfolioTable from "./components/PortfolioTable";
import SelectedHoldingPanel from "./components/SelectedHoldingPanel";
import { emptyDraft, initialHoldings } from "./constants/holdings";
import type { Holding, HoldingDraft } from "./types";

function PortfolioPage() {
  const [holdings, setHoldings] = useState<Holding[]>(initialHoldings);
  const [draft, setDraft] = useState<HoldingDraft>(emptyDraft);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedHolding = useMemo(
    () => holdings.find((holding) => holding.id === selectedId),
    [holdings, selectedId]
  );

  function addHolding() {
    const nextHolding: Holding = {
      id: Date.now(),
      symbol: draft.symbol.trim(),
      company: draft.company.trim(),
      shares: Number(draft.shares),
      averagePrice: Number(draft.averagePrice),
      currentPrice: Number(draft.currentPrice),
    };

    if (
      !nextHolding.symbol ||
      !nextHolding.company ||
      nextHolding.shares <= 0 ||
      nextHolding.averagePrice <= 0 ||
      nextHolding.currentPrice <= 0
    ) {
      return;
    }

    setHoldings([...holdings, nextHolding]);
    setDraft(emptyDraft);
    setSelectedId(nextHolding.id);
  }

  return (
    <main className="app">
      <header className="page-header">
        <div>
          <p className="eyebrow">React + TypeScript</p>
          <h1>Portfolio Table</h1>
        </div>
        <p>
          A small portfolio example using only useState and props for data flow.
        </p>
      </header>

      <PortfolioSummary holdings={holdings} />

      <PortfolioForm
        draft={draft}
        onDraftChange={setDraft}
        onAddHolding={addHolding}
      />

      <PortfolioTable
        holdings={holdings}
        selectedId={selectedId}
        onSelectHolding={setSelectedId}
      />

      <SelectedHoldingPanel holding={selectedHolding} />
    </main>
  );
}

export default PortfolioPage;
