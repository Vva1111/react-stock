import type { Holding } from "../types";
import {
  getHoldingGain,
  getHoldingReturn,
  getHoldingValue,
} from "../utils/calculations";
import { formatCurrency, formatPercent } from "../utils/formatters";

type PortfolioTableProps = {
  holdings: Holding[];
  selectedId: number | null;
  onSelectHolding: (id: number) => void;
};

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
            <th>Stock</th>
            <th>Shares</th>
            <th>Avg Price</th>
            <th>Current Price</th>
            <th>Market Value</th>
            <th>Gain</th>
            <th>Return</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => {
            const value = getHoldingValue(holding);
            const gain = getHoldingGain(holding);
            const gainRate = getHoldingReturn(holding);

            return (
              <tr
                className={selectedId === holding.id ? "selected" : ""}
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
                <td className={gain >= 0 ? "positive" : "negative"}>
                  {formatCurrency(gain)}
                </td>
                <td className={gainRate >= 0 ? "positive" : "negative"}>
                  {formatPercent(gainRate)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

export default PortfolioTable;
