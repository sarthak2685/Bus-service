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

const Payments = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [monthlyFee, setMonthlyFee] = useState(0);
    const [lastPaymentDate, setLastPaymentDate] = useState("");
    const [nextDueDate, setNextDueDate] = useState("");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const monthNames = Array.from({ length: 12 }, (_, i) =>
        new Date(0, i).toLocaleString("default", { month: "long" })
    );

    const token = JSON.parse(localStorage.getItem("user"))?.data?.token;

    const [formData, setFormData] = useState({
        name: "",
        class: "",
        section: "",
        phone: "",
        fatherName: "",
        route: "",
        fromMonth: "",
        toMonth: "",
        amount: 0,
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const user = storedUser?.data?.user_data;
        const fee = parseInt(user?.driver?.route?.amount) || 0;
        const endMonthStr = user?.end_month;
        let fromMonth;

        if (endMonthStr) {
            const parsed = new Date(`${endMonthStr}T00:00:00`);
            fromMonth = !isNaN(parsed)
                ? parsed.getMonth() + 1
                : new Date().getMonth() + 1;
        } else {
            fromMonth = new Date().getMonth() + 1;
        }

        const totalAmount = calculateAmount(fromMonth, fromMonth, fee);

        setMonthlyFee(fee);
        setFormData((prev) => ({
            ...prev,
            name: user?.name || "",
            class: user?.student_class || "",
            section: user?.student_section || "",
            phone: user?.phone_number || "",
            fatherName: user?.fathers_name || "",
            route: user?.driver?.route?.name || "",
            fromMonth,
            toMonth: fromMonth,
            amount: totalAmount,
        }));
    }, []);

    useEffect(() => {
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

                const result = await response.json();
                const student = result?.data?.[0];
                if (student) {
                    if (result.start_month && result.grand_total) {
                        const formattedStart = new Date(
                            `${result.start_month}T00:00:00`
                        ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        });
                        setLastPaymentDate(
                            `${formattedStart} (₹ ${result.grand_total})`
                        );
                    }

                    if (result.end_month) {
                        const formattedEnd = new Date(
                            `${result.end_month}T00:00:00`
                        ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        });
                        setNextDueDate(formattedEnd);
                    }

                    // console.log("Fetched student info:", student);
                    // console.log("start_month raw:", student.start_month);
                    // console.log("end_month raw:", student.end_month);
                }
            } catch (err) {
                console.error("Error fetching invoice:", err);
            }
        };

        fetchInvoice();
    }, []);

    const calculateAmount = (fromMonth, toMonth, feePerMonth) => {
        const numberOfMonths =
            toMonth >= fromMonth
                ? toMonth - fromMonth + 1
                : 12 - fromMonth + toMonth + 1;
        return feePerMonth * numberOfMonths;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = parseInt(value, 10);

        setFormData((prevData) => {
            const newFrom =
                name === "fromMonth" ? newValue : prevData.fromMonth;
            const newTo = name === "toMonth" ? newValue : prevData.toMonth;

            return {
                ...prevData,
                [name]: newValue,
                amount: calculateAmount(newFrom, newTo, monthlyFee),
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Invoice Data Submitted:", formData);
        setIsModalOpen(false);
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
                                    {nextDueDate ? `${nextDueDate}` : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* History Table Placeholder */}
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
                                    <tr className="border border-[#FFF3E0]">
                                        <td className="p-2 md:p-3">
                                            {lastPaymentDate || "N/A"}
                                        </td>
                                        <td className="p-2 md:p-3 text-green-700 font-medium">
                                            ₹{monthlyFee}
                                        </td>
                                        <td className="p-2 md:p-3 text-green-700 font-medium">
                                            n/a
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
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-2xl md:w-[100vh] max-h-[80vh] border border-gray-200 transform scale-100 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">
                                Payment Details
                            </h2>
                            <MdClose
                                className="text-[#FF6F00] text-2xl font-bold cursor-pointer hover:text-[#FFD166] transition-colors duration-200"
                                onClick={() => setIsModalOpen(false)}
                            />
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                User Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(formData).map(([key, value]) =>
                                    key !== "fromMonth" &&
                                    key !== "toMonth" &&
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
                                    Payment month:
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <label className="block text-gray-600 text-sm mb-2">
                                            From
                                        </label>
                                        <select
                                            name="fromMonth"
                                            value={formData.fromMonth}
                                            onChange={handleChange}
                                            className="w-full p-1 border rounded-lg bg-gray-50"
                                        >
                                            {monthNames.map((month, i) => (
                                                <option key={i} value={i + 1}>
                                                    {month}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <label className="block text-gray-600 text-sm mb-2">
                                            To
                                        </label>
                                        <select
                                            name="toMonth"
                                            value={formData.toMonth}
                                            onChange={handleChange}
                                            className="w-full p-1 border rounded-lg bg-gray-50"
                                        >
                                            {monthNames.map((month, i) => (
                                                <option key={i} value={i + 1}>
                                                    {month}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <p className="text-gray-900 font-semibold text-lg">
                                    Total Amount: ₹{formData.amount}
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full p-2 bg-[#FF6F00] text-black font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-[#FFD166] hover:text-black disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? (
                                    "Submitting..."
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
