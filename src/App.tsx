import { useMemo, useState } from 'react'
import './App.css'

type Holding = {
  id: number
  symbol: string
  company: string
  shares: number
  averagePrice: number
  currentPrice: number
}

type HoldingDraft = {
  symbol: string
  company: string
  shares: string
  averagePrice: string
  currentPrice: string
}

type PortfolioSummaryProps = {
  holdings: Holding[]
}

type PortfolioFormProps = {
  draft: HoldingDraft
  onDraftChange: (nextDraft: HoldingDraft) => void
  onAddHolding: () => void
}

type PortfolioTableProps = {
  holdings: Holding[]
  selectedId: number | null
  onSelectHolding: (id: number) => void
}

const initialHoldings: Holding[] = [
  {
    id: 1,
    symbol: 'AAPL',
    company: 'Apple',
    shares: 12,
    averagePrice: 180,
    currentPrice: 229.35,
  },
  {
    id: 2,
    symbol: 'MSFT',
    company: 'Microsoft',
    shares: 8,
    averagePrice: 410,
    currentPrice: 517.12,
  },
  {
    id: 3,
    symbol: 'NVDA',
    company: 'NVIDIA',
    shares: 15,
    averagePrice: 118,
    currentPrice: 181.77,
  },
]

const emptyDraft: HoldingDraft = {
  symbol: '',
  company: '',
  shares: '',
  averagePrice: '',
  currentPrice: '',
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

function formatPercent(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

function PortfolioSummary({ holdings }: PortfolioSummaryProps) {
  const totalCost = holdings.reduce(
    (sum, holding) => sum + holding.shares * holding.averagePrice,
    0,
  )
  const totalValue = holdings.reduce(
    (sum, holding) => sum + holding.shares * holding.currentPrice,
    0,
  )
  const totalGain = totalValue - totalCost
  const totalGainRate = totalCost === 0 ? 0 : (totalGain / totalCost) * 100

  return (
    <section className="summary-grid" aria-label="Portfolio summary">
      <SummaryCard label="평가 금액" value={formatCurrency(totalValue)} />
      <SummaryCard label="매입 금액" value={formatCurrency(totalCost)} />
      <SummaryCard
        label="총 손익"
        value={formatCurrency(totalGain)}
        tone={totalGain >= 0 ? 'positive' : 'negative'}
      />
      <SummaryCard
        label="수익률"
        value={formatPercent(totalGainRate)}
        tone={totalGainRate >= 0 ? 'positive' : 'negative'}
      />
    </section>
  )
}

function SummaryCard({
  label,
  value,
  tone = 'neutral',
}: {
  label: string
  value: string
  tone?: 'neutral' | 'positive' | 'negative'
}) {
  return (
    <article className="summary-card">
      <span>{label}</span>
      <strong className={tone}>{value}</strong>
    </article>
  )
}

function PortfolioForm({
  draft,
  onDraftChange,
  onAddHolding,
}: PortfolioFormProps) {
  return (
    <section className="form-panel" aria-label="Add holding">
      <label>
        티커
        <input
          value={draft.symbol}
          onChange={(event) =>
            onDraftChange({ ...draft, symbol: event.target.value.toUpperCase() })
          }
          placeholder="TSLA"
        />
      </label>
      <label>
        회사명
        <input
          value={draft.company}
          onChange={(event) =>
            onDraftChange({ ...draft, company: event.target.value })
          }
          placeholder="Tesla"
        />
      </label>
      <label>
        수량
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
        평균 단가
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
        현재가
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
        추가
      </button>
    </section>
  )
}

function PortfolioTable({
  holdings,
  selectedId,
  onSelectHolding,
}: PortfolioTableProps) {
  return (
    <section className="table-wrap" aria-label="Portfolio holdings">
      <table>
        <thead>
          <tr>
            <th>종목</th>
            <th>수량</th>
            <th>평균 단가</th>
            <th>현재가</th>
            <th>평가 금액</th>
            <th>손익</th>
            <th>수익률</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => {
            const cost = holding.shares * holding.averagePrice
            const value = holding.shares * holding.currentPrice
            const gain = value - cost
            const gainRate = cost === 0 ? 0 : (gain / cost) * 100

            return (
              <tr
                className={selectedId === holding.id ? 'selected' : ''}
                key={holding.id}
                onClick={() => onSelectHolding(holding.id)}
              >
                <td>
                  <strong>{holding.symbol}</strong>
                  <span>{holding.company}</span>
                </td>
                <td>{holding.shares}</td>
                <td>{formatCurrency(holding.averagePrice)}</td>
                <td>{formatCurrency(holding.currentPrice)}</td>
                <td>{formatCurrency(value)}</td>
                <td className={gain >= 0 ? 'positive' : 'negative'}>
                  {formatCurrency(gain)}
                </td>
                <td className={gainRate >= 0 ? 'positive' : 'negative'}>
                  {formatPercent(gainRate)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

function App() {
  const [holdings, setHoldings] = useState<Holding[]>(initialHoldings)
  const [draft, setDraft] = useState<HoldingDraft>(emptyDraft)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const selectedHolding = useMemo(
    () => holdings.find((holding) => holding.id === selectedId),
    [holdings, selectedId],
  )

  function addHolding() {
    const nextHolding = {
      id: Date.now(),
      symbol: draft.symbol.trim(),
      company: draft.company.trim(),
      shares: Number(draft.shares),
      averagePrice: Number(draft.averagePrice),
      currentPrice: Number(draft.currentPrice),
    }

    if (
      !nextHolding.symbol ||
      !nextHolding.company ||
      nextHolding.shares <= 0 ||
      nextHolding.averagePrice <= 0 ||
      nextHolding.currentPrice <= 0
    ) {
      return
    }

    setHoldings([...holdings, nextHolding])
    setDraft(emptyDraft)
    setSelectedId(nextHolding.id)
  }

  return (
    <main className="app">
      <header className="page-header">
        <div>
          <p className="eyebrow">React + TypeScript</p>
          <h1>Portfolio Table</h1>
        </div>
        <p>
          `useState`와 `props`만으로 종목 목록, 입력 폼, 선택 상태를 나눠서
          관리하는 예제입니다.
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

      {selectedHolding ? (
        <aside className="detail-panel">
          선택한 종목: <strong>{selectedHolding.symbol}</strong> /{' '}
          {selectedHolding.company}
        </aside>
      ) : null}
    </main>
  )
}

export default App
