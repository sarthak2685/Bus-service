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
  <div className="flex flex-col md:flex-row flex-grow">
    <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
    <div
      className={`flex-grow transition-all ${
        isCollapsed ? "md:ml-0" : "md:ml-64"
      }`}
    >
      <Header toggleSidebar={toggleSidebar} />
      <div className="p-4 lg:p-6 max-w-5xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6 text-center border-b pb-3 md:pb-4">
            Fee Management
          </h2>

          {/* Unified Fee Table */}
          <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-gray-800">
            Student Fee Status
          </h3>
          {loading ? (
            <div className="text-center py-6 md:py-8">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 mb-4 md:mb-6 bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-[#FCE7C3] text-gray-800">
                    <th className="border p-2 md:p-3 text-left">Student</th>
                    <th className="border p-2 md:p-3 text-left hidden sm:table-cell">From</th>
                    <th className="border p-2 md:p-3 text-left hidden sm:table-cell">To</th>
                    <th className="border p-2 md:p-3 text-left">Amount</th>
                    <th className="border p-2 md:p-3 text-left hidden md:table-cell">Date Paid</th>
                    <th className="border p-2 md:p-3 text-left hidden lg:table-cell">Payment Method</th>
                    <th className="border p-2 md:p-3 text-left">Status</th>
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
                      <td className="border p-2 md:p-3">{fee.student}</td>
                      <td className="border p-2 md:p-3 hidden sm:table-cell">{fee.from}</td>
                      <td className="border p-2 md:p-3 hidden sm:table-cell">{fee.to}</td>
                      <td className="border p-2 md:p-3 font-bold">Rs. {fee.amount}</td>
                      <td className="border p-2 md:p-3 hidden md:table-cell">{fee.datePaid}</td>
                      <td className="border p-2 md:p-3 hidden lg:table-cell">{fee.paymentMethod}</td>
                      <td
                        className={`border p-2 md:p-3 font-medium ${
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
          )}
        </div>
      </div>
    </div>
  </div>

  {/* Student Details Modal */}
  {showModal && studentDetails && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="bg-red-100 p-4 relative">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Student Details
          </h2>
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            onClick={() => setShowModal(false)}
          >
            ✕
          </button>
        </div>

        <div className="p-4 md:p-6">
          <div className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              <div>
                <p className="font-bold text-gray-700 text-sm md:text-base">
                  Name:
                </p>
                <p className="font-normal text-sm md:text-base">{studentDetails.name}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-sm md:text-base">
                  Father's Name:
                </p>
                <p className="font-normal text-sm md:text-base">{studentDetails.fathers_name}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-sm md:text-base">
                  Class:
                </p>
                <p className="font-normal text-sm md:text-base">{studentDetails.student_class}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-sm md:text-base">
                  Section:
                </p>
                <p className="font-normal text-sm md:text-base">{studentDetails.student_section}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-sm md:text-base">
                  Phone:
                </p>
                <p className="font-normal text-sm md:text-base">{studentDetails.phone_number}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-sm md:text-base">
                  Driver Name:
                </p>
                <p className="font-normal text-sm md:text-base">{studentDetails.driver?.name || "-"}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-sm md:text-base">
                  Route:
                </p>
                <p className="font-normal text-sm md:text-base">{studentDetails.driver?.route?.name || "-"}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-sm md:text-base">
                  Driver Contact:
                </p>
                <p className="font-normal text-sm md:text-base">{studentDetails.driver?.contact || "-"}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-sm md:text-base">
                  Vehicle Number:
                </p>
                <p className="font-normal text-sm md:text-base">{studentDetails.driver?.vehicle_number || "-"}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-sm md:text-base">
                  Emergency Contact:
                </p>
                <p className="font-normal text-sm md:text-base">{studentDetails.contact_number}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-sm md:text-base">
                  Arrival Time:
                </p>
                <p className="font-normal text-sm md:text-base">{studentDetails.bus_arrival_time || "-"}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-sm md:text-base">
                  Amount:
                </p>
                <p className="font-normal text-sm md:text-base">
                  Rs. {studentDetails.driver?.route?.amount || "-"}
                </p>
              </div>
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
