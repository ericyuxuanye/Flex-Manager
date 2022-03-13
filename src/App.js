import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./routes/login";
import Register from "./routes/register";
import Reset from "./routes/reset";
import Dashboard from "./routes/dashboard";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
function App() {
  return (
    <RecoilRoot>
      <RecoilNexus />
        <Router>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/reset" element={<Reset />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Routes>
        </Router>
    </RecoilRoot>
  );
}
export default App;
