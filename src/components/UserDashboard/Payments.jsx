import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import UserHeader from "./UserHeader";
import {
    MdPayment,
    MdDateRange,
    MdCheckCircle,
    MdHistory,
    MdFileDownload,
    MdCurrencyRupee,
    MdClose,
} from "react-icons/md";
import config from "../Config";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Payments = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [monthlyFee, setMonthlyFee] = useState(0);
    const [lastPaymentDate, setLastPaymentDate] = useState("");
    const [nextDueDate, setNextDueDate] = useState("");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [paymentHistory, setPaymentHistory] = useState(null);
    const [paymentError, setPaymentError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const token = JSON.parse(localStorage.getItem("user"))?.data?.token;

    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [totalMonths, setTotalMonths] = useState(1);

    const [formData, setFormData] = useState({
        name: "",
        class: "",
        section: "",
        phone: "",
        fatherName: "",
        route: "",
        amount: 0,
    });

    const calculateMonthDiff = (start, end) => {
        const months =
            (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth()) +
            1;
        return months > 0 ? months : 1;
    };

    const calculateAmount = (start, end, fee) => {
        const months = calculateMonthDiff(start, end);
        return fee * months;
    };

    const fetchInvoice = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const user = storedUser?.data?.user_data;
            const id = user?.id;
            const mobile_no = user?.phone_number;

            if (!id || !mobile_no) return;

            const response = await fetch(
                `${config.apiUrl}/get-invoice/?id=${id}&mobile_no=${mobile_no}`,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) throw new Error("Failed to fetch invoice");

            const result = await response.json();
            const student = result?.data?.[0];

            let initialFromDate = new Date();
            initialFromDate.setDate(1);
            let initialToDate = new Date(initialFromDate);

            if (result.end_month) {
                const end = new Date(`${result.end_month}T00:00:00`);
                if (!isNaN(end)) {
                    initialFromDate = new Date(end);
                    initialFromDate.setMonth(end.getMonth() + 1);
                    initialFromDate.setDate(1);
                    initialToDate = new Date(initialFromDate);
                    
                    const formattedEnd = end.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    });
                    setNextDueDate(formattedEnd);
                }
            }

            setFromDate(initialFromDate);
            setToDate(initialToDate);
            setTotalMonths(1);

            if (result.start_month && result.grand_total) {
                const start = new Date(`${result.start_month}T00:00:00`);
                const end = new Date(`${result.end_month}T00:00:00`);

                const formattedStart = start.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                });

                const startMonth = start.toLocaleString("en-IN", {
                    month: "short",
                });
                const endMonth = end.toLocaleString("en-IN", {
                    month: "short",
                });

                const startYear = start.getFullYear();
                const endYear = end.getFullYear();

                const monthRange =
                    startYear === endYear
                        ? `${startMonth} - ${endMonth} ${startYear}`
                        : `${startMonth} ${startYear} - ${endMonth} ${endYear}`;

                setPaymentHistory({
                    date: formattedStart,
                    amount: result.grand_total,
                    range: monthRange,
                });

                setLastPaymentDate(
                    `${formattedStart} (₹ ${result.grand_total})`
                );
            }

            const busFee = parseInt(result.bus_fee) || parseInt(user?.driver?.route?.amount) || 0;
            setMonthlyFee(busFee);

            if (student) {
                setFormData((prev) => ({
                    ...prev,
                    name: student.name || "",
                    class: student.student_class || "",
                    section: student.student_section || "",
                    phone: student.phone_number || "",
                    fatherName: student.fathers_name || "",
                    route: student?.driver?.route?.name || "",
                    amount: busFee,
                }));
            }
        } catch (err) {
            console.error("Error fetching invoice:", err);
        }
    };

    useEffect(() => {
        const loadUserData = () => {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const user = storedUser?.data?.user_data;

            const fee = parseInt(user?.driver?.route?.amount) || 0;
            setMonthlyFee(fee);

            setFormData((prev) => ({
                ...prev,
                name: user?.name || "",
                class: user?.student_class || "",
                section: user?.student_section || "",
                phone: user?.phone_number || "",
                fatherName: user?.fathers_name || "",
                route: user?.driver?.route?.name || "",
                amount: fee,
            }));
        };

        loadUserData();
        fetchInvoice();
    }, []);

    const handleToDateChange = (date) => {
        const monthDiff = calculateMonthDiff(fromDate, date);
        setToDate(date);
        setTotalMonths(monthDiff);
        setFormData((prev) => ({
            ...prev,
            amount: calculateAmount(fromDate, date, monthlyFee),
        }));
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setLoading(true);
        setPaymentError(null);
        setSuccessMessage(null);
        
        try {
            const isScriptLoaded = await loadRazorpayScript();
            if (!isScriptLoaded) {
                throw new Error('Razorpay SDK failed to load. Are you online?');
            }

            const storedUser = JSON.parse(localStorage.getItem("user"));
            const user = storedUser?.data?.user_data;
            
            const orderResponse = await axios.post(
                `${config.apiUrl}/create-order/`,
                {
                    amount: formData.amount * 100,
                    currency: "INR",
                    receipt: `receipt_${user.id}_${Date.now()}`,
                    notes: {
                        userId: user.id,
                        name: user.name,
                        fromDate: fromDate.toISOString().split('T')[0],
                        toDate: toDate.toISOString().split('T')[0],
                        months: totalMonths,
                        route: formData.route,
                        phone: user.phone_number
                    }
                },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!orderResponse.data.id) {
                throw new Error("Failed to create order");
            }

            const options = {
                key: config.razorpayKey,
                amount: orderResponse.data.amount,
                currency: orderResponse.data.currency,
                name: "School Transport Service",
                description: `Payment for ${totalMonths} month(s) transport fee`,
                image: "https://your-school-logo.png",
                order_id: orderResponse.data.id,
                handler: async function(response) {
                    try {
                        const paymentData = {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            amount: formData.amount,
                            fromDate: fromDate.toISOString().split('T')[0],
                            toDate: toDate.toISOString().split('T')[0],
                            months: totalMonths,
                            user_id: user.id,
                            phone_number: user.phone_number,
                            route: formData.route,
                            order_id: orderResponse.data.id
                        };

                        const verifyResponse = await axios.post(
                            `${config.apiUrl}/verify-payment/`,
                            paymentData,
                            {
                                headers: {
                                    Authorization: `Token ${token}`,
                                    "Content-Type": "application/json",
                                },
                            }
                        );

                        if (verifyResponse.data && verifyResponse.data.status === "Payment Verified") {
                            setIsModalOpen(false);
                            setSuccessMessage("Payment verified successfully!");
                            fetchInvoice();
                        } else {
                            const errorMsg = verifyResponse.data?.message || 
                                          "Payment verification failed despite successful response";
                            setPaymentError(errorMsg);
                        }
                    } catch (error) {
                        console.error("Payment verification error:", error);
                        const errorMsg = error.response?.data?.error?.description || 
                                       error.response?.data?.message || 
                                       error.message;
                        setPaymentError(errorMsg);
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email || "student@school.com",
                    contact: user.phone_number
                },
                theme: {
                    color: "#FF6F00"
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                        setPaymentError("Payment cancelled by user");
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            
        } catch (error) {
            console.error("Payment error:", error);
            const errorMsg = error.response?.data?.error?.description || 
                           error.response?.data?.message || 
                           error.message;
            setPaymentError(errorMsg);
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handlePayment();
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

    return (
        <>
            <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
            <div
                className={`flex-grow transition-all ${
                    isCollapsed ? "ml-0" : "ml-64"
                }`}
            >
                <UserHeader toggleSidebar={toggleSidebar} />
                <div className="p-4 md:p-8 w-full bg-gray-100 min-h-screen">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl md:text-3xl font-semibold text-gray-900">
                            Payments & Fee Details
                        </h2>
                        <button
                            className="px-4 py-2 bg-[#FF6F00] text-black font-semibold flex items-center justify-between w-fit rounded-full shadow-md hover:bg-[#FFD166] hover:text-black transition-all duration-300"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <MdPayment className="text-xl my-0.5" />
                            Pay Now
                        </button>
                    </div>

                    {successMessage && (
                        <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
                            <p>{successMessage}</p>
                        </div>
                    )}

                    {paymentError && (
                        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                            <p>{paymentError}</p>
                        </div>
                    )}

                    {/* Payment Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                        <div className="bg-white p-4 md:p-6 shadow-md rounded-lg flex items-center gap-4 border border-gray-200">
                            <MdPayment className="text-blue-500 text-3xl md:text-4xl" />
                            <div>
                                <p className="text-md md:text-lg text-gray-600">
                                    Last Payment
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-blue-600">
                                    {lastPaymentDate || "N/A"}
                                </p>
                            </div>
                        </div>
                        <div className="bg-white p-4 md:p-6 shadow-md rounded-lg flex items-center gap-4 border border-gray-200">
                            <MdDateRange className="text-red-500 text-3xl md:text-4xl" />
                            <div>
                                <p className="text-md md:text-lg text-gray-600">
                                    Next Due
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-red-600">
                                    {nextDueDate || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* History Table */}
                    <div className="bg-white p-4 md:p-6 shadow-md rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <MdHistory className="text-[#FF6F00] text-2xl md:text-3xl" />
                            <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                                Payment History
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px] border border-[#FFF3E0] rounded-lg overflow-hidden">
                                <thead className="bg-[#FFF3E0] text-black">
                                    <tr>
                                        <th className="border p-2 md:p-3 text-left">
                                            Payment Date
                                        </th>
                                        <th className="border p-2 md:p-3 text-left">
                                            Amount
                                        </th>
                                        <th className="border p-2 md:p-3 text-left">
                                            Month Paid
                                        </th>
                                        <th className="border p-2 md:p-3 text-left">
                                            Status
                                        </th>
                                        <th className="border p-2 md:p-3 text-left">
                                            Download
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="border border-[#FFF3E0] bg-gray-50">
                                    {paymentHistory ? (
                                        <tr className="border border-[#FFF3E0]">
                                            <td className="p-2 md:p-3">
                                                {paymentHistory.date}
                                            </td>
                                            <td className="p-2 md:p-3 text-green-700 font-medium">
                                                ₹{paymentHistory.amount}
                                            </td>
                                            <td className="p-2 md:p-3 text-green-700 font-medium">
                                                {paymentHistory.range}
                                            </td>
                                            <td className="p-2 md:p-3 text-green-600 flex items-center gap-1">
                                                <MdCheckCircle className="text-green-600" />{" "}
                                                Paid
                                            </td>
                                            <td className="p-2 md:p-3">
                                                <button className="flex items-center gap-1 text-blue-700 hover:text-blue-900">
                                                    <MdFileDownload className="text-xl" />{" "}
                                                    Download
                                                </button>
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="text-center py-4 text-gray-500"
                                            >
                                                No payment history found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 z-50">
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-2xl md:min-w-[500px] max-h-[80vh] border border-gray-200 transform scale-100 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">
                                Payment Details
                            </h2>
                            <MdClose
                                className="text-[#FF6F00] text-2xl font-bold cursor-pointer hover:text-[#FFD166] transition-colors duration-200"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setPaymentError(null);
                                }}
                            />
                        </div>
                        {paymentError && (
                            <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
                                <p>{paymentError}</p>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                User Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(formData).map(([key, value]) =>
                                    key !== "amount" ? (
                                        <div key={key} className="space-y-1">
                                            <label className="block text-gray-700 capitalize font-medium text-sm">
                                                {key.replace(/([A-Z])/g, " $1")}
                                            </label>
                                            <input
                                                type="text"
                                                name={key}
                                                value={value}
                                                readOnly
                                                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                    ) : null
                                )}
                            </div>

                            <h3 className="text-lg font-semibold text-gray-800">
                                Account Details
                            </h3>
                            <div className="space-y-4">
                                <label className="block text-gray-700 capitalize font-medium text-sm">
                                    Payment period:
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="block text-gray-600 text-sm">
                                            From
                                        </label>
                                        <DatePicker
                                            selected={fromDate}
                                            onChange={() => {}}
                                            dateFormat="MMMM yyyy"
                                            showMonthYearPicker
                                            className="w-full p-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                            disabled
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="block text-gray-600 text-sm">
                                            To
                                        </label>
                                        <DatePicker
                                            selected={toDate}
                                            onChange={handleToDateChange}
                                            dateFormat="MMMM yyyy"
                                            showMonthYearPicker
                                            minDate={fromDate}
                                            className="w-full p-2 border rounded-lg bg-gray-50 focus:border-[#FF6F00] focus:ring-[#FF6F00]"
                                        />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Total Months: <strong>{totalMonths}</strong>
                                </p>
                                <p className="text-gray-900 font-semibold text-lg">
                                    Total Amount: ₹{formData.amount}
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full p-3 bg-[#FF6F00] text-black font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-[#FFD166] hover:text-black disabled:opacity-50 transition-colors duration-200"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <MdCurrencyRupee className="text-xl my-1" />
                                        Pay Now
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Payments;