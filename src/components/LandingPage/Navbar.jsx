import React, { useState, useEffect } from 'react';
import Bus from "../../assets/school.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const handleLinkClick = (section) => {
    setIsOpen(false);
    setActiveSection(section);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`text-orange-500 p-4 sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-lg bg-white' : 'bg-white'}`}>
      <div className="container mx-auto flex justify-between items-center px-12">
        <div className="text-2xl font-extrabold tracking-wide cursor-pointer">
          School Bus Service
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
        <ul className={`md:flex md:items-center md:space-x-8 ${isOpen ? 'block' : 'hidden'} text-lg`}> 
          {['home', 'about', 'gallery', 'contact'].map((section) => (
            <li key={section}>
              <a 
                href={`#${section}`} 
                onClick={() => handleLinkClick(section)} 
                className={`transition duration-300 ${
                  activeSection === section 
                    ? 'bg-orange-500 block  py-1 px-8 rounded-full border text-white border-orange-500'
                    : 'border-orange-500 hover:bg-gray-100 text-orange-500'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ')}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
