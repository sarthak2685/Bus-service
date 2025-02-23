import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdClose } from 'react-icons/md';
import Bus from "../../assets/school.png";

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userType, setUserType] = useState('parent'); // Default set to parent
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setInputValue('');
    setPassword('');
    setError('');
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleLogin = () => {
    if (userType === 'parent') {
      if (!/^\d{10}$/.test(inputValue)) {
        setError('Please enter a valid 10-digit mobile number.');
        return;
      }
      alert(`OTP sent to ${inputValue}`);
    } else {
      if (!inputValue || !password) {
        setError('Please fill in both phone number and password.');
        return;
      }
      alert(`Logging in as admin with phone: ${inputValue} and password: ${password}`);
    }
    handleModalClose();
  };
  return (
    <>
    <div className="relative min-h-[80vh] bg-white flex flex-col md:flex-row items-center justify-center overflow-hidden px-8 mt-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20 z-0"></div>

      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-50 animate-blob z-0"></div>

<div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-40 animate-blob z-0"></div>

      <div className="flex flex-col md:flex-row items-center w-full relative z-10">
        {/* Image Section */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full md:w-1/2 mt-10 md:mt-0"
        >
          <img
            src={Bus}
            alt="School Bus"
            className="w-full object-contain drop-shadow-xl"
          />
        </motion.div>

        {/* Text Section */}
        <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-3xl md:text-5xl font-extrabold text-orange-600"
          >
            Safe & Reliable School Bus Service
          </motion.h1>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="text-lg md:text-xl text-gray-700"
          >
            Giving parents peace of mind while ensuring students reach school safely, happily, and on time.
          </motion.p>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.4 }}
            className="text-md md:text-lg text-gray-600"
          >
            Because every child's journey should begin and end with safety and care.
          </motion.p>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.6 }}
            className="text-md md:text-lg text-gray-600"
          >
            Stay connected with real-time tracking, punctual pickups, and professional drivers dedicated to your child's safety.
          </motion.p>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.8 }}
            className="text-md md:text-lg text-gray-600"
          >
            Empowering parents with transparency and ensuring students experience a stress-free commute.
          </motion.p>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2 }}
            className='flex justify-center'
          >
        <button className="bg-orange-500 hover:bg-orange-600 text-white text-lg py-1 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 " onClick={handleLoginClick}>

              Login
            </button>
          </motion.div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <MdClose onClick={handleModalClose} className="absolute top-2 right-2 text-2xl cursor-pointer text-gray-600 hover:text-red-500" />
            <h2 className="text-xl font-bold mb-4">Login</h2>

            <label className="block mb-2">Enter Mobile Number:</label>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
              placeholder="Mobile Number"
            />

            {userType === 'admin' && (
              <>
                <label className="block mb-2">Enter Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Password"
                />
              </>
            )}


            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <div className="flex justify-center">
              <button onClick={handleLogin} className="bg-orange-500 text-white px-4 py-2 rounded">Login</button>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.1) translate(20px, -20px); }
        }
        .animate-blob {
          animation: blob 7s infinite ease-in-out;
        }
      `}</style>
    </div>
    </>
  );
};

export default Hero;