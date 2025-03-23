import { useEffect, useState } from "react";

const Preloader = () => {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Animation steps
    const animationInterval = setInterval(() => {
      setStep((prev) => (prev + 1) % 100);
    }, 30);

    // Hide preloader after animation completes
    const timer = setTimeout(() => setLoading(false), 2000);

    return () => {
      clearInterval(animationInterval);
      clearTimeout(timer);
    };
  }, []);

  if (!loading) return null;

  // Calculate bus position for smooth movement
  const busPosition = step <= 50 ? step * 2 : 100 - (step - 50) * 2;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="w-full max-w-2xl p-10">
        {/* Logo and header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">
            <span className="text-orange-500">CAPITAL</span>
            <span className="text-orange-500"> BUS</span>
            <span className="text-orange-500"> SERVICE</span>
          </h1>
        </div>

        {/* Bus track */}
        <div className="relative h-40 mb-8">
          {/* Track line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300"></div>

          {/* Moving bus */}
          <div
            className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-300 ease-in-out"
            style={{
              left: `${busPosition}%`,
              transform: `translateX(-${busPosition}%) translateY(-50%)`,
            }}
          >
            {/* Bus shadow */}
            <div className="absolute -bottom-6 left-1/2 w-32 h-3 bg-black opacity-20 rounded-full blur-sm transform -translate-x-1/2"></div>

            {/* Bus container */}
            <div className="relative">
              {/* Bus body */}
              <div className="relative w-40 h-16 bg-yellow-400 rounded-md shadow-md overflow-hidden">
                {/* Front section */}
                <div className="absolute top-0 left-0 w-8 h-16 bg-yellow-500 rounded-l-md"></div>

                {/* Side stripe */}
                <div className="absolute bottom-1 left-0 right-0 h-2 bg-yellow-600"></div>

                {/* Windows */}
                <div className="absolute top-3 left-10 right-3 h-6 flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-blue-200 rounded-sm"
                    ></div>
                  ))}
                </div>

                {/* Door */}
                <div className="absolute bottom-3 left-10 w-6 h-8 bg-yellow-500 border-r border-yellow-600"></div>
              </div>

              {/* Wheels */}
              <div className="absolute -bottom-4 left-8 w-8 h-8 bg-gray-800 rounded-full border border-gray-600">
                <div className="absolute inset-1 rounded-full border-2 border-t-gray-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
              </div>
              <div className="absolute -bottom-4 right-8 w-8 h-8 bg-gray-800 rounded-full border border-gray-600">
                <div className="absolute inset-1 rounded-full border-2 border-t-gray-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-400 transition-all duration-100 ease-linear"
            style={{ width: `${step}%` }}
          ></div>
        </div>

        {/* Loading text */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-lg">
            <span className="inline-block w-3 h-3 bg-orange-400 rounded-full mr-2 animate-pulse"></span>
            Loading your journey...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
