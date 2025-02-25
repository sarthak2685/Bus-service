import React from 'react';
import Bus from '../../assets/about.png'; // Replace with your image path

const About = () => {
  return (
    <div className="relative min-h-[80vh] bg-white flex flex-col md:flex-row items-center justify-center px-8 py-12 overflow-hidden">

      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20 z-0"></div>


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

      
    </div>
  );
};

export default About;
