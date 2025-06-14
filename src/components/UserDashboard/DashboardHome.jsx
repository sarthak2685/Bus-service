import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import UserHeader from "./UserHeader";
import {
    MdAccessTime,
    MdDirectionsBus,
    MdLocationOn,
    MdEdit,
    MdNotificationsActive,
} from "react-icons/md";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import config from "../Config";

const DashboardHome = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userData = storedUser?.data?.user_data || {};
    const S = JSON.parse(localStorage.getItem("user"));
    const token = S?.data?.token;

    const [userInfo, setUserInfo] = useState({
        childName: userData.name || "N/A",
        class: userData.student_class || "N/A",
        section: userData.student_section || "N/A",
        phone: userData.phone_number || "N/A",
        fatherName: userData.fathers_name || "N/A",
        emergencyContact: userData.contact_number || "N/A",
    });

    const [driverInfo] = useState({
        driverName: userData.driver?.name || "N/A",
        routeName: userData.driver?.route?.name || "N/A",
        routeDescription: userData.driver?.route?.description || "N/A",
        driverContact: userData.driver?.contact || "N/A",
    });

    const [busInfo] = useState({
        arrivalTime: userData.bus_arrival_time ?? "N/A",
        busNumber: userData.driver?.vehicle_number || "N/A",
        pickupLocation: userData.driver?.route?.name || "N/A",
        pickupDescription: userData.driver?.route?.description || "N/A",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [tempEmergencyContact, setTempEmergencyContact] = useState(
        userInfo.emergencyContact
    );
    const [sosMessage, setSosMessage] = useState("");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleEmergencyChange = (e) => {
        setTempEmergencyContact(e.target.value);
    };

    const saveEmergencyContact = () => {
        setUserInfo({ ...userInfo, emergencyContact: tempEmergencyContact });
        setIsEditing(false);
    };

    const toggleSidebar = () => setIsCollapsed((prev) => !prev);

    useEffect(() => {
        const handleResize = () => {
            setIsCollapsed(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleEmergencyClick = () => {
        setShowConfirm(true);
    };

    const sendWhatsAppMessage = (phoneNumber, message) => {
        const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
            message
        )}`;
        window.open(whatsappLink, "_blank");
    };

    const confirmEmergency = () => {
        setShowConfirm(false);

        // Admin phone number (you may need to get this from your config or backend)
        const adminPhone = "+918981516960"; // Replace with actual admin number
        const driverPhone = `+91${driverInfo.driverContact}`;

        const emergencyMessage = `🚨 EMERGENCY ALERT 🚨
        
Student: ${userInfo.childName}
Class: ${userInfo.class}-${userInfo.section}
Father: ${userInfo.fatherName}
Contact: ${userInfo.phone}

${sosMessage || "Emergency alert triggered!"}

Current Location: ${busInfo.pickupLocation} (${busInfo.pickupDescription})`;

        // Send to admin
        sendWhatsAppMessage(adminPhone, emergencyMessage);

        // Send to driver if contact exists
        if (driverInfo.driverContact && driverInfo.driverContact !== "N/A") {
            sendWhatsAppMessage(driverPhone, emergencyMessage);
        }

        alert("Emergency alert sent via WhatsApp to admin and driver!");
        setSosMessage("");
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

                <div className="p-8 bg-gray-50 min-h-screen w-full">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Dashboard Overview
                        </h2>
                        <button
                            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-300 flex items-center gap-2"
                            onClick={handleEmergencyClick}
                        >
                            <MdNotificationsActive className="text-xl" />
                            <span>Emergency SOS</span>
                        </button>
                    </div>

                    {/* Confirmation Dialog */}
                    {showConfirm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">
                                    🚨 Confirm Emergency Alert
                                </h2>
                                <p className="text-gray-600">
                                    This will send WhatsApp messages to school
                                    admin and driver.
                                </p>
                                <textarea
                                    placeholder="Describe the emergency situation..."
                                    className="w-full mt-4 p-2 border border-gray-300 rounded-md resize-none"
                                    rows={4}
                                    value={sosMessage}
                                    onChange={(e) =>
                                        setSosMessage(e.target.value)
                                    }
                                />

                                <div className="mt-4 flex justify-center gap-4">
                                    <button
                                        className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
                                        onClick={confirmEmergency}
                                    >
                                        Send Emergency Alert
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400"
                                        onClick={() => setShowConfirm(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                            {/* User Details */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                                    User Details
                                </h3>
                                <div className="space-y-4 font-semibold">
                                    <div className="flex items-center">
                                        <span className="text-black w-32">
                                            Name of Child:
                                        </span>
                                        <span className="text-gray-800">
                                            {userInfo.childName}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-black w-32">
                                            Class:
                                        </span>
                                        <span className="text-gray-800">
                                            {userInfo.class}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-black w-32">
                                            Sec:
                                        </span>
                                        <span className="text-gray-800">
                                            {userInfo.section}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-black w-32">
                                            Phone No:
                                        </span>
                                        <span className="text-gray-800">
                                            {userInfo.phone}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-black w-32">
                                            Father’s Name:
                                        </span>
                                        <span className="text-gray-800">
                                            {userInfo.fatherName}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-red-800 w-32">
                                            Emergency Contact:
                                        </span>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={tempEmergencyContact}
                                                onChange={handleEmergencyChange}
                                                className="ml-2 p-1 border rounded w-40"
                                            />
                                        ) : (
                                            <span className="text-gray-800">
                                                {userInfo.emergencyContact}
                                            </span>
                                        )}
                                        {isEditing ? (
                                            <>
                                                <AiOutlineCheck
                                                    className="text-green-500 text-xl cursor-pointer ml-2"
                                                    onClick={
                                                        saveEmergencyContact
                                                    }
                                                />
                                                <AiOutlineClose
                                                    className="text-red-500 text-xl cursor-pointer ml-2"
                                                    onClick={() =>
                                                        setIsEditing(false)
                                                    }
                                                />
                                            </>
                                        ) : (
                                            <MdEdit
                                                className="text-blue-500 text-xl cursor-pointer ml-2"
                                                onClick={() =>
                                                    setIsEditing(true)
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Driver Details */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                                    Driver Details
                                </h3>
                                <div className="space-y-4 font-semibold">
                                    <div className="flex items-center">
                                        <span className="text-black w-32">
                                            Driver:
                                        </span>
                                        <span className="text-gray-800">
                                            {driverInfo.driverName}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-black w-32">
                                            Route Name:
                                        </span>
                                        <span className="text-gray-800">
                                            {driverInfo.routeName}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-black w-32">
                                            Route Description:
                                        </span>
                                        <span className="text-gray-800">
                                            {driverInfo.routeDescription}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-black w-32">
                                            Driver Contact:
                                        </span>
                                        <span className="text-gray-800">
                                            {driverInfo.driverContact}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bus Details */}
                        <div className="p-8 border-t border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">
                                Bus Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-blue-50 p-6 rounded-lg">
                                    <MdAccessTime className="text-blue-600 text-3xl mb-4" />
                                    <p className="text-lg font-medium text-gray-700 mb-2">
                                        Bus Arrival Time
                                    </p>
                                    <p className="text-xl font-bold text-blue-600">
                                        {busInfo.arrivalTime}
                                    </p>
                                </div>
                                <div className="bg-green-50 p-6 rounded-lg">
                                    <MdDirectionsBus className="text-green-600 text-3xl mb-4" />
                                    <p className="text-lg font-medium text-gray-700 mb-2">
                                        Vehicle Number
                                    </p>
                                    <p className="text-xl font-bold text-green-600">
                                        {busInfo.busNumber}
                                    </p>
                                </div>
                                <div className="bg-yellow-50 p-6 rounded-lg">
                                    <MdLocationOn className="text-yellow-600 text-3xl mb-4" />
                                    <p className="text-lg font-medium text-gray-700 mb-2">
                                        Route
                                    </p>
                                    <p className="text-xl font-bold text-yellow-600">
                                        {busInfo.pickupLocation} (
                                        {busInfo.pickupDescription})
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardHome;
