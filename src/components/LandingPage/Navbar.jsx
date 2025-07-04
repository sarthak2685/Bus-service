import React, { useState, useEffect } from "react";
import config from "../Config";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userType, setUserType] = useState(null); // 'admin' or 'parent'
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const User = JSON.parse(localStorage.getItem("user"));
  const UserDetail = User?.data;
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePhoneNumberChange = async (e) => {
    const inputNumber = e.target.value;
    setPhoneNumber(inputNumber);
  
    if (inputNumber.length === 10) {
      try {
        const response = await fetch(
          `${config.apiUrl}/check-user/?number=${inputNumber}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
  
        if (data?.type) {
          setUserType(data.type);
          console.log("role", data.type);
  
          if (data.type === "parent") {
            // Send OTP immediately
            await fetch(`${config.apiUrl}/send-otp/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ phone: Number(inputNumber),
                phone_2: "91" + Number(inputNumber)  // Assuming you want to send OTP to the same number
               }),
            });
            
            toast.info("OTP sent to your number", {
              position: "top-right",
              autoClose: 2000,
            });
          }
        } else {
          setUserType(null);
          alert("Phone number not found.");
        }
      } catch (error) {
        console.error("Error verifying phone number:", error);
      }
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
  };

  const handleLogin = async () => {
    const payload = { mobileno: Number(phoneNumber) };
    if (userType === "admin") payload.password = password;
    if (userType === "parent") payload.password = otp;

    try {
      const response = await fetch(`${config.apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log("JSON response", data);
      if (data.status === true) {
        toast.success("Login successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        localStorage.setItem("user", JSON.stringify(data));
        console.log("user", data.data);
        closeModal();
        if (data.data.type === "admin") {
          window.location.href = "/add-user";
        } else if (data.data.type === "student") {
          window.location.href = "/UserDashboard";
        }
      } else {
        toast.error("Invalid Credential!", {
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
      toast.error("Invalid Credential! Please Try Again", {
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
      <nav
        className={`text-orange-500 p-4 sticky top-0 z-50 transition-shadow duration-300 ${
          isScrolled ? "shadow-lg bg-white" : "bg-white"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center px-0 lg:px-12 ">
          <div className="text-2xl font-extrabold tracking-wide cursor-pointer">
            School Bus Service
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

          <div
            className={`md:flex md:items-center md:space-x-8 absolute md:static top-16 left-52 w-[45%] bg-slate-50 md:bg-transparent shadow-md md:shadow-none md:w-auto md:block transition-all duration-300 ${
              isOpen ? "block" : "hidden"
            }`}
          >
            <ul className="md:flex md:space-x-6 text-sm md:text-lg flex flex-col md:flex-row justify-center items-center">
              {["home", "about", "gallery", "contact"].map((section) => (
                <li key={section} className="text-center md:text-left w-24">
                  <a
                    href={`#${section}`}
                    onClick={() => setActiveSection(section)}
                    className={`block py-2 px-6 md:px-5transition duration-300  rounded-full ${
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

            <div className="text-center md:text-left mt-3 md:mt-0">
              <button
                onClick={handleLoginClick}
                className="bg-orange-500 text-white py-2 px-6 rounded-full transition duration-300 hover:bg-orange-600"
              >
                Login
              </button>
            </div>
          </div>
        </div>
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
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className="w-full p-2 border border-gray-300 rounded mb-3"
            />

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
                className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 rounded mb-3"
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
