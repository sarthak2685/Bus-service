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

  // Function to get route name by ID with null checking
  const getRouteName = (routeId) => {
  if (!routeId) return "No Route Assigned";
  const route = routes.find((route) => route.id === routeId);
  return route ? route.name : "Unknown Route";
};


  // Function to get route amount by ID with null checking
  const getRouteAmount = (routeId) => {
    if (!routeId) return null;
    const route = routes.find((route) => route.id === routeId);
    return route ? route.amount : null;
  };

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getRouteName(driver.route)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      driver.contact?.includes(searchTerm) ||
      driver.vehicle_number?.toLowerCase().includes(searchTerm.toLowerCase())
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
        isCollapsed ? "ml-0 md:ml-16" : "ml-0 md:ml-56"
      }`}
    >
      <Header toggleSidebar={toggleSidebar} />
      <div className="p-3 md:p-4 w-full mx-auto max-w-5xl">
        {/* Error Message */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded relative mb-3 text-xs md:text-sm"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Driver Details Form */}
        <div className="bg-white shadow-md rounded-lg md:rounded-xl p-3 md:p-4 mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center border-b pb-2">
            Add Drivers
          </h2>

          <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center mb-3">
              <span className="text-orange-500 text-xl md:text-2xl mr-1">📋</span>
              Driver Details
            </h2>
            <form onSubmit={handleAddDriver} className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    label: "Driver Name",
                    name: "name",
                    type: "text",
                    placeholder: "Enter Name",
                    icon: <FiUser className="text-xs md:text-sm" />,
                  },
                  {
                    label: "Route Name",
                    name: "route",
                    type: "select",
                    placeholder: "Select Route",
                    icon: <FiMapPin className="text-xs md:text-sm" />,
                  },
                  {
                    label: "Driver Contact",
                    name: "contact",
                    type: "text",
                    placeholder: "Enter Contact",
                    icon: <FiPhone className="text-xs md:text-sm" />,
                  },
                  {
                    label: "Vehicle Number",
                    name: "vehicle_number",
                    type: "text",
                    placeholder: "Enter Vehicle Number",
                    icon: <FiTruck className="text-xs md:text-sm" />,
                  },
                ].map((field, index) => (
                  <div key={index} className="w-full">
                    <label className="block text-gray-700 font-medium mb-1 text-xs md:text-sm">
                      {field.label}
                    </label>
                    <div className="relative flex items-center border rounded-md bg-white">
                      <span className="absolute left-2 text-gray-500">
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
                              route: selectedRouteId,
                            });
                          }}
                          className="w-full pl-8 pr-2 py-1.5 rounded-md focus:ring-1 focus:ring-orange-400 focus:outline-none text-xs md:text-sm"
                          disabled={routesLoading}
                        >
                          <option value="">
                            {routesLoading
                              ? "Loading..."
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
                          type={field.type}
                          name={field.name}
                          value={newDriver[field.name]}
                          onChange={(e) =>
                            setNewDriver({
                              ...newDriver,
                              [field.name]: e.target.value,
                            })
                          }
                          className="w-full pl-8 pr-2 py-1.5 rounded-md focus:ring-1 focus:ring-orange-400 focus:outline-none text-xs md:text-sm"
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center pt-1">
                <button
                  type="submit"
                  onClick={handleAddDriver}
                  className="bg-orange-100 text-black px-3 py-1.5 rounded-md flex items-center gap-1 hover:scale-105 transition-all duration-200 shadow-sm text-xs md:text-sm"
                  disabled={isLoading}
                >
                  <FiSend className="text-xs md:text-sm" /> {isLoading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Driver List */}
        <div className="bg-white shadow-md rounded-lg md:rounded-xl p-3 md:p-4">
          <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between md:items-center mb-3">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              Driver List
            </h2>
            <div className="relative w-full md:w-48">
              <input
                type="text"
                className="w-full pl-8 pr-2 py-1.5 border rounded-md focus:ring-1 focus:ring-orange-400 focus:outline-none text-xs md:text-sm"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-2 top-2 text-gray-500 text-xs md:text-sm" />
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-3 text-xs md:text-sm">Loading drivers...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-orange-50 text-gray-800 text-xs md:text-sm">
                      <th className="border p-1.5 md:p-2">Name</th>
                      <th className="border p-1.5 md:p-2">Route</th>
                      <th className="border p-1.5 md:p-2">Contact</th>
                      <th className="border p-1.5 md:p-2">Vehicle</th>
                      <th className="border p-1.5 md:p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedDrivers.length > 0 ? (
                      paginatedDrivers.map((driver) => {
                        const routeAmount = getRouteAmount(driver.route);
                        return (
                          <tr
                            key={driver.id}
                            className="text-center hover:bg-gray-50 text-xs md:text-sm"
                          >
                            <td className="border p-1.5 md:p-2">{driver.name || "N/A"}</td>
                            <td className="border p-1.5 md:p-2">
                              <div className="flex flex-col">
                                <span>{getRouteName(driver.route?.id)}</span>
                                {routeAmount && (
                                  <span className="text-xxs md:text-xs text-gray-500">
                                    ₹{routeAmount}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="border p-1.5 md:p-2">{driver.contact || "N/A"}</td>
                            <td className="border p-1.5 md:p-2">{driver.vehicle_number || "N/A"}</td>
                            <td className="border p-1.5 md:p-2">
                              <button
                                onClick={() => handleDelete(driver.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FiTrash2 className="text-xs md:text-sm mx-auto" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="border p-3 text-center text-xs md:text-sm">
                          No drivers found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-3 space-x-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-2 py-1 rounded text-xxs md:text-xs ${
                        currentPage === i + 1
                          ? "bg-orange-400 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
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