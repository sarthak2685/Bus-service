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

const DashboardHome = () => {
    const [busInfo] = useState({
        arrivalTime: "7:30 AM",
        busNumber: 25,
        pickupLocation: "Near School Gate",
        status: "Arrived",
    });

    const [userInfo, setUserInfo] = useState({
        childName: "John Doe",
        class: "5",
        section: "A",
        phone: "9876543210",
        fatherName: "Michael Doe",
        emergencyContact: "9123456789",
    });

    const [driverInfo] = useState({
        driverName: "James Smith",
        routeName: "Downtown to School",
        driverContact: "9876543211",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [tempEmergencyContact, setTempEmergencyContact] = useState(
        userInfo.emergencyContact
    );

    const handleEmergencyChange = (e) => {
        setTempEmergencyContact(e.target.value);
    };

    const saveEmergencyContact = () => {
        setUserInfo({ ...userInfo, emergencyContact: tempEmergencyContact });
        setIsEditing(false);
    };

    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => setIsCollapsed((prev) => !prev);

    useEffect(() => {
        const handleResize = () => {
            setIsCollapsed(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [showConfirm, setShowConfirm] = useState(false);

    const handleEmergencyClick = () => {
        setShowConfirm(true);
    };

    const confirmEmergency = () => {
        setShowConfirm(false);
        alert("🚨 Emergency alert sent to school authorities!");
        // Add backend API call here
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

                <div className="p-8 bg-gray-100  min-h-screen w-full">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-4xl font-extrabold mb-6 text-gray-800">
                            Dashboard Overview
                        </h2>
                        <button
                            className="w-full sm:w-auto px-5 sm:px-6 py-3 bg-red-600 text-white font-bold flex items-center justify-center sm:gap-3 gap-2 rounded-full shadow-lg 
                                   hover:bg-red-700 active:scale-95 transition-all duration-300 relative animate-pulse"
                            onClick={handleEmergencyClick}
                        >
                            <MdNotificationsActive className="text-lg sm:text-2xl animate-spin-slow" />
                            <span className="text-sm sm:text-base uppercase">
                                Emergency SOS
                            </span>
                            <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-white text-red-600 text-[10px] sm:text-xs font-bold px-1 sm:px-2 py-0.5 sm:py-1 rounded-full shadow">
                                ALERT
                            </span>
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
                                    Are you sure you want to send an emergency
                                    alert?
                                </p>
                                <div className="mt-4 flex justify-center gap-4">
                                    <button
                                        className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700"
                                        onClick={confirmEmergency}
                                    >
                                        Yes, Send Alert
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400"
                                        onClick={() => setShowConfirm(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* User Details */}
                        <div className="bg-white p-6 shadow-lg rounded-xl border-l-8 border-blue-500">
                            <h3 className="text-2xl text-blue-500 font-semibold  mb-4">
                                User Details
                            </h3>
                            <p className="text-lg">
                                <strong>Name of Child:</strong>{" "}
                                {userInfo.childName}
                            </p>
                            <p className="text-lg">
                                <strong>Class:</strong> {userInfo.class} Sec-
                                {userInfo.section}
                            </p>
                            <p className="text-lg">
                                <strong>Phone No:</strong> {userInfo.phone}
                            </p>
                            <p className="text-lg">
                                <strong>Father’s Name:</strong>{" "}
                                {userInfo.fatherName}
                            </p>
                            <div className="text-lg mt-2 flex items-center">
                                <strong className="text-red-600">
                                    Emergency Contact:
                                </strong>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={tempEmergencyContact}
                                        onChange={handleEmergencyChange}
                                        className="ml-2 p-1 border rounded w-40"
                                    />
                                ) : (
                                    <span className="ml-2">
                                        {userInfo.emergencyContact}
                                    </span>
                                )}
                                {isEditing ? (
                                    <>
                                        <AiOutlineCheck
                                            className="text-green-500 text-xl cursor-pointer ml-2"
                                            onClick={saveEmergencyContact}
                                        />
                                        <AiOutlineClose
                                            className="text-red-500 text-xl cursor-pointer ml-2"
                                            onClick={() => setIsEditing(false)}
                                        />
                                    </>
                                ) : (
                                    <MdEdit
                                        className="text-blue-500 text-xl cursor-pointer ml-2"
                                        onClick={() => setIsEditing(true)}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Driver Details */}
                        <div className="bg-white p-6 shadow-lg rounded-xl border-l-8 border-green-500">
                            <h3 className="text-2xl font-semibold text-green-500 mb-4">
                                Driver Details
                            </h3>
                            <p className="text-lg">
                                <strong>Driver:</strong> {driverInfo.driverName}
                            </p>
                            <p className="text-lg">
                                <strong>Route Name:</strong>{" "}
                                {driverInfo.routeName}
                            </p>
                            <p className="text-lg">
                                <strong>Driver Contact:</strong>{" "}
                                {driverInfo.driverContact}
                            </p>
                        </div>
                    </div>

                    {/* Bus Details */}
                    <div className="bg-white p-6 shadow-lg rounded-xl border-l-8 border-yellow-500">
                        <h3 className="text-2xl font-semibold text-yellow-500 mb-4">
                            Bus Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-800">
                            <div className="bg-blue-100 p-6 rounded-xl shadow text-center">
                                <MdAccessTime className="text-blue-600 text-4xl mx-auto mb-2" />
                                <p className="text-lg font-medium">
                                    Bus Arrival Time
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {busInfo.arrivalTime}
                                </p>
                            </div>
                            <div className="bg-green-100 p-6 rounded-xl shadow text-center">
                                <MdDirectionsBus className="text-green-600 text-4xl mx-auto mb-2" />
                                <p className="text-lg font-medium">
                                    Vehicle Number
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {busInfo.busNumber}
                                </p>
                            </div>
                            <div className="bg-yellow-100 p-6 rounded-xl shadow text-center">
                                <MdLocationOn className="text-yellow-600 text-4xl mx-auto mb-2" />
                                <p className="text-lg font-medium">Route</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {busInfo.pickupLocation}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardHome;
