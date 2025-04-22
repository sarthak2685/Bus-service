import React from "react";
import { FaBusAlt } from "react-icons/fa";

const Preloader = () => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      {/* Animated Bus Icon */}
      <div className="animate-bounceSlow text-orange-500 mb-4 scale-x-[-1]">
        <FaBusAlt size={70} />
      </div>

      {/* Company Name with Dots */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center">
        Capital Bus Service
        <span className="ml-2 flex space-x-1">
          <span className="text-orange-500 animate-dot delay-[0ms]">.</span>
          <span className="text-orange-500 animate-dot delay-[300ms]">.</span>
          <span className="text-orange-500 animate-dot delay-[600ms]">.</span>
        </span>
      </h1>
    </div>
  );
};

export default Preloader;
