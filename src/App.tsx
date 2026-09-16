import { BrowserRouter, Navigate, NavLink, Route, Routes } from "react-router-dom";
import PortfolioPage from "./features/portfolio/PortfolioPage";
import "./App.css";

function HomePage() {
  return (
    <main className="app">
      <header className="page-header">
        <div>
          <p className="eyebrow">React Router</p>
          <h1>React Stock</h1>
        </div>
        <p>
          A small route-enabled React app. Use the navigation to open the
          portfolio example.
        </p>
      </header>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <nav className="app-nav" aria-label="Main navigation">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/portfolio">Portfolio</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="*" element={<Navigate to="/portfolio" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
