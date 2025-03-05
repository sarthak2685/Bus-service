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
  });
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
          driverName: student.driver ? student.driver.name : "N/A",
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

      setSelectedVehicle(driver.vehicle_number || "");

      // Send driver_id in the payload
      const payload = {
        driver_id: driver.id,
        driver_name: driverName,
        contact: driver.contact || "",
        route_id: assignedRoute ? assignedRoute.id : "",
        vehicle_number: driver.vehicle_number || "",
      };

      console.log("Payload:", payload); // Debugging purpose
      sendPayload(payload); // API call ya state update ke liye function
    } else {
      // Reset all fields if no driver is selected
      setSelectedDriver("");
      setDriverContact("");
      setSelectedRoute("");
      setSelectedVehicle("");
    }
  };

  // // Render loading state
  // if (loading) {
  //   return (
  //     <div className="bg-gray-100 p-6 rounded-xl shadow-md">
  //       <p>Loading driver details...</p>
  //     </div>
  //   );
  // }

  // // Render error state
  // if (error) {
  //   return (
  //     <div className="bg-red-100 p-6 rounded-xl shadow-md">
  //       <p>Error: {error}</p>
  //     </div>
  //   );
  // }

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
      console.log("Student registered successfully:", responseData);

      // Optional: Show success message to user
      alert("Student registered successfully!");

      // Optional: Reset form after successful submission
      resetForm();
    } catch (error) {
      // Handle submission error
      console.error("Error registering student:", error);

      // Optional: Show error message to user
      alert("Failed to register student. Please try again.");
    }
  };

  // Reset form function
  const resetForm = () => {
    setFormData({
      name: "",
      student_class: "",
      section: "",
      phone_number: "",
      fatherName: "",
      contact_number: "",
    });
    setSelectedDriver("");
    setSelectedRoute("");
    setDriverContact("");
    setSelectedVehicle("");
  };

  // // Loading and error handling
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

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
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        <div
          className={`flex-grow transition-all ${
            isCollapsed ? "ml-0" : "ml-64"
          }`}
        >
          <Header toggleSidebar={toggleSidebar} />
          <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-white shadow-lg rounded-2xl p-10">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center border-b pb-4">
                Add Users
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Student Information Section */}
                <div className="bg-gray-100 p-6 rounded-xl shadow-md">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FiUsers className="mr-2 text-orange-500" /> Student
                    Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    ].map((field, index) => (
                      <div key={index}>
                        <label className="block text-gray-700 font-medium mb-2">
                          {field.label}
                        </label>
                        <div className="relative flex items-center border rounded-lg bg-white shadow-sm">
                          <span className="absolute left-3 text-gray-500">
                            {field.icon}
                          </span>
                          <input
                            type="text"
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            placeholder={field.placeholder}
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Driver Details Section */}
                <div className="bg-gray-100 p-6 rounded-xl shadow-md">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FiSmartphone className="mr-2 text-orange-500" /> Driver
                    Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Driver Name Dropdown */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Driver Name
                      </label>
                      <div className="relative flex items-center border rounded-lg bg-white shadow-sm">
                        <span className="absolute left-3 text-gray-500">
                          <FiUser />
                        </span>
                        <select
                          className="w-full pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Route Name
                      </label>
                      <div className="relative flex items-center border rounded-lg bg-white shadow-sm">
                        <span className="absolute left-3 text-gray-500">
                          <FiMapPin />
                        </span>
                        <select
                          className="w-full pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          value={selectedRoute}
                          onChange={(e) => setSelectedRoute(e.target.value)}
                          disabled={!selectedDriver}
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

                    {/* Vehicle Details */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Vehicle Details
                      </label>
                      <div className="relative flex items-center border rounded-lg bg-white shadow-sm">
                        <span className="absolute left-3 text-gray-500">
                          <FiTruck />
                        </span>
                        <input
                          type="text"
                          className="w-full pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          value={selectedVehicle}
                          readOnly
                          placeholder="Select a driver first"
                        />
                      </div>
                    </div>

                    {/* Driver Contact */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Driver Contact
                      </label>
                      <div className="relative flex items-center border rounded-lg bg-white shadow-sm">
                        <span className="absolute left-3 text-gray-500">
                          <FiPhone />
                        </span>
                        <input
                          type="text"
                          className="w-full pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          value={driverContact}
                          readOnly
                          placeholder="Select a driver first"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact Section */}
                <div className="bg-gray-100 p-6 rounded-xl shadow-md">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FiPhone className="mr-2 text-orange-500" /> Emergency
                    Contact
                  </h3>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Emergency Contact
                    </label>
                    <div className="relative flex items-center border rounded-lg bg-white shadow-sm">
                      <span className="absolute left-3 text-gray-500">
                        <FiPhone />
                      </span>
                      <input
                        type="text"
                        name="contact_number"
                        value={formData.contact_number}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        placeholder="Enter Emergency Contact"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-6">
                  <button
                    type="submit"
                    className="bg-[#FCE7C3] text-black px-6 py-3 rounded-lg flex items-center gap-2 hover:scale-105 transition-all duration-300 shadow-md"
                  >
                    <FiSend />
                    Submit
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-4xl mx-auto mt-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-extrabold text-gray-800">
                  Student List
                </h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Student..."
                    className="border rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-400 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <FiSearch className="absolute left-3 top-3 text-gray-500" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-[#FCE7C3] text-gray-800">
                      <th className="border p-4 text-left">Child Name</th>
                      <th className="border p-4 text-left">Father's Name</th>
                      <th className="border p-4 text-left">Driver Name</th>
                      <th className="border p-4 text-left">Actions</th>
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
                          className="border p-4 text-gray-700"
                          onClick={() => openModal(student)}
                        >
                          {student.name}
                        </td>
                        <td
                          className="border p-4 text-gray-700"
                          onClick={() => openModal(student)}
                        >
                          {student.fatherName}
                        </td>
                        <td
                          className="border p-4 text-gray-700"
                          onClick={() => openModal(student)}
                        >
                          {student.driverName}
                        </td>
                        <td className="border p-4 text-gray-700">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent modal from opening
                              handleDeleteStudent(student.id);
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors"
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
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "bg-[#FCE7C3] text-gray-800 hover:bg-[#FFF3E0]"
                    }`}
                    disabled={currentPage === 1}
                  >
                    <FiChevronLeft /> Prev
                  </button>
                  <p className="text-gray-700">
                    Page {currentPage} of {totalPages}
                  </p>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity">
                  <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full transform scale-100 transition-all duration-300">
                    {/* Modal Header with Soft Color */}
                    <div className="bg-[#FAE1DD] text-gray-800 p-4 rounded-t-2xl flex justify-between items-center">
                      <h3 className="text-2xl font-bold">Student Details</h3>
                      <button
                        onClick={closeModal}
                        className="text-gray-600 text-2xl"
                      >
                        <FiX />
                      </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 space-y-3 text-gray-700 text-lg">
                      <p>
                        <strong>Name:</strong> {selectedStudent.name}
                      </p>
                      <p>
                        <strong>Father's Name:</strong>{" "}
                        {selectedStudent.fatherName}
                      </p>
                      <p>
                        <strong>Class:</strong> {selectedStudent.class}
                      </p>
                      <p>
                        <strong>Section:</strong> {selectedStudent.section}
                      </p>
                      <p>
                        <strong>Phone:</strong> {selectedStudent.phone}
                      </p>
                      <p>
                        <strong>Driver Name:</strong>{" "}
                        {selectedStudent.driverName}
                      </p>
                      <p>
                        <strong>Route:</strong> {selectedStudent.route}
                      </p>
                      <p>
                        <strong>Driver Contact:</strong>{" "}
                        {selectedStudent.driverContact}
                      </p>
                      <p>
                        <strong>Vehicle Number:</strong>{" "}
                        {selectedStudent.vehicleNumber}
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
