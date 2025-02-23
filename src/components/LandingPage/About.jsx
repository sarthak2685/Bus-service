import React from 'react';
import Bus from '../../assets/about.png'; // Replace with your image path

const About = () => {
  return (
    <div className="relative min-h-[80vh] bg-white flex flex-col md:flex-row items-center justify-center px-8 py-12 overflow-hidden">

      {/* Background Patterns */}
      {/* <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/double-bubble-outline.png')] opacity-5 z-0"></div> */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20 z-0"></div>


      {/* Animated Gradient */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-white to-orange-100 animate-gradient-move z-0"></div> */}

      {/* Animated Blob */}
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-50 animate-blob z-0"></div>

      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-40 animate-blob z-0"></div>

      {/* Content */}
      <div className="relative w-full md:w-1/2 z-10">
        <img
          src={Bus}
          alt="Bus"
          className="w-full object-contain drop-shadow-xl rounded-lg"
        />
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start w-full max-w-6xl relative z-10 mt-10 md:mt-0">
        <div className="w-full md:w-1/2 md:order-2 mb-8 md:mb-0">
          <h2 className="text-3xl md:text-4xl font-bold text-orange-500 mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            We are dedicated to providing a safe and reliable transportation service that ensures every student reaches school on time and returns home safely. With experienced drivers, real-time tracking, and a focus on security, we aim to give parents peace of mind every day.
          </p>
        </div>

        <div className="w-full md:w-1/2 md:order-1">
          <h2 className="text-3xl md:text-4xl font-bold text-orange-500 mb-4">
            Why Choose Us?
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our services go beyond just transportation. We focus on creating a positive journey experience for every child. With regular maintenance checks, trained staff, and constant communication, we set the gold standard for school transportation.
          </p>
        </div>
        
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.2) translate(-20px, 20px); }
        }
        .animate-blob {
          animation: blob 6s infinite ease-in-out;
        }

        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradient-move 8s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default About;
