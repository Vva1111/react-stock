import './App.css'

const sampleStocks = [
  { symbol: 'AAPL', name: 'Apple', price: 229.35, change: 1.24 },
  { symbol: 'MSFT', name: 'Microsoft', price: 517.12, change: -0.42 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 181.77, change: 2.08 },
]

function App() {
  return (
    <main className="app">
      <section className="panel">
        <p className="eyebrow">React practice</p>
        <h1>Stock Watch</h1>
        <p className="intro">
          컴포넌트, 배열 렌더링, 조건부 스타일을 읽어보기 좋은 작은 예제입니다.
        </p>

        <div className="stock-list">
          {sampleStocks.map((stock) => (
            <article className="stock-row" key={stock.symbol}>
              <div>
                <strong>{stock.symbol}</strong>
                <span>{stock.name}</span>
              </div>
              <div className="stock-price">
                <span>${stock.price.toFixed(2)}</span>
                <small className={stock.change >= 0 ? 'up' : 'down'}>
                  {stock.change >= 0 ? '+' : ''}
                  {stock.change}%
                </small>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
