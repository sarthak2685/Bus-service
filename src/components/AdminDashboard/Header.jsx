import React, { useState, useEffect, useRef } from "react";
import { FaBars } from "react-icons/fa";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-lg flex items-center justify-between p-4 relative">
      {/* Sidebar toggle button */}
      <button
        onClick={toggleSidebar}
        className="text-gray-600 lg:hidden mr-4"
        aria-label="Toggle Sidebar"
      >
        <FaBars className="w-6 h-6" /> {/* Bar icon here */}
      </button>

      <div className="flex-grow" />

      <div className="flex items-center space-x-6">
        {/* User Info */}
        <div className="flex items-center space-x-4">
          {/* <span className="font-semibold text-gray-700">{user.name}</span> */}
          <div className="w-10 h-10 rounded-full bg-slate-500 text-white flex items-center justify-center">
            {/* {user.name?.charAt(0).toUpperCase()} */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
