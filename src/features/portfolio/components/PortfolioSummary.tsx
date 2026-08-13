import SummaryCard from './SummaryCard'
import type { Holding } from '../types'
import { getPortfolioCost, getPortfolioValue } from '../utils/calculations'
import { formatCurrency, formatPercent } from '../utils/formatters'

type PortfolioSummaryProps = {
  holdings: Holding[]
}

function PortfolioSummary({ holdings }: PortfolioSummaryProps) {
  const totalCost = getPortfolioCost(holdings)
  const totalValue = getPortfolioValue(holdings)
  const totalGain = totalValue - totalCost
  const totalGainRate = totalCost === 0 ? 0 : (totalGain / totalCost) * 100

  return (
    <section className="summary-grid" aria-label="Portfolio summary">
      <SummaryCard label="Market Value" value={formatCurrency(totalValue)} />
      <SummaryCard label="Cost Basis" value={formatCurrency(totalCost)} />
      <SummaryCard
        label="Total Gain"
        value={formatCurrency(totalGain)}
        tone={totalGain >= 0 ? 'positive' : 'negative'}
      />
      <SummaryCard
        label="Return"
        value={formatPercent(totalGainRate)}
        tone={totalGainRate >= 0 ? 'positive' : 'negative'}
      />
    </section>
  )
}

export default PortfolioSummary
