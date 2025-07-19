import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import config from "../Config";

const Fee = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  const fetchStudents = async () => {
    if (!token) return null;

    try {
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
        return data;
      } else {
        console.error("Failed to fetch students");
        return null;
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      return null;
    }
  };

  const fetchInvoiceData = async () => {
    if (!token) return null;

    try {
      const response = await fetch(`${config.apiUrl}/invoice-paid-due/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Failed to fetch invoice data");
        return null;
      }
    } catch (error) {
      console.error("Error fetching invoice data:", error);
      return null;
    }
  };

  // Extract month and year from period string
  const extractMonthYear = (period) => {
    const parts = period.split('–');
    if (parts.length === 2) {
      return parts[0].trim(); // Return the left part (start month-year)
    }
    return period;
  };

  // Process invoice data to get paid and due information
  const processFeeData = (studentsData, invoiceData) => {
    if (!invoiceData || invoiceData.length === 0) {
      return studentsData.map((student) => ({
        student: student.name,
        studentId: student.id,
        phoneNumber: student.phone_number,
        fatherName: student.fathers_name,
        monthPaid: "-",
        amountPaid: "-",
        monthDues: "-",
        amountDues: "-",
        status: "Unknown",
      }));
    }

    // Process actual API data
    return invoiceData.map((student) => {
      // Format the paid periods
      const paidPeriods = student.invoice_periods || [];
      let monthPaid = "-";
      
      if (paidPeriods.length > 0) {
        const firstPeriod = extractMonthYear(paidPeriods[0]);
        const lastPeriod = extractMonthYear(paidPeriods[paidPeriods.length - 1]);
        
        if (firstPeriod === lastPeriod) {
          monthPaid = firstPeriod;
        } else {
          monthPaid = `${firstPeriod} - ${lastPeriod}`;
        }
      }
      
      // Format the due periods similarly
      const duePeriods = student.due_periods || [];
      let monthDues = "-";
      
      if (duePeriods.length > 0) {
        const firstDuePeriod = extractMonthYear(duePeriods[0]);
        const lastDuePeriod = extractMonthYear(duePeriods[duePeriods.length - 1]);
        
        if (firstDuePeriod === lastDuePeriod) {
          monthDues = firstDuePeriod;
        } else {
          monthDues = `${firstDuePeriod} - ${lastDuePeriod}`;
        }
      }
      
      // Use total_paid directly from the API response
      const amountPaid = student.total_paid ? `Rs. ${student.total_paid}` : "-";
      const amountDues = student.due_amount ? `Rs. ${student.due_amount}` : "-";
      
      return {
        student: student.name,
        studentId: student.id || student.mobile,
        phoneNumber: student.mobile,
        fatherName: student.father_name,
        monthPaid,
        amountPaid,
        monthDues,
        amountDues,
        status: student.due_amount > 0 ? "Due" : "Paid",
        monthsPaid: student.months_paid,
        totalPaid: student.total_paid,
        invoicePeriods: student.invoice_periods || [],
        duePeriods: student.due_periods || [],
        dueMonths: student.due_months
      };
    });
  };

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const [studentsData, invoiceData] = await Promise.all([
        fetchStudents(),
        fetchInvoiceData()
      ]);

      if (studentsData) {
        const processedData = processFeeData(studentsData, invoiceData);
        setFeeData(processedData);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [token]);

  // Function to handle row click and open modal
  const handleRowClick = (studentId, phoneNumber) => {
    let student = null;
    
    if (studentId && studentId !== phoneNumber) {
      student = students.find((s) => s.id === studentId);
    }
    
    if (!student && phoneNumber) {
      student = students.find((s) => s.phone_number === phoneNumber);
    }
    
    if (!student) {
      const feeStudent = feeData.find((s) => s.studentId === studentId || s.phoneNumber === phoneNumber);
      if (feeStudent) {
        student = students.find((s) => 
          s.name === feeStudent.student && 
          s.fathers_name === feeStudent.fatherName
        );
      }
    }

    if (student) {
      const feeStudent = feeData.find((s) => 
        s.phoneNumber === phoneNumber || 
        s.studentId === studentId ||
        (s.student === student.name && s.fatherName === student.fathers_name)
      );

      setStudentDetails({
        ...student,
        monthsPaid: feeStudent?.monthsPaid,
        totalPaid: feeStudent?.totalPaid,
        dueAmount: feeStudent?.amountDues,
        dueMonths: feeStudent?.dueMonths,
        invoicePeriods: feeStudent?.invoicePeriods || [],
        duePeriods: feeStudent?.duePeriods || []
      });
      setShowModal(true);
    } else {
      console.error("Student not found in students data. ID:", studentId, "Phone:", phoneNumber);
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
                        <th className="border p-2 md:p-3 text-left">Father's Name</th>
                        <th className="border p-2 md:p-3 text-left">Month Paid</th>
                        <th className="border p-2 md:p-3 text-left">Amount Paid</th>
                        <th className="border p-2 md:p-3 text-left">Month Dues</th>
                        <th className="border p-2 md:p-3 text-left">Amount Dues</th>
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
                          onClick={() => handleRowClick(fee.studentId, fee.phoneNumber)}
                        >
                          <td className="border p-2 md:p-3">{fee.student}</td>
                          <td className="border p-2 md:p-3">{fee.fatherName}</td>
                          <td className="border p-2 md:p-3">{fee.monthPaid}</td>
                          <td className="border p-2 md:p-3 font-bold">{fee.amountPaid}</td>
                          <td className="border p-2 md:p-3">{fee.monthDues}</td>
                          <td className="border p-2 md:p-3 font-bold">{fee.amountDues}</td>
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
                      Monthly Amount:
                    </p>
                    <p className="font-normal text-sm md:text-base">
                      Rs. {studentDetails.driver?.route?.amount || "-"}
                    </p>
                  </div>
                </div>

                {/* Additional Fee Details Section */}
                <div className="mt-4 border-t pt-4">
                  <h3 className="font-bold text-lg mb-2">Fee Details</h3>
                  <div className="grid grid-cols-2 gap-2 md:gap-4">
                    {/* Paid Information */}
                    <div className="col-span-2 bg-green-50 p-3 rounded-lg">
                      <h4 className="font-bold text-green-700 mb-2">Paid Information</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="font-bold text-gray-700 text-sm md:text-base">
                            Total Paid:
                          </p>
                          <p className="font-normal text-sm md:text-base">
                            Rs. {studentDetails.totalPaid || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="font-bold text-gray-700 text-sm md:text-base">
                            Months Paid:
                          </p>
                          <p className="font-normal text-sm md:text-base">
                            {studentDetails.monthsPaid || "-"}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="font-bold text-gray-700 text-sm md:text-base">
                            Paid Periods:
                          </p>
                          <div className="max-h-40 overflow-y-auto border rounded p-2 bg-white">
                            {studentDetails.invoicePeriods && studentDetails.invoicePeriods.length > 0 ? (
                              <ul className="list-disc pl-5">
                                {studentDetails.invoicePeriods.map((period, index) => (
                                  <li key={index} className="text-sm md:text-base">
                                    {period}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm md:text-base">-</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Due Information */}
                    <div className="col-span-2 bg-red-50 p-3 rounded-lg mt-2">
                      <h4 className="font-bold text-red-700 mb-2">Due Information</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="font-bold text-gray-700 text-sm md:text-base">
                            Due Amount:
                          </p>
                          <p className="font-normal text-sm md:text-base">
                            {studentDetails.dueAmount || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="font-bold text-gray-700 text-sm md:text-base">
                            Due Months:
                          </p>
                          <p className="font-normal text-sm md:text-base">
                            {studentDetails.dueMonths || "-"}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="font-bold text-gray-700 text-sm md:text-base">
                            Due Periods:
                          </p>
                          <div className="max-h-40 overflow-y-auto border rounded p-2 bg-white">
                            {studentDetails.duePeriods && studentDetails.duePeriods.length > 0 ? (
                              <ul className="list-disc pl-5">
                                {studentDetails.duePeriods.map((period, index) => (
                                  <li key={index} className="text-sm md:text-base">
                                    {period}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm md:text-base">No due periods</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
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