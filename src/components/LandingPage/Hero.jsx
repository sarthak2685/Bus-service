import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose } from "react-icons/md";
import Bus from "../../assets/Buss.png";
const headings = [
  "Safe & Reliable School Bus Service",
  "Your Child’s Safety, Our Priority",
  "Punctual & Professional School Transport",
];
const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userType, setUserType] = useState("parent"); // Default set to parent
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  const [index, setIndex] = useState(0);

  const [text, setText] = useState("");
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    let timeout;

    if (isErasing) {
      // Erase text letter by letter
      timeout = setTimeout(() => {
        if (text.length > 0) {
          setText((prev) => prev.slice(0, -1));
        } else {
          setIsErasing(false);
          setIndex((prevIndex) => (prevIndex + 1) % headings.length);
        }
      }, 50);
    } else {
      // Type text letter by letter
      timeout = setTimeout(() => {
        if (text.length < headings[index].length) {
          setText((prev) => headings[index].slice(0, prev.length + 1));
        } else {
          setTimeout(() => setIsErasing(true), 1000); // Pause before erasing
        }
      }, 100);
    }

    return () => clearTimeout(timeout);
  }, [text, isErasing, index]);

  const handleLoginClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setInputValue("");
    setPassword("");
    setError("");
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError("");
  };

  const handleLogin = () => {
    if (userType === "parent") {
      if (!/^\d{10}$/.test(inputValue)) {
        setError("Please enter a valid 10-digit mobile number.");
        return;
      }
      alert(`OTP sent to ${inputValue}`);
    } else {
      if (!inputValue || !password) {
        setError("Please fill in both phone number and password.");
        return;
      }
      alert(
        `Logging in as admin with phone: ${inputValue} and password: ${password}`
      );
    }
    handleModalClose();
  };
  return (
    <>
      <div className="relative min-h-[80vh] bg-white flex flex-col md:flex-row items-center justify-center overflow-hidden px-8 mt-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20 z-0"></div>

        <div className="flex flex-col md:flex-row items-center w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            // whileHover={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}
            className="w-full md:w-1/2 mt-10 md:mt-0 cursor-pointer"
          >
            <motion.img
              src={Bus}
              alt="School Bus"
              className="w-full object-contain"
              animate={{ y: [0, -2, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Text Section */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
            <motion.h1
              key={index}
              className="text-3xl md:text-5xl font-extrabold text-orange-600"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {text}
              <motion.span
                className="ml-1 bg-orange-600 w-1 h-6 inline-block"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              ></motion.span>
            </motion.h1>

            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="text-lg md:text-xl text-gray-700"
            >
              Giving parents peace of mind while ensuring students reach school
              safely, happily, and on time.
            </motion.p>

            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.4 }}
              className="text-md md:text-lg text-gray-600"
            >
              Because every child's journey should begin and end with safety and
              care.
            </motion.p>

            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.6 }}
              className="text-md md:text-lg text-gray-600"
            >
              Stay connected with real-time tracking, punctual pickups, and
              professional drivers dedicated to your child's safety.
            </motion.p>

            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.8 }}
              className="text-md md:text-lg text-gray-600"
            >
              Empowering parents with transparency and ensuring students
              experience a stress-free commute.
            </motion.p>

            {/* <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2 }}
              className='flex justify-center'
            >
              <button className="bg-orange-500 hover:bg-orange-600 text-white text-lg py-1 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 " onClick={handleLoginClick}>

                Login
              </button>
            </motion.div> */}
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              <MdClose
                onClick={handleModalClose}
                className="absolute top-2 right-2 text-2xl cursor-pointer text-gray-600 hover:text-red-500"
              />
              <h2 className="text-xl font-bold mb-4">Login</h2>

              <label className="block mb-2">Enter Mobile Number:</label>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mb-2"
                placeholder="Mobile Number"
              />

              {userType === "admin" && (
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

              {/* <div className="flex justify-center">
                <button onClick={handleLogin} className="bg-orange-500 w-[50%] text-white px-4 py-2 rounded">Login</button>
              </div> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Hero;
