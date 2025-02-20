import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiSend,
  FiTrash2,
  FiSearch,
} from "react-icons/fi";
import Header from "./Header";
import Sidebar from "./Sidebar";

const AddDriver = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [drivers, setDrivers] = useState([
    { name: "John Doe", route: "Route A", contact: "123-456-7890" },
    { name: "Jane Smith", route: "Route B", contact: "987-654-3210" },
    { name: "Michael Johnson", route: "Route C", contact: "555-123-4567" },
    { name: "Emily Davis", route: "Route D", contact: "444-987-6543" },
    { name: "David Brown", route: "Route E", contact: "333-876-5432" },
    { name: "Sarah Wilson", route: "Route F", contact: "222-654-9871" },
    { name: "James Anderson", route: "Route G", contact: "111-789-2345" },
    { name: "Linda Martinez", route: "Route H", contact: "777-345-6789" },
    { name: "Robert Thomas", route: "Route I", contact: "666-234-5678" },
    { name: "Patricia White", route: "Route J", contact: "999-123-7890" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newDriver, setNewDriver] = useState({
    name: "",
    route: "",
    contact: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const driversPerPage = 5;

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDelete = (index) => {
    setDrivers(drivers.filter((_, i) => i !== index));
  };

  const handleAddDriver = (e) => {
    e.preventDefault();
    if (newDriver.name && newDriver.route && newDriver.contact) {
      setDrivers([...drivers, newDriver]);
      setNewDriver({ name: "", route: "", contact: "" });
    }
  };

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.contact.includes(searchTerm)
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredDrivers.length / driversPerPage);
  const startIndex = (currentPage - 1) * driversPerPage;
  const paginatedDrivers = filteredDrivers.slice(
    startIndex,
    startIndex + driversPerPage
  );

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
            {/* Driver Details Form */}
            <div className="bg-white shadow-lg rounded-2xl p-8">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center border-b pb-4">
                Add Drivers
              </h2>

              <div className="bg-gray-100 p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center mb-6">
                  <span className="text-orange-500 text-3xl mr-2">📋</span>{" "}
                  Driver Details
                </h2>
                <form onSubmit={handleAddDriver} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        label: "Driver Name",
                        name: "name",
                        placeholder: "Enter Name",
                        icon: <FiUser />,
                      },
                      {
                        label: "Route Name",
                        name: "route",
                        placeholder: "Enter Route",
                        icon: <FiMapPin />,
                      },
                      {
                        label: "Driver Contact",
                        name: "contact",
                        placeholder: "Enter Contact",
                        icon: <FiPhone />,
                      },
                    ].map((field, index) => (
                      <div key={index}>
                        <label className="block text-gray-700 font-medium mb-2">
                          {field.label}
                        </label>
                        <div className="relative flex items-center border rounded-lg bg-gray-50 shadow-sm">
                          <span className="absolute left-3 text-gray-500">
                            {field.icon}
                          </span>
                          <input
                            type="text"
                            name={field.name}
                            value={newDriver[field.name]}
                            onChange={(e) =>
                              setNewDriver({
                                ...newDriver,
                                [field.name]: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                            placeholder={field.placeholder}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </form>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  onClick={handleAddDriver}
                  className="bg-orange-100 text-black px-6 py-3 rounded-lg flex items-center gap-2 hover:scale-105 transition-all duration-300 shadow-md"
                >
                  <FiSend /> Submit
                </button>
              </div>
            </div>

            {/* Driver List with Pagination */}
            <div className="mt-10 bg-white shadow-lg rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Driver List
                </h2>
                <div className="relative">
                  <input
                    type="text"
                    className="pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FiSearch className="absolute left-3 top-3 text-gray-500" />
                </div>
              </div>
              <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-orange-100 text-gray-800">
                    <th className="border border-gray-300 px-6 py-3">Name</th>
                    <th className="border border-gray-300 px-6 py-3">Route</th>
                    <th className="border border-gray-300 px-6 py-3">
                      Contact
                    </th>
                    <th className="border border-gray-300 px-6 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDrivers.map((driver, index) => (
                    <tr
                      key={index}
                      className="text-center bg-white hover:bg-gray-100 transition-all"
                    >
                      <td className="border border-gray-300 px-6 py-3">
                        {driver.name}
                      </td>
                      <td className="border border-gray-300 px-6 py-3">
                        {driver.route}
                      </td>
                      <td className="border border-gray-300 px-6 py-3">
                        {driver.contact}
                      </td>
                      <td className="border border-gray-300 px-6 py-3">
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination Controls */}
              <div className="flex justify-center mt-4 space-x-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === i + 1
                        ? "bg-orange-400 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDriver;
