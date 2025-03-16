import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import AddUser from "./components/AdminDashboard/AddUser";
import AddDriver from "./components/AdminDashboard/AddDriver";
import Fee from "./components/AdminDashboard/Fee";
import Invoice from "./components/AdminDashboard/Invoice";
import DriverRoutes from "./components/AdminDashboard/Routes";
import Gallery from "./components/AdminDashboard/Gallery";
import { ToastContainer } from "react-toastify";
import DashboardHome from "./components/UserDashboard/DashboardHome";
import Payments from "./components/UserDashboard/Payments";
import Contact from "./components/UserDashboard/Contact";

function App() {
    return (
        <>
            <ToastContainer />

            <Router>
                {/* Set up Routes */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/add-user" element={<AddUser />} />
                    <Route path="/add-driver" element={<AddDriver />} />
                    <Route path="/routes" element={<DriverRoutes />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/fee" element={<Fee />} />
                    <Route path="/invoice" element={<Invoice />} />
                    <Route path="/UserDashboard" element={<DashboardHome />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
