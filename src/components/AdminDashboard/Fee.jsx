import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import config from "../Config";

const Fee = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feeData, setFeeData] = useState([]);

  // Get token from localStorage
  const S = JSON.parse(localStorage.getItem("user"));
  const token = S?.data?.token;

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      if (!token) return;

      setLoading(true);
      try {
        // Fetch Students from API
        const studentsResponse = await fetch(`${config.apiUrl}/students/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (studentsResponse.ok) {
          const data = await studentsResponse.json();
          setStudents(data);

          // Create fee data from student data
          const initialFeeData = data.map((student, index) => {
            // These are example fees, in a real app you would likely fetch this from an API
            const mockMonths = [
              { from: "Dec", to: "Feb" },
              { from: "Jan", to: "Mar" },
              { from: "Feb", to: "Apr" },
              { from: "Jan", to: "Mar" },
            ];

            // Setting one of the students to have "Due" status
            // Specifically the second student (index 1)
            const status = index === 1 ? "Due" : "Paid";
            const months = mockMonths[index % mockMonths.length];

            return {
              student: student.name,
              studentId: student.id,
              from: months.from,
              to: months.to,
              amount: `Rs. ${student.driver?.route?.amount || "500"}`,
              datePaid: status === "Paid" ? `0${(index % 3) + 1}-01-25` : "-",
              paymentMethod:
                status === "Paid" ? ["UPI", "Card", "Cash"][index % 3] : "-",
              status: status,
            };
          });

          setFeeData(initialFeeData);
        } else {
          console.error("Failed to fetch students");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [token]);

  // Function to handle row click and open modal
  const handleRowClick = (studentId) => {
    // Find student details from API data using studentId
    const student = students.find((s) => s.id === studentId);

    if (student) {
      setStudentDetails(student);
      setShowModal(true);
    } else {
      console.error("Student not found");
    }
  };

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
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
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
                        onClick={() => handleRowClick(fee.studentId)}
                      >
                        <td className="border p-3 text-center">
                          {fee.student}
                        </td>
                        <td className="border p-3 text-center">{fee.from}</td>
                        <td className="border p-3 text-center">{fee.to}</td>
                        <td className="border p-3 font-bold text-center">
                          {fee.amount}
                        </td>
                        <td className="border p-3 text-center">
                          {fee.datePaid}
                        </td>
                        <td className="border p-3 text-center">
                          {fee.paymentMethod}
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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Student Details Modal */}
      {showModal && studentDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-11/12 max-w-md overflow-hidden">
            <div className="bg-red-100 p-4 relative">
              <h2 className="text-2xl font-bold text-gray-800">
                Student Details
              </h2>
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="font-bold text-gray-700">
                    Name:{" "}
                    <span className="font-normal">{studentDetails.name}</span>
                  </p>
                </div>
                <div>
                  <p className="font-bold text-gray-700">
                    Father's Name:{" "}
                    <span className="font-normal">
                      {studentDetails.fathers_name}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="font-bold text-gray-700">
                    Class:{" "}
                    <span className="font-normal">
                      {studentDetails.student_class}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="font-bold text-gray-700">
                    Section:{" "}
                    <span className="font-normal">
                      {studentDetails.student_section}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="font-bold text-gray-700">
                    Phone:{" "}
                    <span className="font-normal">
                      {studentDetails.phone_number}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="font-bold text-gray-700">
                    Driver Name:{" "}
                    <span className="font-normal">
                      {studentDetails.driver?.name || "-"}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="font-bold text-gray-700">
                    Route:{" "}
                    <span className="font-normal">
                      {studentDetails.driver?.route?.name || "-"}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="font-bold text-gray-700">
                    Driver Contact:{" "}
                    <span className="font-normal">
                      {studentDetails.driver?.contact || "-"}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="font-bold text-gray-700">
                    Vehicle Number:{" "}
                    <span className="font-normal">
                      {studentDetails.driver?.vehicle_number || "-"}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="font-bold text-gray-700">
                    Emergency Contact:{" "}
                    <span className="font-normal">
                      {studentDetails.contact_number}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="font-bold text-gray-700">
                    Arrival Time:{" "}
                    <span className="font-normal">
                      {studentDetails.bus_arrival_time || "-"}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="font-bold text-gray-700">
                    Amount:{" "}
                    <span className="font-normal">
                      Rs. {studentDetails.driver?.route?.amount || "-"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fee;
