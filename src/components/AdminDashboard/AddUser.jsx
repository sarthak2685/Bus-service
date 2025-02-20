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
} from "react-icons/fi";
import Header from "./Header";
import Sidebar from "./Sidebar";

const AddUser = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;
  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const students = [
    {
      id: 1,
      name: "Aarav Sharma",
      fatherName: "Rohit Sharma",
      class: "5th",
      section: "A",
      phone: "9876543210",
      driverName: "Rajesh Kumar",
      route: "Route 1",
      driverContact: "9123456789",
    },
    {
      id: 2,
      name: "Kiara Verma",
      fatherName: "Amit Verma",
      class: "6th",
      section: "B",
      phone: "9876543211",
      driverName: "Suresh Yadav",
      route: "Route 2",
      driverContact: "9234567890",
    },
  ];

  // Filter students based on search query
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const displayedStudents = filteredStudents.slice(
    startIndex,
    startIndex + studentsPerPage
  );

  const drivers = [
    { name: "John Doe", route: "Route 1", contact: "123-456-7890" },
    { name: "Jane Smith", route: "Route 2", contact: "987-654-3210" },
    { name: "Mike Johnson", route: "Route 3", contact: "555-555-5555" },
  ];

  const [selectedDriver, setSelectedDriver] = useState("");
  const [driverContact, setDriverContact] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");

  const handleDriverChange = (event) => {
    const driverName = event.target.value;
    const driver = drivers.find((d) => d.name === driverName);
    setSelectedDriver(driverName);
    setDriverContact(driver ? driver.contact : "");
    setSelectedRoute(driver ? driver.route : "");
  };

  const openModal = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
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

              <form className="space-y-8">
                {/* Student Information Section */}
                <div className="bg-gray-100 p-6 rounded-xl shadow-md">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FiUsers className="mr-2 text-orange-500" /> Student
                    Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        label: "Name of Child",
                        placeholder: "Enter Name",
                        icon: <FiUser />,
                      },
                      {
                        label: "Class",
                        placeholder: "Enter Class",
                        icon: <FiBookOpen />,
                      },
                      {
                        label: "Section",
                        placeholder: "Enter Section",
                        icon: <FiMapPin />,
                      },
                      {
                        label: "Phone Number",
                        placeholder: "Enter Phone Number",
                        icon: <FiPhone />,
                      },
                      {
                        label: "Father’s Name",
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
                            className="w-full pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            placeholder={field.placeholder}
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
                        >
                          <option value="">Select Driver</option>
                          {drivers.map((driver, index) => (
                            <option key={index} value={driver.name}>
                              {driver.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Route Name (Autofilled with Placeholder) */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Route Name
                      </label>
                      <div className="relative flex items-center border rounded-lg bg-white shadow-sm">
                        <span className="absolute left-3 text-gray-500">
                          <FiMapPin />
                        </span>
                        <input
                          type="text"
                          className="w-full pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          value={selectedRoute}
                          readOnly
                          placeholder="Select a driver first"
                        />
                      </div>
                    </div>

                    {/* Driver Contact (Autofilled with Placeholder) */}
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
                        className="w-full pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        placeholder="Enter Emergency Contact"
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
              {/* Header */}
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

              {/* Student Table */}
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-[#FCE7C3] text-gray-800">
                      <th className="border p-4 text-left">Child Name</th>
                      <th className="border p-4 text-left">Father's Name</th>
                      <th className="border p-4 text-left">Driver Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedStudents.map((student, index) => (
                      <tr
                        key={student.id}
                        className={`cursor-pointer transition-all ${
                          index % 2 === 0 ? "bg-gray-100" : "bg-white"
                        } hover:bg-[#FFF3E0]`}
                        onClick={() => openModal(student)}
                      >
                        <td className="border p-4 text-gray-700">
                          {student.name}
                        </td>
                        <td className="border p-4 text-gray-700">
                          {student.fatherName}
                        </td>
                        <td className="border p-4 text-gray-700">
                          {student.driverName}
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
