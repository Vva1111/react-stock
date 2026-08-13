import type { Holding } from '../types'

export function getHoldingCost(holding: Holding) {
  return holding.shares * holding.averagePrice
}

export function getHoldingValue(holding: Holding) {
  return holding.shares * holding.currentPrice
}

export function getHoldingGain(holding: Holding) {
  return getHoldingValue(holding) - getHoldingCost(holding)
}

export function getHoldingReturn(holding: Holding) {
  const cost = getHoldingCost(holding)

  return cost === 0 ? 0 : (getHoldingGain(holding) / cost) * 100
}

export function getPortfolioCost(holdings: Holding[]) {
  return holdings.reduce((sum, holding) => sum + getHoldingCost(holding), 0)
}

export function getPortfolioValue(holdings: Holding[]) {
  return holdings.reduce((sum, holding) => sum + getHoldingValue(holding), 0)
}
