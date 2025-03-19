import React, { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { FaDownload } from "react-icons/fa";
import {
  FiSend,
} from "react-icons/fi";
import config from "../Config";

const Invoice = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [studentDetails, setStudentDetails] = useState({
    name: "",
    parentName: "",
    mobile: "",
    route: "",
    driverName: "",
    busFee: 0,
    lateFees: 0,
  });

  const [months, setMonths] = useState(0);
  const [lateFees, setLateFees] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const componentRef = useRef(null);
  const S = JSON.parse(localStorage.getItem("user"));
  const token = S?.data?.token;

  useEffect(() => {
    fetch(`${config.apiUrl}/students/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error("Error fetching students:", error));
  }, []);

  const handleStudentSelect = (e) => {
    const studentId = e.target.value;
    setSelectedStudent(studentId);
    const student = students.find((s) => s.id === studentId);
    if (student) {
      setStudentDetails({
        name: student.name,
        class: student.student_class,
        section: student.student_section,
        phone: student.phone_number,
        fatherName: student?.fathers_name,
        contact: student.contact_number,
        driverName: student.driver?.name || "N/A",
        routeName: student.driver?.route?.name || "N/A",
        busFee: parseFloat(student.driver?.route?.amount || 0),
        busArrival: student.bus_arrival_time || "N/A",
      });
      setLateFees(0);
    }
  };


  // Auto-calculate months
  useEffect(() => {
    if (startMonth && endMonth) {
      const start = new Date(startMonth);
      const end = new Date(endMonth);
      let diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

      // Ensure minimum value is 1
      setMonths(diffMonths > 0 ? diffMonths : 1);
    }
  }, [startMonth, endMonth]);

  const grandTotal = studentDetails.busFee * months + lateFees;

  const downloadInvoice = useReactToPrint({
    content: () => {
      console.log("Fetching invoice content...");
      return componentRef.current;
    },
    documentTitle: "Student_Invoice",
    onBeforeGetContent: () => {
      console.log("Generating PDF...");
    },
  });

  const handleDownload = useReactToPrint({
    content: () => {
      if (!componentRef.current) {
        alert("Invoice is empty. Please select a student.");
        return null;
      }
      return componentRef.current;
    },
  });
  const shareViaWhatsApp = () => {
    const message = `📜 *CAPITAL BUS SERVICE*\n *Invoice*\n------------------\n*👨‍🎓 *Student:* ${studentDetails.name}
👪 *Parent:* ${studentDetails.fatherName}
📞 *Mobile:* ${studentDetails.contact}\n🚌 *Route:* ${studentDetails.routeName}\n👷 *Driver:* ${studentDetails.driverName}\n📅 *Duration:* ${startMonth} to ${endMonth}\n💰 *Fees:* ₹${(studentDetails.busFee * months).toFixed(2)}
\n⚠️ *Late Fees:* ₹${lateFees}\n💵 *Grand Total:* ₹${grandTotal.toFixed(2)}\n💳 *Payment Mode:* ${paymentMethod}\n *Thanks For Choosing Us!!*`;

    const whatsappURL = `https://wa.me/+91${studentDetails.contact}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-row flex-grow">
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
        <div className={`flex-grow transition-all ${isCollapsed ? "ml-0" : "ml-64"}`}>
          <Header toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
          <div className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
            <div ref={componentRef}>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center border-b pb-4">Invoice</h2>

              {/* Select Student */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-1">Select Student</label>
                <select value={selectedStudent} onChange={handleStudentSelect} className="border p-2 rounded w-48">
                  <option value="">Select</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} - {student.class}
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Details Display */}
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <p className="truncate sm:whitespace-normal break-words"><span>Father Name:</span> {studentDetails.fatherName || "---"}</p>
                <p className="truncate sm:whitespace-normal break-words"><span>Mobile:</span> {studentDetails.contact || "---"}</p>
                <p className="truncate sm:whitespace-normal break-words"><span>Route:</span> {studentDetails.routeName || "---"}</p>
                <p className="truncate sm:whitespace-normal break-words"><span>Driver:</span> {studentDetails.driverName || "---"}</p>
              </div>


              {/* Fee Details */}
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Fee Details</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium">Start Month</label>
                  <input type="month" value={startMonth} onChange={(e) => setStartMonth(e.target.value)} className="border p-2 rounded w-full" />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">End Month</label>
                  <input type="month" value={endMonth} onChange={(e) => setEndMonth(e.target.value)} className="border p-2 rounded w-full" />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">Months</label>
                  <input type="number" value={months} readOnly className="border p-2 rounded w-full" />
                </div>
              </div>

              <div className="mb-4 flex items-center gap-6">
                {/* Late Fees */}
                <div className="w-32">
                  <label className="block text-gray-700 font-medium mb-1">Late Fees</label>
                  <input
                    type="number"
                    value={lateFees}
                    onChange={(e) => setLateFees(Number(e.target.value))}
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* Payment Method */}
                <div className="w-48">
                  <label className="block text-gray-700 font-medium mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="border p-2 rounded w-full"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Net Banking">Net Banking</option>
                  </select>
                </div>
              </div>



              <table className="w-full border-collapse bg-white shadow-md mt-4">
                <thead>
                  <tr className="bg-orange-100 text-gray-800">
                    <th className="border p-2 text-left">Description</th>
                    <th className="border p-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Bus Fee ({months} months)</td>
                    <td className="border p-2 text-right">{studentDetails.busFee * months}</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Late Fees</td>
                    <td className="border p-2 text-right">{lateFees}</td>
                  </tr>
                  <tr className="bg-orange-100 text-gray-800 font-bold">
                    <td className="border p-2">Grand Total</td>
                    <td className="border p-2 text-right">{grandTotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <button onClick={handleDownload} className="bg-orange-100 text-black px-6 py-3 rounded-lg flex items-center gap-2 hover:scale-105 transition-all duration-300 shadow-md"
              ><FaDownload />
 Download PDF</button>
              <button onClick={shareViaWhatsApp} className="bg-orange-100 text-black px-6 py-3 rounded-lg flex items-center gap-2 hover:scale-105 transition-all duration-300 shadow-md"
              > <FiSend />Whatsapp</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
