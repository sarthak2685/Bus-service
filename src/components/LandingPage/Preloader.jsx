import { useEffect, useState } from "react";
import { LuLoaderPinwheel } from "react-icons/lu";


const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000); // Show for 2 seconds
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-yellow-300">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-black tracking-widest mb-6">
        CAPITAL BUS SERVICE
      </h1>

      {/* Wheels Container */}
      <div className="flex space-x-6">
        {/* Left Wheel */}
        <LuLoaderPinwheel className="w-20 h-20 text-black animate-spin" />

        {/* Right Wheel */}
        <LuLoaderPinwheel className="w-20 h-20 text-black animate-spin" />
      </div>
    </div>
  );
};

export default Preloader;
