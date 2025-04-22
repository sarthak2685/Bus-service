import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import config from "../Config";

const ITEMS_PER_PAGE = 6;

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/gallery/`);
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedImages = images.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section
      className="relative  px-4 sm:px-6 lg:px-12 py-16 overflow-hidden"
      id="gallery"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10 z-0"></div>

      <div className="text-center mb-12 relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Our Gallery
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Explore the beautiful moments we’ve captured along our journey.
        </p>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 mt-8">Loading images...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto relative z-10">
            <AnimatePresence>
              {paginatedImages.map((img, index) => (
                <motion.div
                  key={img.id}
                  className="group overflow-hidden rounded-xl shadow-md bg-white border border-gray-200"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative">
                    <img
                      src={img.image}
                      alt={`Gallery Image ${startIndex + index + 1}`}
                      className="w-full h-60 sm:h-64 md:h-72 lg:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <span className="text-white text-base sm:text-lg font-medium tracking-wide">
                        Image {startIndex + index + 1}
                      </span>
                    </div> */}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-10 space-x-4 relative z-10 flex-wrap gap-y-4">
            <button
              className={`px-5 py-2 rounded-md text-sm font-medium transition ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className={`px-5 py-2 rounded-md text-sm font-medium transition ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default Gallery;
