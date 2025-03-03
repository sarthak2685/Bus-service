import React from "react";
import { FaBars } from "react-icons/fa";

const Header = ({ toggleSidebar }) => {

  const user = JSON.parse(localStorage.getItem("user")) || {};
  // if user is null then redirect to home page
  if (!user.data.token && user.data.type !== "admin") {
    window.location.href = "/";
}


  const firstLetter = user.data.type ? user.data.type.charAt(0).toUpperCase() : "S";

  return (
    <header className="bg-white shadow-lg flex items-center justify-between p-4 relative">
      {/* Sidebar toggle button */}
      <button
        onClick={toggleSidebar}
        className="text-gray-600 lg:hidden mr-4"
        aria-label="Toggle Sidebar"
      >
        <FaBars className="w-6 h-6" />
      </button>

      <div className="flex-grow" />

      <div className="flex items-center space-x-6">
        {/* User Info */}
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold shadow-md">
            {firstLetter}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
