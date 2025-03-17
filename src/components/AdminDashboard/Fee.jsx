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

  // Combined data with both due and paid fees
  const feeData = [
    {
      student: "ABCD",
      from: "Dec",
      to: "Feb",
      amount: "$600",
      datePaid: "01-01-25",
      paymentMethod: "UPI",
      status: "Paid",
    },
    {
      student: "XYZ",
      from: "Jan",
      to: "Mar",
      amount: "$450",
      datePaid: "02-01-25",
      paymentMethod: "Card",
      status: "Paid",
    },
    {
      student: "LMN",
      from: "Feb",
      to: "Apr",
      amount: "$540",
      datePaid: "03-01-25",
      paymentMethod: "Cash",
      status: "Paid",
    },
    {
      student: "PQR",
      from: "Jan",
      to: "Mar",
      amount: "$500",
      datePaid: "-",
      paymentMethod: "-",
      status: "Due",
    },
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

              {/* Unified Fee Table */}
              <h3 className="text-2xl font-bold mb-4 text-black-700">
                Student Fee Status
              </h3>
              <table className="w-full border-collapse border border-gray-300 mb-6 bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-[#FCE7C3]  text-gray-800">
                    <th className="border p-3">Student</th>
                    <th className="border p-3">From</th>
                    <th className="border p-3">To</th>
                    <th className="border p-3">Amount</th>
                    <th className="border p-3">Date Paid</th>
                    <th className="border p-3">Payment Method</th>
                    <th className="border p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {feeData.map((fee, index) => (
                    <tr
                      key={index}
                      className={`cursor-pointer ${
                        fee.status === "Due"
                          ? "bg-red-100 hover:bg-red-200"
                          : "hover:bg-blue-50"
                      }`}
                      onClick={() => setSelectedStudent(fee.student)}
                    >
                      <td className="border p-3 text-center">{fee.student}</td>
                      <td className="border p-3 text-center">{fee.from}</td>
                      <td className="border p-3 text-center">{fee.to}</td>
                      <td className="border p-3 font-bold text-center">
                        {fee.amount}
                      </td>
                      <td className="border p-3 text-center">{fee.datePaid}</td>
                      <td className="border p-3 text-center">
                        {fee.status === "Due" ? "-" : fee.paymentMethod}
                      </td>
                      <td
                        className={`border p-3 text-center font-medium ${
                          fee.status === "Due"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {fee.status}
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
