import React, { useState, useEffect } from "react";
import config from "../Config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userType, setUserType] = useState(null); // 'admin' or 'parent'
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const User = JSON.parse(localStorage.getItem("user"));
  const UserDetail = User?.data;
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
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
        closeModal();
        
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

  const navigateToHome = () => {
    navigate("/");
  };

  return (
    <>
      <nav
        className={`text-orange-500 p-4 sticky top-0 z-50 transition-shadow duration-300 ${
          isScrolled ? "shadow-lg bg-white" : "bg-white"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center px-0 lg:px-12 ">
          <div 
            className="text-2xl font-extrabold tracking-wide cursor-pointer"
            onClick={navigateToHome}
          >
            Capital Bus Service
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            <ul className="md:flex md:space-x-6 text-sm md:text-lg">
              {["home", "about", "gallery", "contact"].map((section) => (
                <li key={section}>
                  <a
                    href={`#${section}`}
                    onClick={() => setActiveSection(section)}
                    className={`block py-2 px-6 md:px-5 transition duration-300 rounded-full ${
                      activeSection === section
                        ? "bg-orange-500 text-white rounded-full border border-orange-500"
                        : "border-orange-500 text-orange-500"
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </a>
                </li>
              ))}
            </ul>

            <button
              onClick={handleLoginClick}
              className="bg-orange-500 text-white py-2 px-6 rounded-full transition duration-300 hover:bg-orange-600"
            >
              Login
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md z-50 border-t border-gray-100">
            <div className="container mx-auto px-4 py-2">
              <ul className="space-y-2">
                {["home", "about", "gallery", "contact"].map((section) => (
                  <li key={section}>
                    <a
                      href={`#${section}`}
                      onClick={() => {
                        setActiveSection(section);
                        setIsOpen(false);
                      }}
                      className={`block py-2 px-3 text-sm transition duration-200 rounded-md ${
                        activeSection === section
                          ? "bg-orange-500 text-white"
                          : "text-orange-500 hover:bg-orange-50"
                      }`}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </a>
                  </li>
                ))}
                <li className="pt-1">
                  <button
                    onClick={() => {
                      handleLoginClick();
                      setIsOpen(false);
                    }}
                    className="w-full text-orange-500  py-2 px-3 text-left text-sm rounded-md transition duration-200 hover:bg-orange-600"
                  >
                    Login
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </nav>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            {/* Close Button (Cross Icon) */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-red-600 hover:text-gray-900 text-2xl"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4">Login</h2>

            {/* Phone Number Input */}
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
    </>
  );
};

export default Navbar;