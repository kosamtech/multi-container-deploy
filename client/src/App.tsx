import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Fib from "./Fib";
import OtherPage from "./OtherPage";

function App() {
    return (
        <Router>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <Link to="/" style={{ marginRight: "10px" }}>
                    Home
                </Link>
                <Link to="/otherpage">Other Page</Link>
            </div>
            <div>
                <Routes>
                    <Route path="/" element={<Fib />} />
                    <Route path="/otherpage" element={<OtherPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
