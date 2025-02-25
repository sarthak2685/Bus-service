import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="contact-page min-h-screen bg-white px-6 py-12 flex flex-col items-center relative overflow-hidden">

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20 z-0"></div>
      <h1 className="text-4xl font-bold text-orange-500 mb-8 z-10">Contact Us</h1>

      <div className="max-w-4xl w-full bg-gray-50 mt-16 rounded-lg shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-4">
            Whether you have questions about our services or need assistance, feel free to reach out!
          </p>
          <div className="flex items-center mb-3 text-gray-700">
            <FaPhoneAlt className="text-orange-500 mr-3" />
            <span>+91 9876543210</span>
          </div>
          <div className="flex items-center mb-3 text-gray-700">
            <FaEnvelope className="text-orange-500 mr-3" />
            <span>contact@schoolbus.com</span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaMapMarkerAlt className="text-orange-500 mr-3" />
            <span>123, School Street, City Name, India</span>
          </div>
        </div>

        {/* Contact Form */}
        <form className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
           <input
            type="number"
            placeholder="Your Number"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <textarea
            placeholder="Your Message"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 h-32"
            required
          ></textarea>
          <button
            type="submit"
            className="bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>


    </div>
  );
};

export default Contact;
