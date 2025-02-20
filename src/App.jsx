import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/LandingPage/Home";
import AddUser from "./components/AdminDashboard/AddUser";
import AddDriver from "./components/AdminDashboard/AddDriver";
import Fee from "./components/AdminDashboard/Fee";
import Invoice from "./components/AdminDashboard/Invoice";

function App() {
  return (
    <Router>
      {/* Set up Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/add-driver" element={<AddDriver />} />
        <Route path="/fee" element={<Fee />} />
        <Route path="/invoice" element={<Invoice />} />
      </Routes>
    </Router>
  );
}

export default App;
