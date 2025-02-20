import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Fee = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dueFees = [
    { student: "ABCD", from: "Dec", to: "Feb", amount: "$600" },
    { student: "XYZ", from: "Jan", to: "Mar", amount: "$450" },
    { student: "LMN", from: "Feb", to: "Apr", amount: "$540" },
  ];

  const paidFees = [
    { student: "ABCD", month: "Dec", date: "01-01-25", paymentMethod: "UPI" },
    { student: "XYZ", month: "Jan", date: "02-01-25", paymentMethod: "Card" },
    { student: "LMN", month: "Feb", date: "03-01-25", paymentMethod: "Cash" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-row flex-grow">
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        <div
          className={`flex-grow transition-all ${
            isCollapsed ? "ml-0" : "ml-64"
          }`}
        >
          <Header toggleSidebar={toggleSidebar} />
          <div className="p-6 max-w-5xl mx-auto">
            <div className="bg-white shadow-lg rounded-2xl p-8">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center border-b pb-4">
                Fee Management
              </h2>

              {/* Current Months Due Table */}
              <h3 className="text-2xl font-bold mb-4 text-orange-700">
                Months Due
              </h3>
              <table className="w-full border-collapse border border-gray-300 mb-6 bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-orange-100 text-gray-800">
                    <th className="border p-3">Student</th>
                    <th className="border p-3">From</th>
                    <th className="border p-3">To</th>
                    <th className="border p-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {dueFees.map((fee, index) => (
                    <tr
                      key={index}
                      className="hover:bg-orange-50 cursor-pointer"
                      onClick={() => setSelectedStudent(fee.student)}
                    >
                      <td className="border p-3">{fee.student}</td>
                      <td className="border p-3">{fee.from}</td>
                      <td className="border p-3">{fee.to}</td>
                      <td className="border p-3 font-bold text-red-500">
                        {fee.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Current Months Paid Table */}
              <h3 className="text-2xl font-bold mb-4 text-green-700">
                Months Paid
              </h3>
              <table className="w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-green-100 text-gray-800">
                    <th className="border p-3">Student</th>
                    <th className="border p-3">Month</th>
                    <th className="border p-3">Date</th>
                    <th className="border p-3">Payment Method</th>
                  </tr>
                </thead>
                <tbody>
                  {paidFees.map((fee, index) => (
                    <tr
                      key={index}
                      className="hover:bg-green-50 cursor-pointer"
                      onClick={() => setSelectedStudent(fee.student)}
                    >
                      <td className="border p-3">{fee.student}</td>
                      <td className="border p-3">{fee.month}</td>
                      <td className="border p-3">{fee.date}</td>
                      <td className="border p-3">
                        <select
                          value={
                            paymentMethods[fee.student] || fee.paymentMethod
                          }
                          onChange={(e) =>
                            setPaymentMethods((prev) => ({
                              ...prev,
                              [fee.student]: e.target.value,
                            }))
                          }
                          className="border p-2 rounded w-full bg-white"
                        >
                          <option value="UPI">UPI</option>
                          <option value="Cash">Cash</option>
                          <option value="Card">Card</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fee;
