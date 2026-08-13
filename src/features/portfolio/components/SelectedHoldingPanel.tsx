import type { Holding } from '../types'

type SelectedHoldingPanelProps = {
  holding: Holding | undefined
}

function SelectedHoldingPanel({ holding }: SelectedHoldingPanelProps) {
  if (!holding) {
    return null
  }

  return (
    <aside className="detail-panel">
      Selected: <strong>{holding.symbol}</strong> / {holding.company}
    </aside>
  )
}

export default SelectedHoldingPanel
