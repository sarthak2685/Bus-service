import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import UserHeader from "./UserHeader";
import WhatsAppButton from "./WhatsAppButton";
import {
    AiOutlineMail,
    AiOutlinePhone,
    AiOutlineQuestionCircle,
} from "react-icons/ai";
import { FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    MdNotificationsActive,
    MdPayment,
    MdSos,
    MdWarning,
} from "react-icons/md";
import emailjs from '@emailjs/browser';

const Contact = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        number: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);

    const toggleSidebar = () => setIsCollapsed((prev) => !prev);

    useEffect(() => {
        const handleResize = () => {
            setIsCollapsed(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        
        // Initialize EmailJS with your public key
        emailjs.init('ogUx0NT98KbPRK6QJ');
        
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await emailjs.send(
                'service_03kz58b', // Your service ID
                'template_739o0hg', // Your template ID
                formData,
                'ogUx0NT98KbPRK6QJ' // Your public key
            );

            if (response.status === 200) {
                toast.success("Message sent successfully! We will get back to you soon.");
                setFormData({ name: "", email: "", number: "", message: "" });
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('EmailJS Error:', error);
            toast.error(error.message || 'An error occurred while sending your message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
            <div
                className={`flex-grow transition-all ${
                    isCollapsed ? "ml-0" : "ml-64"
                }`}
            >
                <UserHeader toggleSidebar={toggleSidebar} />
                <WhatsAppButton />
                <div className="p-6 w-full bg-gray-100 min-h-screen">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900">
                        Contact & Help
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 bg-white p-0.5 rounded-lg shadow-lg ">
                        <div className="bg-white p-6  ">
                            <h3 className="text-3xl text-[#FF6F00] font-bold mb-4">
                                Submit a Request
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent transition-all duration-200"
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent transition-all duration-200"
                                    required
                                />
                                <input
                                    type="text"
                                    name="number"
                                    placeholder="Your Phone Number"
                                    value={formData.number}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent transition-all duration-200"
                                    required
                                />
                                <textarea
                                    name="message"
                                    rows="4"
                                    placeholder="Your Message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent transition-all duration-200"
                                    required
                                ></textarea>
                                <button
                                    type="submit"
                                    className="w-full p-2  text-black font-semibold rounded-lg flex items-center justify-center gap-2 bg-[#FFD166]  disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        "Submitting..."
                                    ) : (
                                        <>
                                            <FaPaperPlane /> Submit
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                        <div className="bg-white p-6   ">
                            <h3 className="text-3xl text-[#FF6F00] font-bold mb-4">
                                Contact Information
                            </h3>
                            <a 
                                href="mailto:capitalbusserv@gmail.com" 
                                className="flex items-center gap-2 font-semibold text-black mb-2 hover:text-[#FF6F00] transition-colors duration-200"
                            >
                                <AiOutlineMail className="text-xl text-[#FFD166]" />
                                Email: capitalbusserv@gmail.com
                            </a>
                            <a 
                                href="tel:+919155286099" 
                                className="flex items-center gap-2 font-semibold text-black hover:text-[#FF6F00] transition-colors duration-200"
                            >
                                <AiOutlinePhone className="text-xl text-[#FFD166]" />
                                Phone: +91 91552 86099
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;