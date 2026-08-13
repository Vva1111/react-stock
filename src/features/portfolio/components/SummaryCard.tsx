import type { Tone } from '../types'

type SummaryCardProps = {
  label: string
  value: string
  tone?: Tone
}

function SummaryCard({ label, value, tone = 'neutral' }: SummaryCardProps) {
  return (
    <article className="summary-card">
      <span>{label}</span>
      <strong className={tone}>{value}</strong>
    </article>
  )
}

export default SummaryCard
