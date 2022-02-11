import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./routes/login";
import Register from "./routes/register";
import Reset from "./routes/reset";
import Dashboard from "./routes/dashboard";
function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;
