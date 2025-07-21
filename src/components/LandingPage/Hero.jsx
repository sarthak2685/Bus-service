import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose } from "react-icons/md";
import Bus from "../../assets/Buss.png";
import config from "../Config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const headings = [
  "Safe & Reliable School Bus Service",
  "Your Child's Safety, Our Priority",
  "Punctual & Professional School Transport",
];

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userType, setUserType] = useState(null); // 'admin' or 'parent'
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const navigate = useNavigate();

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

  const handlePhoneNumberChange = async (e) => {
    const inputNumber = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    setPhoneNumber(inputNumber);
    setPhoneError(""); // Clear any previous error

    if (inputNumber.length === 10) {
      try {
        const response = await fetch(
          `${config.apiUrl}/check-user/?number=${inputNumber}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        
        const data = await response.json();

        if (data?.type) {
          setUserType(data.type);
          setPhoneError(""); // Clear error if number is valid

          if (data.type === "parent") {
            // Send OTP immediately
            await fetch(`${config.apiUrl}/send-otp/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                phone: Number(inputNumber),
                phone_2: "91" + Number(inputNumber)
              }),
            });
            
            toast.info("OTP sent to your number", {
              position: "top-right",
              autoClose: 2000,
            });
          }
        } else {
          setUserType(null);
          setPhoneError("This phone number is not registered with us");
          toast.error("Phone number not found", {
            position: "top-right",
            autoClose: 2000,
          });
        }
      } catch (error) {
        console.error("Try verified phone number", error);
        setPhoneError("Try verified phone number. Please try again.");
        toast.error("Try verified phone number", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } else if (inputNumber.length > 10) {
      setPhoneNumber(inputNumber.slice(0, 10)); // Limit to 10 digits
    } else {
      setUserType(null); // Reset if the number is not 10 digits
    }
  };

  const handleLoginClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setPhoneNumber("");
    setUserType(null);
    setPassword("");
    setOtp("");
    setPhoneError("");
  };

  const handleLogin = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      setPhoneError("Please enter a valid 10-digit phone number");
      return;
    }

    if (phoneError) {
      return; // Don't proceed if there's a phone error
    }

    const payload = { mobileno: Number(phoneNumber) };
    if (userType === "admin") payload.password = password;
    if (userType === "parent") payload.password = otp;

    try {
      const response = await fetch(`${config.apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      const data = await response.json();
      
      if (data.status === true) {
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        localStorage.setItem("user", JSON.stringify(data));
        handleModalClose();
        
        if (data.data.type === "admin") {
          navigate("/add-user");
        } else if (data.data.type === "student") {
          navigate("/UserDashboard");
        }
      } else {
        toast.error("Invalid credentials!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
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
            <div className="md:space-y-6">
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

              {/* Login Button - Mobile View */}
              <div className="block md:hidden mt-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 2 }}
                  className='flex justify-center'
                >
                  <button 
                    className="bg-orange-500 hover:bg-orange-600 text-white text-lg py-1 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105" 
                    onClick={handleLoginClick}
                  >
                    Pay Now
                  </button>
                </motion.div>
              </div>
            </div>

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

            {/* Login Button - Desktop View */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2 }}
              className='hidden md:flex justify-center'
            >
              <button 
                className="bg-orange-500 hover:bg-orange-600 text-white text-lg py-1 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105" 
                onClick={handleLoginClick}
              >
                Pay Now
              </button>
            </motion.div>
          </div>
        </div>

        {/* Login Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              <MdClose
                onClick={handleModalClose}
                className="absolute top-2 right-2 text-2xl cursor-pointer text-gray-600 hover:text-red-500"
              />
              <h2 className="text-xl font-bold mb-4">Login</h2>

              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Enter 10-digit Phone Number"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  maxLength="10"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {phoneError && (
                  <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                )}
              </div>

              {/* Conditional Fields */}
              {userType === "admin" && (
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-3"
                />
              )}

              {userType === "parent" && (
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-3"
                />
              )}

              {/* Login Button */}
              {userType && (
                <button
                  onClick={handleLogin}
                  disabled={!!phoneError}
                  className={`w-full py-2 rounded mb-3 ${
                    phoneError
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-orange-400 hover:bg-orange-500 text-white"
                  }`}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Hero;