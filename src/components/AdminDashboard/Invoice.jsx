import React, { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { useReactToPrint } from "react-to-print";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Invoice = () => {
  const [student, setStudent] = useState({
    name: "",
    Class: "",
    parentName: "",
    mobile: "",
    Route: "",
    DriverName: "",
  });

  const [services, setServices] = useState([
    { name: "", quantity: 1, price: 0 },
  ]);

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const invoiceRef = useRef();
  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Handle Student Input
  const handleStudentChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  // Handle Service Input
  const handleServiceChange = (index, field, value) => {
    const newServices = [...services];
    newServices[index][field] = field === "quantity" || field === "price" ? Number(value) : value;
    setServices(newServices);
  };

  // Add/Remove Service Rows
  const addService = () => setServices([...services, { name: "", quantity: 1, price: 0 }]);
  const removeService = (index) => setServices(services.filter((_, i) => i !== index));

  // Calculate Totals
  const subtotal = services.reduce((acc, service) => acc + service.price * service.quantity, 0);
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + tax;

  // Download as PDF
  const downloadInvoice = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: "Student_Invoice",
  });

  // Share via WhatsApp
  const shareViaWhatsApp = () => {
    const message = `Student Invoice\n------------------\nStudent: ${student.name}\nParent: ${student.parentName}\nRoute: ${student.Route}\nDriverName: ${student.DriverName}\nTotal: ₹${grandTotal.toFixed(2)}\nPayment Mode: ${paymentMethod}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/91${student.mobile}?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <>
     <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-row flex-grow">
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        <div
          className={`flex-grow transition-all ${
            isCollapsed ? "ml-0" : "ml-64"
          }`}
        >
          <Header toggleSidebar={toggleSidebar} />
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Bus Service Invoice</h2>

      {/* Student Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={student.name}
          onChange={handleStudentChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="class"
          placeholder="Student Class"
          value={student.Class}
          onChange={handleStudentChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="parentName"
          placeholder="Parent Name"
          value={student.parentName}
          onChange={handleStudentChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="mobile"
          placeholder="Parent Mobile (10-digit)"
          maxLength="10"
          value={student.mobile}
          onChange={handleStudentChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="DriverName"
          placeholder="Driver Name "
          value={student.DriverName}
          onChange={handleStudentChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="Route"
          placeholder="Route "
          value={student.Route}
          onChange={handleStudentChange}
          className="border p-2 rounded w-full"
        />
        
      </div>

      {/* Service Details */}
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Services</h3>
      <table className="w-full border mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Service</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service, index) => (
            <tr key={index}>
              <td className="border p-2">
                <input type="text" value={service.name} onChange={(e) => handleServiceChange(index, "name", e.target.value)} className="border p-1 w-full" />
              </td>
              <td className="border p-2">
                <input type="number" value={service.quantity} onChange={(e) => handleServiceChange(index, "quantity", e.target.value)} className="border p-1 w-full" />
              </td>
              <td className="border p-2">
                <input type="number" value={service.price} onChange={(e) => handleServiceChange(index, "price", e.target.value)} className="border p-1 w-full" />
              </td>
              <td className="border p-2">₹{(service.quantity * service.price).toFixed(2)}</td>
              <td className="border p-2">
                {services.length > 1 && <button onClick={() => removeService(index)} className="bg-red-500 text-white px-2 py-1 rounded">❌</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addService} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">➕ Add Service</button>

      {/* Payment Method */}
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Method</h3>
      <select className="border p-2 rounded w-full" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
        <option>Cash</option>
        <option>UPI</option>
        <option>Credit Card</option>
        <option>Net Banking</option>
      </select>

      {/* Invoice Preview */}
      <div ref={invoiceRef} className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Invoice Preview</h3>
        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p>Tax (5%): ₹{tax.toFixed(2)}</p>
        <p className="font-bold">Grand Total: ₹{grandTotal.toFixed(2)}</p>
        <p>Payment Mode: {paymentMethod}</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button onClick={downloadInvoice} className="bg-green-500 text-white px-4 py-2 rounded">📄 Download PDF</button>
        <button onClick={shareViaWhatsApp} className="bg-blue-500 text-white px-4 py-2 rounded">📲 Share via WhatsApp</button>
      </div>
    </div>
    </div>
    </div>
    </div>
    </>
  );
};

export default Invoice;
