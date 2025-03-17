import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import config from "../Config";

const Routes = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [routeName, setRouteName] = useState("");
  const [routeDescription, setRouteDescription] = useState("");
  const [routes, setRoutes] = useState([]);
  const [routeAmount, setRouteAmount] = useState("");
  const S = JSON.parse(localStorage.getItem("user"));
  const token = S?.data?.token;

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [routesPerPage] = useState(5);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/route/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setRoutes(data);
        } else {
          console.error("Failed to fetch routes:", data.message);
        }
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    if (token) {
      fetchRoutes();
    }
  }, [token]);

  const addRoute = async () => {
    if (routeName.trim() === "") return;
    const newRoute = {
      name: routeName,
      description: routeDescription,
      amount: routeAmount,
    };

    try {
      const response = await fetch(`${config.apiUrl}/route/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRoute),
      });

      const data = await response.json();
      if (response.ok) {
        setRoutes((prevRoutes) => [...prevRoutes, data]);
        setRouteName("");
        setRouteDescription("");
      } else {
        console.error("Failed to add route:", data.message);
      }
    } catch (error) {
      console.error("Error adding route:", error);
    }
  };

  const deleteRoute = async (id) => {
    try {
      const response = await fetch(`${config.apiUrl}/route/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        setRoutes(routes.filter((route) => route.id !== id));
      } else {
        console.error("Failed to delete route");
      }
    } catch (error) {
      console.error("Error deleting route:", error);
    }
  };

  // Get current routes for pagination
  const indexOfLastRoute = currentPage * routesPerPage;
  const indexOfFirstRoute = indexOfLastRoute - routesPerPage;
  const currentRoutes = routes.slice(indexOfFirstRoute, indexOfLastRoute);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(routes.length / routesPerPage))
    );
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

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
                Driver Routes
              </h2>
              <div className="mb-6">
                <input
                  type="text"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDEBD0]"
                  placeholder="Enter route name"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <input
                  type="number"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDEBD0]"
                  placeholder="Enter amount"
                  value={routeAmount}
                  onChange={(e) => setRouteAmount(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <textarea
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDEBD0]"
                  placeholder="Enter route description"
                  value={routeDescription}
                  onChange={(e) => setRouteDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-center mb-6">
                <button
                  onClick={addRoute}
                  className="flex items-center gap-2 bg-[#FDEBD0] text-black px-5 py-3 rounded-lg hover:bg-[#FAD7A0] transition shadow-md"
                >
                  <FaPlus /> Add Route
                </button>
              </div>
              {routes.length > 0 ? (
                <>
                  <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-[#FDEBD0]">
                        <th className="border p-3 text-gray-800">Route Name</th>
                        <th className="border p-3 text-gray-800">Amount</th>
                        <th className="border p-3 text-gray-800">
                          Description
                        </th>
                        <th className="border p-3 text-gray-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRoutes.map((route) => (
                        <tr
                          key={route.id}
                          className="text-center bg-white hover:bg-gray-100"
                        >
                          <td className="border p-3 text-gray-700">
                            {route.name}
                          </td>
                          <td className="border p-3 text-gray-700">
                            {route.amount}
                          </td>
                          <td className="border p-3 text-gray-700">
                            {route.description}
                          </td>
                          <td className="border border-gray-300 px-6 py-3">
                            <button
                              onClick={() => deleteRoute(route.id)}
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
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {indexOfFirstRoute + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(indexOfLastRoute, routes.length)}
                      </span>{" "}
                      of <span className="font-medium">{routes.length}</span>{" "}
                      routes
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === 1
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-[#FDEBD0] text-gray-800 hover:bg-[#FAD7A0]"
                        }`}
                      >
                        <FaChevronLeft />
                      </button>
                      {[...Array(Math.ceil(routes.length / routesPerPage))].map(
                        (_, index) => (
                          <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === index + 1
                                ? "bg-[#FAD7A0] text-gray-800"
                                : "bg-[#FDEBD0] text-gray-800 hover:bg-[#FAD7A0]"
                            }`}
                          >
                            {index + 1}
                          </button>
                        )
                      )}
                      <button
                        onClick={nextPage}
                        disabled={
                          currentPage ===
                          Math.ceil(routes.length / routesPerPage)
                        }
                        className={`px-3 py-1 rounded-md ${
                          currentPage ===
                          Math.ceil(routes.length / routesPerPage)
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-[#FDEBD0] text-gray-800 hover:bg-[#FAD7A0]"
                        }`}
                      >
                        <FaChevronRight />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-center mt-4">
                  No routes added yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Routes;
