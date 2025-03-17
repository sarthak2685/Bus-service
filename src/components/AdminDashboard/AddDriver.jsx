import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiSend,
  FiTrash2,
  FiSearch,
  FiTruck,
} from "react-icons/fi";
import Header from "./Header";
import Sidebar from "./Sidebar";
import config from "../Config";

const AddDriver = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [routesLoading, setRoutesLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get token from localStorage
  const S = JSON.parse(localStorage.getItem("user"));
  const token = S?.data?.token;

  const [searchTerm, setSearchTerm] = useState("");
  const [newDriver, setNewDriver] = useState({
    name: "",
    route: "", // Stores route ID
    contact: "",
    vehicle_number: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const driversPerPage = 5;

  // Fetch routes and drivers from API
  useEffect(() => {
    const fetchRoutes = async () => {
      setRoutesLoading(true);
      try {
        const response = await fetch(`${config.apiUrl}/route/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch routes");
        }

        const data = await response.json();
        setRoutes(data);
        setRoutesLoading(false);
      } catch (err) {
        setError(err.message);
        setRoutesLoading(false);
      }
    };

    const fetchDrivers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${config.apiUrl}/drivers/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch drivers");
        }

        const data = await response.json();
        setDrivers(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    if (token) {
      fetchRoutes();
      fetchDrivers();
    }
  }, [token]);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDelete = async (driverId) => {
    try {
      const response = await fetch(`${config.apiUrl}/drivers/${driverId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete driver");
      }

      // Remove driver from local state
      setDrivers(drivers.filter((driver) => driver.id !== driverId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddDriver = async (e) => {
    e.preventDefault();

    // Validate input with more robust checks
    if (
      !newDriver.name.trim() ||
      !newDriver.route || // Ensures route ID is not empty
      !newDriver.contact.trim() ||
      !newDriver.vehicle_number.trim()
    ) {
      setError("Please fill in all fields, ensure route is selected");
      return;
    }

    try {
      const response = await fetch(`${config.apiUrl}/drivers/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newDriver.name,
          route_id: newDriver.route, // Explicitly sending route ID
          contact: newDriver.contact,
          vehicle_number: newDriver.vehicle_number,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add driver");
      }

      const addedDriver = await response.json();

      // Update local state
      setDrivers([...drivers, addedDriver]);

      // Reset form
      setNewDriver({ name: "", route: "", contact: "", vehicle_number: "" });
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Function to get route name by ID
  const getRouteName = (routeId) => {
    const route = routes.find((route) => route.id === routeId);
    return route ? route.name : "Unknown Route";
  };

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getRouteName(driver.route)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      driver.contact.includes(searchTerm) ||
      driver.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase())
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
            {/* Error Message */}
            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}

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
                        type: "text",
                        placeholder: "Enter Name",
                        icon: <FiUser />,
                      },
                      {
                        label: "Route Name",
                        name: "route",
                        type: "select",
                        placeholder: "Select Route",
                        icon: <FiMapPin />,
                      },
                      {
                        label: "Driver Contact",
                        name: "contact",
                        type: "text",
                        placeholder: "Enter Contact",
                        icon: <FiPhone />,
                      },
                      {
                        label: "Vehicle Number",
                        name: "vehicle_number",
                        type: "text",
                        placeholder: "Enter Vehicle Number",
                        icon: <FiTruck />,
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
                          {field.name === "route" ? (
                            <select
                              name={field.name}
                              value={newDriver.route}
                              onChange={(e) => {
                                const selectedRouteId = e.target.value;
                                setNewDriver({
                                  ...newDriver,
                                  route: selectedRouteId, // Ensures route ID is set
                                });
                              }}
                              className="w-full pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                              disabled={routesLoading}
                            >
                              <option value="">
                                {routesLoading
                                  ? "Loading routes..."
                                  : "Select Route"}
                              </option>
                              {routes.map((route) => (
                                <option key={route.id} value={route.id}>
                                  {route.name}
                                </option>
                              ))}
                            </select>
                          ) : (
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
                          )}
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
                  disabled={isLoading}
                >
                  <FiSend /> {isLoading ? "Submitting..." : "Submit"}
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
              {isLoading ? (
                <div className="text-center py-4">Loading drivers...</div>
              ) : (
                <>
                  <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-orange-100 text-gray-800">
                        <th className="border border-gray-300 px-6 py-3">
                          Name
                        </th>
                        <th className="border border-gray-300 px-6 py-3">
                          Route
                        </th>
                        <th className="border border-gray-300 px-6 py-3">
                          Contact
                        </th>
                        <th className="border border-gray-300 px-6 py-3">
                          Vehicle Number
                        </th>
                        <th className="border border-gray-300 px-6 py-3">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedDrivers.map((driver) => (
                        <tr
                          key={driver.id}
                          className="text-center bg-white hover:bg-gray-100 transition-all"
                        >
                          <td className="border border-gray-300 px-6 py-3">
                            {driver.name}
                          </td>
                          <td className="border border-gray-300 px-6 py-3">
                            {driver.route.name}
                            {driver.route.amount && (
                              <span className="block text-sm text-gray-500">
                                Amount: {driver.route.amount || "N/A"}
                              </span>
                            )}
                          </td>
                          <td className="border border-gray-300 px-6 py-3">
                            {driver.contact}
                          </td>
                          <td className="border border-gray-300 px-6 py-3">
                            {driver.vehicle_number}
                          </td>
                          <td className="border border-gray-300 px-6 py-3">
                            <button
                              onClick={() => handleDelete(driver.id)}
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDriver;
