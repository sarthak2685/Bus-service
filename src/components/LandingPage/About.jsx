import React from "react";
import Bus from "../../assets/about.png"; // Replace with your custom image

const About = () => {
  return (
    <section
      id="about"
      className="bg-gradient-to-br from-orange-50 via-white to-orange-100 py-20 px-6 md:px-12 lg:px-24"
    >

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Image with cool effects */}
        <div className="relative">
          <div className="absolute top-[-20px] left-[-20px] w-full h-full rounded-3xl  blur-lg z-0" />
          <img
            src={Bus}
            alt="About Us"
            className="relative z-10 rounded-3xl hover:scale-105 transition duration-500 ease-in-out"
          />
        </div>

        {/* Text Section */}
        <div className="space-y-10">
          <div>
            <h2 className="text-5xl font-extrabold text-orange-500 mb-4">
              About Our Journey
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              We’re not just a transport service — we’re a safe bridge between home and school. With GPS-enabled tracking, experienced drivers, and safety-first approach, we deliver trust with every trip.
            </p>
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-6 border-l-8 border-orange-500">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Why Parents Trust Us
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Real-time tracking & instant updates</li>
              <li>Friendly, trained staff & drivers</li>
              <li>Strict safety & maintenance checks</li>
              <li>On-time pickups and drop-offs, always</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
