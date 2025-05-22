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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoiceId, setInvoiceId] = useState(null);
  
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

      fetchLastPaidMonth(student.id, student.contact_number);

    }
  };

console.log("Student Details:", studentDetails);
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

  const fetchLastPaidMonth = async (studentId, mobile) => {
    try {
      const response = await fetch(
        `${config.apiUrl}/get-invoice/?id=${studentId}&mobile_no=${mobile}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("Last Paid Month Data:", data);
  
      if (data?.next_date) {
        const lastPaid = new Date(data.next_date); // e.g., "2024-01"
        console.log("Last Paid Month:", lastPaid);
        lastPaid.setMonth(lastPaid.getMonth() + 1);
        const nextMonth = lastPaid.toISOString().slice(0, 7); // format "YYYY-MM"
        setStartMonth(nextMonth);
      }
    } catch (error) {
      console.error("Error fetching last paid month:", error);
    }
  };
  


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

  // helpers to turn "YYYY-MM" into "YYYY-MM-DD"
const formatStartDate = (ym) => `${ym}-01`;
const formatEndDate = (ym) => {
  const [year, month] = ym.split("-").map(Number);
  // last day of month:
  const lastDay = new Date(year, month, 0).getDate();
  return `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
};

  const handleGenerateInvoice = async () => {
    if (!selectedStudent || !startMonth || !endMonth) {
      alert("Please select a student and set month range.");
      return;
    }
  
    const payload = {
      name: studentDetails.name,
      father_name: studentDetails.fatherName,
      mobile: studentDetails.contact,
      route: studentDetails.routeName,
      driver: studentDetails.driverName,
      start_month: formatStartDate(startMonth),
      end_month: formatEndDate(endMonth),
      months,
      late_fee: lateFees,
      payment_method: paymentMethod,
      grand_total: grandTotal.toFixed(2),
      bus_fee: studentDetails.busFee,
    };
  
    try {
      // 1. POST Invoice Data
      const postRes = await fetch(`${config.apiUrl}/invoices/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const postData = await postRes.json();
  
      if (!postRes.ok) {
        throw new Error(postData.message || "Failed to generate invoice.");
      }
  
      const generatedInvoiceId = postData.invoice_id; 
      setInvoiceId(generatedInvoiceId);
  
      // 2. GET PDF for Download
      const pdfRes = await fetch(`${config.apiUrl}/invoices/?d=${generatedInvoiceId}`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      });
  
      const blob = await pdfRes.blob();
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice_${generatedInvoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      // 3. Show WhatsApp Modal
      setIsModalOpen(true);
  
    } catch (error) {
      console.error("Invoice generation failed:", error);
      alert("Failed to generate invoice. Please try again.");
    }
  };
  
  const handleWhatsAppShare = () => {
    const message = `📜 *CAPITAL BUS SERVICE*\n*Invoice*\n------------------\n👨‍🎓 *Student:* ${studentDetails.name}
  👪 *Parent:* ${studentDetails.fatherName}
  📞 *Mobile:* ${studentDetails.contact}
  🚌 *Route:* ${studentDetails.routeName}
  👷 *Driver:* ${studentDetails.driverName}
  📅 *Duration:* ${startMonth} to ${endMonth}
  💰 *Fees:* ₹${(studentDetails.busFee * months).toFixed(2)}
  ⚠️ *Late Fees:* ₹${lateFees}
  💵 *Grand Total:* ₹${grandTotal.toFixed(2)}
  💳 *Payment Mode:* ${paymentMethod}
  *Thanks For Choosing Us!!*`;
  
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
                  <input type="month" value={startMonth} readOnly onChange={(e) => setStartMonth(e.target.value)} className="border p-2 rounded w-full" />
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
                {/* <div className="w-32">
                  <label className="block text-gray-700 font-medium mb-1">Late Fees</label>
                  <input
                    type="number"
                    value={lateFees}
                    onChange={(e) => setLateFees(Number(e.target.value))}
                    className="border p-2 rounded w-full"
                  />
                </div> */}

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
            <div className="flex gap-4 mt-6 items-center justify-center">
  <button
    onClick={handleGenerateInvoice}
    className="bg-orange-100 text-black  px-4 py-2 font-semibold rounded hover:bg-orange-300 flex items-center gap-2"
  >
    <FiSend/>
    Generate Invoice
  </button>
</div>

          </div>
          {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
      <h3 className="text-lg font-bold mb-4">Invoice Generated</h3>
      <p className="mb-6">You can now share the invoice via WhatsApp.</p>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={handleWhatsAppShare}
      >
        Share on WhatsApp
      </button>
    </div>
  </div>
)}

        </div>
      </div>
    </div>
  );
};

export default Invoice;
