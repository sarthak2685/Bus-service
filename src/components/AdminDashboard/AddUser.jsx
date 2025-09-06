import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiPhone,
  FiBookOpen,
  FiMapPin,
  FiUsers,
  FiSmartphone,
  FiSend,
  FiX,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiTruck,
  FiTrash2,
  FiClock,
  FiDollarSign,
  FiCalendar,
} from "react-icons/fi";
import Header from "./Header";
import Sidebar from "./Sidebar";
import config from "../Config";

const AddUser = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;
  const toggleSidebar = () => setIsCollapsed((prev) => !prev);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [driverContact, setDriverContact] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    student_class: "",
    student_section: "",
    phone_number: "",
    fathers_name: "",
    contact_number: "",
    bus_arrival_time: "",
    month: "", // New field for joining month
  });
  
  // State for month-year picker
  const [joiningMonth, setJoiningMonth] = useState("");

  // Fetch user token from local storage
  const S = JSON.parse(localStorage.getItem("user"));
  const token = S?.data?.token;

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [students, setStudents] = useState([]);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const displayedStudents = filteredStudents.slice(
    startIndex,
    startIndex + studentsPerPage
  );

  // Fetch students, drivers, and routes data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Students
        const studentsResponse = await fetch(`${config.apiUrl}/students/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Fetch Drivers
        const driversResponse = await fetch(`${config.apiUrl}/drivers/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Fetch Routes
        const routesResponse = await fetch(`${config.apiUrl}/route/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!studentsResponse.ok || !driversResponse.ok || !routesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const studentsData = await studentsResponse.json();
        const driversData = await driversResponse.json();
        const routesData = await routesResponse.json();

        // Transform student data to match the previous structure
        const transformedStudents = studentsData.map((student) => ({
          id: student.id,
          name: student.name,
          fatherName: student.fathers_name,
          class: student.student_class,
          section: student.student_section,
          phone: student.phone_number,
          emergency: student.contact_number,
          arrivalTime: student.bus_arrival_time,
          joiningMonth: student.month, // Add joining month to transformed data
          driverName: student.driver ? student.driver.name : "N/A",
          amount: student.driver.route.amount,
          route:
            student.driver && student.driver.route
              ? student.driver.route.name
              : "N/A",
          driverContact: student.driver ? student.driver.contact : "N/A",
          vehicleNumber: student.driver ? student.driver.vehicle_number : "N/A",
        }));

        setStudents(transformedStudents);
        setDrivers(driversData);
        setRoutes(routesData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const [routeAmount, setRouteAmount] = useState("");

  const handleDriverChange = (event) => {
    const driverName = event.target.value;
    const driver = drivers.find((d) => d.name === driverName);

    if (driver) {
      setSelectedDriver(driverName);
      setDriverContact(driver.contact || "");

      // Find and set route based on driver's assigned route
      const assignedRoute = routes.find(
        (route) => route.id === driver.route.id
      );
      setSelectedRoute(assignedRoute ? assignedRoute.id : "");

      // Set the route amount based on the assigned route
      setRouteAmount(assignedRoute ? assignedRoute.amount : "");

      setSelectedVehicle(driver.vehicle_number || "");

      // Send driver_id in the payload - add amount to payload
      const payload = {
        driver_id: driver.id,
        driver_name: driverName,
        contact: driver.contact || "",
        route_id: assignedRoute ? assignedRoute.id : "",
        route_amount: assignedRoute ? assignedRoute.amount : "",
        vehicle_number: driver.vehicle_number || "",
      };

      sendPayload(payload);
    } else {
      // Reset all fields if no driver is selected
      setSelectedDriver("");
      setDriverContact("");
      setSelectedRoute("");
      setSelectedVehicle("");
      setRouteAmount("");
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle joining month change
  const handleJoiningMonthChange = (e) => {
    const monthYear = e.target.value;
    setJoiningMonth(monthYear);
    
    // Convert to YYYY-MM-DD format (day is always 01)
    if (monthYear) {
      const [year, month] = monthYear.split('-');
      setFormData(prev => ({
        ...prev,
        month: `${year}-${month}-01`
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        month: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare complete form data with driver_id
    const submissionData = {
      ...formData,
      driver_id: drivers.find((d) => d.name === selectedDriver)?.id || null, // Extract driver_id
      selectedDriver,
      selectedRoute,
      driverContact,
      selectedVehicle,
      routeAmount,
    };

    try {
      // Make API call to submit student data
      const response = await fetch(`${config.apiUrl}/students/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();

      // Handle successful submission
      alert("Student registered successfully!");

      // Optional: Reset form after successful submission
      resetForm();
      fetchData();
    } catch (error) {
      // Handle submission error
      console.error("Error registering student:", error);
      alert("Failed to register student. Please try again.");
    }
  };

  // Reset form function
  const resetForm = () => {
    setFormData({
      name: "",
      student_class: "",
      student_section: "",
      phone_number: "",
      fathers_name: "",
      contact_number: "",
      bus_arrival_time: "",
      month: "",
    });
    setJoiningMonth("");
    setSelectedDriver("");
    setSelectedRoute("");
    setDriverContact("");
    setSelectedVehicle("");
    setRouteAmount("");
  };

  const openModal = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  // Delete student function
  const handleDeleteStudent = async (studentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${config.apiUrl}/students/${studentId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      // Refresh the page after deletion
      alert("Student deleted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row flex-grow">
        {/* Sidebar - Hidden on mobile by default */}
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        
        {/* Main Content Area */}
        <div
          className={`flex-grow transition-all ${
            isCollapsed ? "lg:ml-0" : "lg:ml-64"
          }`}
        >
          <Header toggleSidebar={toggleSidebar} />
          
          {/* Main Content Container */}
          <div className="p-4 md:p-6 max-w-4xl mx-auto">
            {/* Add Users Form Card */}
            <div className="bg-white shadow-lg rounded-xl md:rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 text-center border-b pb-3">
                Add Users
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Student Information Section */}
                <div className="bg-gray-100 p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 flex items-center">
                    <FiUsers className="mr-2 text-orange-500" /> 
                    <span className="text-sm md:text-base lg:text-xl">Student Information</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                    {[
                      {
                        name: "name",
                        label: "Name of Child",
                        placeholder: "Enter Name",
                        icon: <FiUser />,
                      },
                      {
                        name: "student_class",
                        label: "Class",
                        placeholder: "Enter Class",
                        icon: <FiBookOpen />,
                      },
                      {
                        name: "student_section",
                        label: "Section",
                        placeholder: "Enter Section",
                        icon: <FiMapPin />,
                      },
                      {
                        name: "phone_number",
                        label: "Phone Number",
                        placeholder: "Enter Phone Number",
                        icon: <FiPhone />,
                      },
                      {
                        name: "fathers_name",
                        label: "Father's Name",
                        placeholder: "Enter Father's Name",
                        icon: <FiUser />,
                      },
                      {
                        name: "month",
                        label: "Joining Month",
                        placeholder: "Select Month",
                        icon: <FiCalendar />,
                        type: "month",
                        onChange: handleJoiningMonthChange,
                        value: joiningMonth,
                      },
                      {
                        name: "bus_arrival_time",
                        label: "Arrival Time",
                        placeholder: "HH:MM AM/PM",
                        icon: <FiClock />,
                        type: "time",
                      },
                    ].map((field, index) => (
                      <div key={index} className="space-y-1">
                        <label className="block text-sm md:text-base text-gray-700 font-medium">
                          {field.label}
                        </label>
                        <div className="relative flex items-center border rounded-lg bg-white shadow-sm">
                          <span className="absolute left-3 text-gray-500 text-sm md:text-base">
                            {field.icon}
                          </span>
                          <input
                            type={field.type || "text"}
                            name={field.name}
                            value={field.value || formData[field.name]}
                            onChange={field.onChange || handleInputChange}
                            className="w-full pl-9 pr-3 py-2 text-sm md:text-base rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            placeholder={field.placeholder}
                            required={field.type !== "month"} // Joining month is optional
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Driver Details Section */}
                <div className="bg-gray-100 p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 flex items-center">
                    <FiSmartphone className="mr-2 text-orange-500" /> 
                    <span className="text-sm md:text-base lg:text-xl">Driver Details</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                    {/* Driver Name Dropdown */}
                    <div className="space-y-1">
                      <label className="block text-sm md:text-base text-gray-700 font-medium">
                        Driver Name
                      </label>
                      <div className="relative flex items-center border rounded-lg bg-white shadow-sm">
                        <span className="absolute left-3 text-gray-500 text-sm md:text-base">
                          <FiUser />
                        </span>
                        <select
                          className="w-full pl-9 pr-3 py-2 text-sm md:text-base rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          value={selectedDriver}
                          onChange={handleDriverChange}
                          required
                        >
                          <option value="">Select Driver</option>
                          {drivers.map((driver) => (
                            <option key={driver.id} value={driver.name}>
                              {driver.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Route Name Dropdown */}
                    <div className="space-y-1">
                      <label className="block text-sm md:text-base text-gray-700 font-medium">
                        Route Name
                      </label>
                      <div className="relative flex items-center border rounded-lg bg-white shadow-sm">
                        <span className="absolute left-3 text-gray-500 text-sm md:text-base">
                          <FiMapPin />
                        </span>
                        <select
                          className="w-full pl-9 pr-3 py-2 text-sm md:text-base rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          value={selectedRoute}
                          onChange={(e) => setSelectedRoute(e.target.value)}
                          disabled
                          required
                        >
                          <option value="">Select Route</option>
                          {routes.map((route) => (
                            <option key={route.id} value={route.id}>
                              {route.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Amount Field */}
                    <div className="space-y-1">
                      <label className="block text-sm md:text-base text-gray-700 font-medium">
                        Amount
                      </label>
                      <div className="relative flex items-center border rounded-lg bg-white shadow-sm">
                        <span className="absolute left-3 text-gray-500 text-sm md:text-base">
                          <FiDollarSign />
                        </span>
                        <input
                          type="text"
                          className="w-full pl-9 pr-3 py-2 text-sm md:text-base rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          value={routeAmount}
                          readOnly
                          placeholder="Amount will appear based on route"
                        />
                      </div>
                    </div>

                    {/* Vehicle Details */}
                    <div className="space-y-1">
                      <label className="block text-sm md:text-base text-gray-700 font-medium">
                        Vehicle Details
                      </label>
                      <div className="relative flex items-center border rounded-lg bg-white shadow-sm">
                        <span className="absolute left-3 text-gray-500 text-sm md:text-base">
                          <FiTruck />
                        </span>
                        <input
                          type="text"
                          className="w-full pl-9 pr-3 py-2 text-sm md:text-base rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          value={selectedVehicle}
                          readOnly
                          placeholder="Select a driver first"
                        />
                      </div>
                    </div>

                    {/* Driver Contact */}
                    <div className="space-y-1">
                      <label className="block text-sm md:text-base text-gray-700 font-medium">
                        Driver Contact
                      </label>
                      <div className="relative flex items-center border rounded-lg bg-white shadow-sm">
                        <span className="absolute left-3 text-gray-500 text-sm md:text-base">
                          <FiPhone />
                        </span>
                        <input
                          type="text"
                          className="w-full pl-9 pr-3 py-2 text-sm md:text-base rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          value={driverContact}
                          readOnly
                          placeholder="Select a driver first"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact Section */}
                <div className="bg-gray-100 p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 flex items-center">
                    <FiPhone className="mr-2 text-orange-500" /> 
                    <span className="text-sm md:text-base lg:text-xl">Emergency Contact</span>
                  </h3>
                  <div className="space-y-1">
                    <label className="block text-sm md:text-base text-gray-700 font-medium">
                      Emergency Contact
                    </label>
                    <div className="relative flex items-center border rounded-lg bg-white shadow-sm">
                      <span className="absolute left-3 text-gray-500 text-sm md:text-base">
                        <FiPhone />
                      </span>
                      <input
                        type="text"
                        name="contact_number"
                        value={formData.contact_number}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-3 py-2 text-sm md:text-base rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        placeholder="Enter Emergency Contact"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-4">
                  <button
                    type="submit"
                    className="bg-[#FCE7C3] text-black px-4 py-2 md:px-6 md:py-3 rounded-lg flex items-center gap-2 hover:scale-105 transition-all duration-300 shadow-md text-sm md:text-base"
                  >
                    <FiSend />
                    Submit
                  </button>
                </div>
              </form>
            </div>

            {/* Student List Card */}
            <div className="bg-white shadow-lg rounded-xl md:rounded-2xl p-4 md:p-6 max-w-4xl mx-auto mt-6 md:mt-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3">
                <h2 className="text-xl md:text-2xl font-extrabold text-gray-800">
                  Student List
                </h2>
                <div className="relative w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Search Student..."
                    className="border rounded-lg px-3 py-1 md:px-4 md:py-2 pl-8 md:pl-10 focus:ring-2 focus:ring-blue-400 outline-none w-full text-sm md:text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <FiSearch className="absolute left-2 md:left-3 top-2 md:top-3 text-gray-500 text-sm md:text-base" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-[#FCE7C3] text-gray-800">
                      <th className="border p-2 md:p-3 text-left text-xs md:text-sm">Child Name</th>
                      <th className="border p-2 md:p-3 text-left text-xs md:text-sm">Father's Name</th>
                      <th className="border p-2 md:p-3 text-left text-xs md:text-sm">Driver Name</th>
                      <th className="border p-2 md:p-3 text-left text-xs md:text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedStudents.map((student, index) => (
                      <tr
                        key={student.id}
                        className={`cursor-pointer transition-all ${
                          index % 2 === 0 ? "bg-gray-100" : "bg-white"
                        } hover:bg-[#FFF3E0]`}
                      >
                        <td
                          className="border p-2 md:p-3 text-gray-700 text-center text-xs md:text-sm"
                          onClick={() => openModal(student)}
                        >
                          {student.name}
                        </td>
                        <td
                          className="border p-2 md:p-3 text-gray-700 text-center text-xs md:text-sm"
                          onClick={() => openModal(student)}
                        >
                          {student.fatherName}
                        </td>
                        <td
                          className="border p-2 md:p-3 text-gray-700 text-center text-xs md:text-sm"
                          onClick={() => openModal(student)}
                        >
                          {student.driverName}
                        </td>
                        <td className="border p-2 md:p-3 text-gray-700 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteStudent(student.id);
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors text-sm md:text-base"
                            title="Delete Student"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col md:flex-row justify-between items-center mt-3 md:mt-4 gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={`px-3 py-1 md:px-4 md:py-2 rounded-lg flex items-center gap-1 text-xs md:text-sm ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "bg-[#FCE7C3] text-gray-800 hover:bg-[#FFF3E0]"
                    }`}
                    disabled={currentPage === 1}
                  >
                    <FiChevronLeft /> Prev
                  </button>
                  <p className="text-gray-700 text-xs md:text-sm">
                    Page {currentPage} of {totalPages}
                  </p>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={`px-3 py-1 md:px-4 md:py-2 rounded-lg flex items-center gap-1 text-xs md:text-sm ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "bg-[#FCE7C3] text-gray-800 hover:bg-[#FFF3E0]"
                    }`}
                    disabled={currentPage === totalPages}
                  >
                    Next <FiChevronRight />
                  </button>
                </div>
              )}

              {/* Student Details Modal */}
              {isModalOpen && selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity z-50 p-4">
                  <div className="bg-white rounded-xl md:rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                    {/* Modal Header */}
                    <div className="bg-[#FAE1DD] text-gray-800 p-3 md:p-4 rounded-t-xl md:rounded-t-2xl flex justify-between items-center sticky top-0">
                      <h3 className="text-lg md:text-xl font-bold">Student Details</h3>
                      <button
                        onClick={closeModal}
                        className="text-gray-600 text-xl md:text-2xl"
                      >
                        <FiX />
                      </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-4 md:p-6 space-y-2 md:space-y-3 text-gray-700 text-sm md:text-base">
                      <p>
                        <strong className="text-xs md:text-sm">Name:</strong> {selectedStudent.name}
                      </p>
                      <p>
                        <strong className="text-xs md:text-sm">Father's Name:</strong>{" "}
                        {selectedStudent.fatherName}
                      </p>
                      <p>
                        <strong className="text-xs md:text-sm">Class:</strong> {selectedStudent.class}
                      </p>
                      <p>
                        <strong className="text-xs md:text-sm">Section:</strong> {selectedStudent.section}
                      </p>
                      <p>
                        <strong className="text-xs md:text-sm">Phone:</strong> {selectedStudent.phone}
                      </p>
                      <p>
  <strong className="text-xs md:text-sm">Joining Month:</strong>{" "}
  {selectedStudent.joiningMonth.substring(0, 10)}
</p>
                      <p>
                        <strong className="text-xs md:text-sm">Driver Name:</strong>{" "}
                        {selectedStudent.driverName}
                      </p>
                      <p>
                        <strong className="text-xs md:text-sm">Route:</strong> {selectedStudent.route}
                      </p>
                      <p>
                        <strong className="text-xs md:text-sm">Driver Contact:</strong>{" "}
                        {selectedStudent.driverContact}
                      </p>
                      <p>
                        <strong className="text-xs md:text-sm">Vehicle Number:</strong>{" "}
                        {selectedStudent.vehicleNumber}
                      </p>
                      <p>
                        <strong className="text-xs md:text-sm">Emergency Contact:</strong>{" "}
                        {selectedStudent.emergency}
                      </p>
                      <p>
                        <strong className="text-xs md:text-sm">Arrival Time:</strong>{" "}
                        {selectedStudent.arrivalTime}
                      </p>
                      <p>
                        <strong className="text-xs md:text-sm">Amount:</strong> {selectedStudent.amount}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;