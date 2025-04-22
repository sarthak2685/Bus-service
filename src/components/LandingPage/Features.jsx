import React from "react";
import {
  FaUserTie,
  FaClock,
  FaBusAlt,
  FaRoute,
  FaMoneyBillWave,
  FaPhoneAlt,
  FaMapMarkedAlt,
} from "react-icons/fa";

const features = [
  {
    icon: <FaUserTie size={28} className="text-orange-500" />,
    title: "Driver Details",
    description: "Get verified driver name, contact, and identification info before the trip starts.",
  },
  {
    icon: <FaClock size={28} className="text-orange-500" />,
    title: "Bus Arrival Time",
    description: "Real-time tracking to know exact arrival and departure times.",
  },
  {
    icon: <FaBusAlt size={28} className="text-orange-500" />,
    title: "Vehicle Number",
    description: "Clearly displayed vehicle number for better identification and tracking.",
  },
  {
    icon: <FaRoute size={28} className="text-orange-500" />,
    title: "Route Information",
    description: "Get complete route map with stops, estimated timings, and navigation support.",
  },
  {
    icon: <FaMoneyBillWave size={28} className="text-orange-500" />,
    title: "Payment Handling",
    description: "Seamless and secure online payments with detailed fare breakdown.",
  },
  {
    icon: <FaPhoneAlt size={28} className="text-orange-500" />,
    title: "Emergency SOS",
    description: "In-built SOS feature for emergencies with instant alerts to nearest help centers.",
  },
//   {
//     icon: <FaMapMarkedAlt size={28} className="text-orange-500" />,
//     title: "Live Tracking",
//     description: "Track your ride live on map from pickup to destination.",
//   },
];

const Features = () => {
  return (
    <section className="bg-white py-16 px-6 sm:px-10 lg:px-20" id="features">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3">
          What We Offer
        </h2>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
          We provide a smart, safe and reliable experience for all passengers through advanced features and real-time updates.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 p-5 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition duration-300"
          >
            <div className="shrink-0">{feature.icon}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
