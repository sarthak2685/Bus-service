import React from "react";
import { NavLink } from "react-router-dom";
import {
  UserGroupIcon,
  TruckIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
  MapIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";
import { FaTimes } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const handleLogout = () => {
    //remove localstorage value
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <>
      <ToastContainer />
      <aside
        className={`bg-[#2D3748] text-white fixed top-0 left-0 w-64 h-screen p-4 flex flex-col transition-transform duration-300 z-50 shadow-lg ${
          isCollapsed ? "-translate-x-full" : "translate-x-0"
        }`}
        style={{ maxHeight: "100vh", overflowY: "auto" }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-2 rounded-md mb-7">
          <span className="text-2xl font-bold text-white">Bus Service</span>
          <button onClick={toggleSidebar} className="text-white md:hidden">
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow space-y-3">
          <NavLink
            to="/add-user"
            className={({ isActive }) =>
              `flex items-center py-3 px-4 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-[#FF6F00] text-black font-semibold shadow-md"
                  : "text-white hover:bg-[#FFD166] hover:text-black"
              }`
            }
          >
            <UserGroupIcon
              className={`h-5 w-5 mr-2 ${
                location.pathname === "/add-user" ? "text-black" : "text-white"
              }`}
            />
            <span>Users</span>
          </NavLink>

          <NavLink
            to="/add-driver"
            className={({ isActive }) =>
              `flex items-center py-3 px-4 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-[#FF6F00] text-black font-semibold shadow-md"
                  : "text-white hover:bg-[#FFD166] hover:text-black"
              }`
            }
          >
            <TruckIcon
              className={`h-5 w-5 mr-2 ${
                location.pathname === "/add-driver"
                  ? "text-black"
                  : "text-white"
              }`}
            />
            <span>Drivers</span>
          </NavLink>

          <NavLink
            to="/routes"
            className={({ isActive }) =>
              `flex items-center py-3 px-4 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-[#FF6F00] text-black font-semibold shadow-md"
                  : "text-white hover:bg-[#FFD166] hover:text-black"
              }`
            }
          >
            <MapIcon
              className={`h-5 w-5 mr-2 ${
                location.pathname === "/routes" ? "text-black" : "text-white"
              }`}
            />
            <span>Routes</span>
          </NavLink>

          <NavLink
            to="/gallery"
            className={({ isActive }) =>
              `flex items-center py-3 px-4 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-[#FF6F00] text-black font-semibold shadow-md"
                  : "text-white hover:bg-[#FFD166] hover:text-black"
              }`
            }
          >
            <PhotoIcon
              className={`h-5 w-5 mr-2 ${
                location.pathname === "/gallery" ? "text-black" : "text-white"
              }`}
            />
            <span>Gallery</span>
          </NavLink>

          <NavLink
            to="/fee"
            className={({ isActive }) =>
              `flex items-center py-3 px-4 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-[#FF6F00] text-black font-semibold shadow-md"
                  : "text-white hover:bg-[#FFD166] hover:text-black"
              }`
            }
          >
            <CurrencyDollarIcon
              className={`h-5 w-5 mr-2 ${
                location.pathname === "/fee" ? "text-black" : "text-white"
              }`}
            />
            <span>Fees</span>
          </NavLink>

          <NavLink
            to="/invoice"
            className={({ isActive }) =>
              `flex items-center py-3 px-4 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-[#FF6F00] text-black font-semibold shadow-md"
                  : "text-white hover:bg-[#FFD166] hover:text-black"
              }`
            }
          >
            <DocumentTextIcon
              className={`h-5 w-5 mr-2 ${
                location.pathname === "/invoice" ? "text-black" : "text-white"
              }`}
            />
            <span>Invoices</span>
          </NavLink>

          {/* Separator */}
          <hr className="my-4 border-t border-white opacity-50" />
        </nav>

        {/* Footer Buttons */}
        <div className="mt-auto flex flex-col mb-20 md:mb-0">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center mt-2 shadow-lg"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
