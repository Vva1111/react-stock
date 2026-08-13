export type Holding = {
  id: number
  symbol: string
  company: string
  shares: number
  averagePrice: number
  currentPrice: number
}

export type HoldingDraft = {
  symbol: string
  company: string
  shares: string
  averagePrice: string
  currentPrice: string
}

export type Tone = 'neutral' | 'positive' | 'negative'
