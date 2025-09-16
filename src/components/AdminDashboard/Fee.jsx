import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import config from "../Config";
import * as XLSX from 'xlsx';

const Fee = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feeData, setFeeData] = useState([]);
  const [filteredFeeData, setFilteredFeeData] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
        
        // Extract unique routes from students data
        const uniqueRoutes = [...new Set(
          data
            .filter(student => student.driver?.route?.name)
            .map(student => student.driver.route.name)
        )].sort();
        setRoutes(uniqueRoutes);
        
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
        route: student.driver?.route?.name || "No Route",
        routeId: student.driver?.route?.id || null,
      }));
    }

    // Process actual API data
    return invoiceData.map((student) => {
      // Find the corresponding student from studentsData to get route info
      const studentInfo = studentsData.find(s => 
        s.id === student.id || 
        s.phone_number === student.mobile ||
        (s.name === student.name && s.fathers_name === student.father_name)
      );

      // Format the paid periods
      const paidPeriods = student.invoice_periods || [];
      let monthPaid = "-";
      
      if (paidPeriods.length > 0) {
        if (paidPeriods.length === 1) {
          // If there's only one period, display it as-is
          monthPaid = paidPeriods[0];
        } else {
          // For multiple periods, create a range
          const firstPeriod = extractMonthYear(paidPeriods[0]);
          const lastPeriod = extractMonthYear(paidPeriods[paidPeriods.length - 1]);
          monthPaid = `${firstPeriod} – ${lastPeriod}`;
        }
      }
      
      // Format the due periods similarly
      const duePeriods = student.due_periods || [];
      let monthDues = "-";
      
      if (duePeriods.length > 0) {
        if (duePeriods.length === 1) {
          // If only one period exists, display it exactly as it is
          monthDues = duePeriods[0];
        } else {
          // For multiple periods, extract and combine first and last
          const firstDuePeriod = extractMonthYear(duePeriods[0]);
          const lastDuePeriod = extractMonthYear(duePeriods[duePeriods.length - 1]);
          
          if (firstDuePeriod === lastDuePeriod) {
            monthDues = firstDuePeriod;
          } else {
            monthDues = `${firstDuePeriod} – ${lastDuePeriod}`; // Using en dash (–) for consistency
          }
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
        dueMonths: student.due_months,
        route: studentInfo?.driver?.route?.name || "No Route",
        routeId: studentInfo?.driver?.route?.id || null,
      };
    });
  };

  // Filter fee data based on selected route and search term
  const filterFeeData = () => {
    let filtered = [...feeData];

    // Filter by route
    if (selectedRoute !== 'all') {
      filtered = filtered.filter(fee => fee.route === selectedRoute);
    }

    // Filter by search term (student name or father's name)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(fee => 
        fee.student.toLowerCase().includes(searchLower) ||
        fee.fatherName.toLowerCase().includes(searchLower) ||
        fee.phoneNumber.includes(searchTerm)
      );
    }

    setFilteredFeeData(filtered);
  };

  // Apply filters whenever feeData, selectedRoute, or searchTerm changes
  useEffect(() => {
    filterFeeData();
  }, [feeData, selectedRoute, searchTerm]);

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

  // Reset filters
  const resetFilters = () => {
    setSelectedRoute('all');
    setSearchTerm('');
  };

  // Get statistics for current filtered data
  const getStatistics = () => {
    const totalStudents = filteredFeeData.length;
    const paidStudents = filteredFeeData.filter(fee => fee.status === "Paid").length;
    const dueStudents = filteredFeeData.filter(fee => fee.status === "Due").length;
    const totalPaidAmount = filteredFeeData.reduce((sum, fee) => {
      const amount = fee.amountPaid.replace('Rs. ', '').replace('-', '0');
      return sum + (parseFloat(amount) || 0);
    }, 0);
    const totalDueAmount = filteredFeeData.reduce((sum, fee) => {
      const amount = fee.amountDues.replace('Rs. ', '').replace('-', '0');
      return sum + (parseFloat(amount) || 0);
    }, 0);

    return {
      totalStudents,
      paidStudents,
      dueStudents,
      totalPaidAmount,
      totalDueAmount
    };
  };

  const stats = getStatistics();

  // Excel Export Function
  const exportToExcel = () => {
    // Prepare data for Excel export
    const excelData = filteredFeeData.map((fee, index) => ({
      'S.No.': index + 1,
      'Student Name': fee.student,
      "Father's Name": fee.fatherName,
      'Phone Number': fee.phoneNumber,
      'Route': fee.route,
      'Month Paid': fee.monthPaid,
      'Amount Paid': fee.amountPaid,
      'Month Dues': fee.monthDues,
      'Amount Due': fee.amountDues,
      'Status': fee.status
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const columnWidths = [
      { wch: 8 },  // S.No.
      { wch: 20 }, // Student Name
      { wch: 20 }, // Father's Name
      { wch: 15 }, // Phone Number
      { wch: 15 }, // Route
      { wch: 20 }, // Month Paid
      { wch: 15 }, // Amount Paid
      { wch: 20 }, // Month Dues
      { wch: 15 }, // Amount Due
      { wch: 10 }  // Status
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fee Report');

    // Generate filename with current date and filters
    let filename = 'Fee_Report';
    if (selectedRoute !== 'all') {
      filename += `_${selectedRoute.replace(/\s+/g, '_')}`;
    }
    if (searchTerm) {
      filename += `_Search_${searchTerm.replace(/\s+/g, '_')}`;
    }
    filename += `_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Save file
    XLSX.writeFile(workbook, filename);
  };

  // Export detailed Excel with additional information
  const exportDetailedExcel = () => {
    // Create summary sheet data
    const summaryData = [
      { 'Metric': 'Total Students', 'Value': stats.totalStudents },
      { 'Metric': 'Students with Paid Fees', 'Value': stats.paidStudents },
      { 'Metric': 'Students with Due Fees', 'Value': stats.dueStudents },
      { 'Metric': 'Total Amount Paid', 'Value': `Rs. ${stats.totalPaidAmount}` },
      { 'Metric': 'Total Amount Due', 'Value': `Rs. ${stats.totalDueAmount}` },
      { 'Metric': 'Report Generated On', 'Value': new Date().toLocaleString() },
      { 'Metric': 'Selected Route Filter', 'Value': selectedRoute === 'all' ? 'All Routes' : selectedRoute },
      { 'Metric': 'Search Filter Applied', 'Value': searchTerm || 'None' }
    ];

    // Create detailed student data
    const detailedData = filteredFeeData.map((fee, index) => {
      const student = students.find(s => 
        s.id === fee.studentId || 
        s.phone_number === fee.phoneNumber ||
        (s.name === fee.student && s.fathers_name === fee.fatherName)
      );

      return {
        'S.No.': index + 1,
        'Student Name': fee.student,
        "Father's Name": fee.fatherName,
        'Phone Number': fee.phoneNumber,
        'Emergency Contact': student?.contact_number || '-',
        'Class': student?.student_class || '-',
        'Section': student?.student_section || '-',
        'Route': fee.route,
        'Driver Name': student?.driver?.name || '-',
        'Driver Contact': student?.driver?.contact || '-',
        'Vehicle Number': student?.driver?.vehicle_number || '-',
        'Monthly Amount': student?.driver?.route?.amount ? `Rs. ${student.driver.route.amount}` : '-',
        'Bus Arrival Time': student?.bus_arrival_time || '-',
        'Months Paid': fee.monthsPaid || '-',
        'Month Paid Range': fee.monthPaid,
        'Total Amount Paid': fee.amountPaid,
        'Due Months': fee.dueMonths || '-',
        'Month Due Range': fee.monthDues,
        'Total Amount Due': fee.amountDues,
        'Payment Status': fee.status,
        'Paid Periods': fee.invoicePeriods?.join(', ') || '-',
        'Due Periods': fee.duePeriods?.join(', ') || '-'
      };
    });

    // Create route-wise summary
    const routeWiseData = {};
    filteredFeeData.forEach(fee => {
      if (!routeWiseData[fee.route]) {
        routeWiseData[fee.route] = {
          totalStudents: 0,
          paidStudents: 0,
          dueStudents: 0,
          totalPaid: 0,
          totalDue: 0
        };
      }
      
      routeWiseData[fee.route].totalStudents++;
      if (fee.status === 'Paid') routeWiseData[fee.route].paidStudents++;
      if (fee.status === 'Due') routeWiseData[fee.route].dueStudents++;
      
      const paidAmount = parseFloat(fee.amountPaid.replace('Rs. ', '').replace('-', '0')) || 0;
      const dueAmount = parseFloat(fee.amountDues.replace('Rs. ', '').replace('-', '0')) || 0;
      
      routeWiseData[fee.route].totalPaid += paidAmount;
      routeWiseData[fee.route].totalDue += dueAmount;
    });

    const routeSummary = Object.entries(routeWiseData).map(([route, data]) => ({
      'Route': route,
      'Total Students': data.totalStudents,
      'Paid Students': data.paidStudents,
      'Due Students': data.dueStudents,
      'Total Paid Amount': `Rs. ${data.totalPaid}`,
      'Total Due Amount': `Rs. ${data.totalDue}`,
      'Collection Rate': `${((data.paidStudents / data.totalStudents) * 100).toFixed(1)}%`
    }));

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Add summary sheet
    const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
    summaryWorksheet['!cols'] = [{ wch: 25 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');

    // Add detailed data sheet
    const detailedWorksheet = XLSX.utils.json_to_sheet(detailedData);
    const detailedColumnWidths = [
      { wch: 8 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, 
      { wch: 10 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, 
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 20 }, 
      { wch: 15 }, { wch: 12 }, { wch: 20 }, { wch: 15 }, { wch: 12 }, 
      { wch: 30 }, { wch: 30 }
    ];
    detailedWorksheet['!cols'] = detailedColumnWidths;
    XLSX.utils.book_append_sheet(workbook, detailedWorksheet, 'Detailed Report');

    // Add route-wise summary sheet
    const routeWorksheet = XLSX.utils.json_to_sheet(routeSummary);
    routeWorksheet['!cols'] = [
      { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, 
      { wch: 18 }, { wch: 18 }, { wch: 15 }
    ];
    XLSX.utils.book_append_sheet(workbook, routeWorksheet, 'Route Summary');

    // Generate filename
    let filename = 'Detailed_Fee_Report';
    if (selectedRoute !== 'all') {
      filename += `_${selectedRoute.replace(/\s+/g, '_')}`;
    }
    if (searchTerm) {
      filename += `_Search_${searchTerm.replace(/\s+/g, '_')}`;
    }
    filename += `_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Save file
    XLSX.writeFile(workbook, filename);
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
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            <div className="bg-white shadow-lg rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6 text-center border-b pb-3 md:pb-4">
                Fee Management
              </h2>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-blue-100 p-4 rounded-lg text-center">
                  <h4 className="font-bold text-blue-700">Total Students</h4>
                  <p className="text-2xl font-bold text-blue-800">{stats.totalStudents}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg text-center">
                  <h4 className="font-bold text-green-700">Paid</h4>
                  <p className="text-2xl font-bold text-green-800">{stats.paidStudents}</p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg text-center">
                  <h4 className="font-bold text-red-700">Due</h4>
                  <p className="text-2xl font-bold text-red-800">{stats.dueStudents}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <h4 className="font-bold text-green-600">Total Paid</h4>
                  <p className="text-lg font-bold text-green-700">Rs. {stats.totalPaidAmount}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <h4 className="font-bold text-red-600">Total Due</h4>
                  <p className="text-lg font-bold text-red-700">Rs. {stats.totalDueAmount}</p>
                </div>
              </div>

              {/* Filters Section */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-bold mb-3 text-gray-800">Filters</h3>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                  {/* Route Filter */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Filter by Route
                    </label>
                    <select
                      value={selectedRoute}
                      onChange={(e) => setSelectedRoute(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Routes</option>
                      {routes.map((route) => (
                        <option key={route} value={route}>
                          {route}
                        </option>
                      ))}
                      <option value="No Route">No Route Assigned</option>
                    </select>
                  </div>

                  {/* Search Filter */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Search Student
                    </label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name, father's name, or phone..."
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Reset Button */}
                  <div>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>

                  {/* Export Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={exportToExcel}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                      disabled={filteredFeeData.length === 0}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export Basic
                    </button>
                    <button
                      onClick={exportDetailedExcel}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                      disabled={filteredFeeData.length === 0}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a4 4 0 01-4-4V5a4 4 0 014-4h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a4 4 0 01-4 4z" />
                      </svg>
                      Export Detailed
                    </button>
                  </div>
                </div>

                {/* Active Filters Display */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedRoute !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Route: {selectedRoute}
                      <button
                        onClick={() => setSelectedRoute('all')}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {searchTerm && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Search: {searchTerm}
                      <button
                        onClick={() => setSearchTerm('')}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-gray-800">
                Student Fee Status
                {filteredFeeData.length !== feeData.length && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    (Showing {filteredFeeData.length} of {feeData.length} students)
                  </span>
                )}
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
                        <th className="border p-2 md:p-3 text-left">Route</th>
                        <th className="border p-2 md:p-3 text-left">Month Paid</th>
                        <th className="border p-2 md:p-3 text-left">Amount Paid</th>
                        <th className="border p-2 md:p-3 text-left">Month Dues</th>
                        <th className="border p-2 md:p-3 text-left">Amount Dues</th>
                        <th className="border p-2 md:p-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFeeData.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="border p-4 text-center text-gray-500">
                            No students found matching your criteria
                          </td>
                        </tr>
                      ) : (
                        filteredFeeData.map((fee, index) => (
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
                            <td className="border p-2 md:p-3">
                              <span className={`px-2 py-1 rounded text-xs ${
                                fee.route === "No Route" 
                                  ? "bg-gray-100 text-gray-600"
                                  : "bg-blue-100 text-blue-700"
                              }`}>
                                {fee.route}
                              </span>
                            </td>
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
                        ))
                      )}
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