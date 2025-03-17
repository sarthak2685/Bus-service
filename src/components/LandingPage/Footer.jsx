import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative text-black pt-12 pb-6 z-10 bg-white">
      {/* Background Pattern - Now won't block clicks */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20 z-0 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
        {/* Company Info */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-orange-500">
            Bus Service
          </h2>
          <p className="text-sm leading-relaxed">
            Dedicated to providing safe, reliable, and efficient transportation
            for students. We ensure peace of mind for parents and a joyful
            journey for children.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-orange-500">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-orange-500">
                About Us
              </a>
            </li>
            <li>
              <a href="#gallery" className="hover:text-orange-500">
                Gallery
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-orange-500">
                Contact
              </a>
            </li>
            {/* <li>
              <a href="/services" className="hover:text-orange-500">
                Our Services
              </a>
            </li> */}
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/terms" className="hover:text-orange-500">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-orange-500">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/refund" className="hover:text-orange-500">
                Refund Policy
              </Link>
            </li>
            {/* <li>
              <Link to="/faq" className="hover:text-orange-500">
                FAQs
              </Link>
            </li> */}
          </ul>
        </div>

        {/* Contact Info & Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            {/* <li className="flex items-center">
              <FaMapMarkerAlt className="mr-2" /> 123 School Lane, City, Country
            </li> */}
            <li className="flex items-center">
              <FaPhoneAlt className="mr-2" /> +91 82105 84092
            </li>
            <li className="flex items-center">
              <FaEnvelope className="mr-2" /> info@capitalservice.com
            </li>
          </ul>

          {/* Social Media */}
          <div className="flex space-x-4 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-white text-orange-500 rounded-full hover:bg-orange-400 hover:text-white transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-white text-orange-500 rounded-full hover:bg-orange-400 transition"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-white text-orange-500 rounded-full hover:bg-orange-400 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-white text-orange-500 rounded-full hover:bg-orange-400 transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-8 border-t border-orange-300 pt-4 text-sm relative z-10">
        © {new Date().getFullYear()} SafeRide Bus Service. All Rights Reserved.
        |
        <a
          href="https://webcraftix.com"
          target="_blank"
          rel="noreferrer"
          className="ml-2 cursor-pointer hover:text-orange-500"
        >
          Designed by WebCraftiX
        </a>
      </div>
    </footer>
  );
};

export default Footer;
