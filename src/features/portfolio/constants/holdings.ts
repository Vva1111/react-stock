import type { Holding, HoldingDraft } from '../types'

export const initialHoldings: Holding[] = [
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

export const emptyDraft: HoldingDraft = {
  symbol: '',
  company: '',
  shares: '',
  averagePrice: '',
  currentPrice: '',
}
