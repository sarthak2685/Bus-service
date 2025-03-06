import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import config from '../Config';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/gallery/`);
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="relative bg-white px-4 sm:px-6 lg:px-8 py-12 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20 z-0"></div>

      <div className="text-center relative z-10">
        <h1 className="text-4xl font-bold text-orange-500">Gallery</h1>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="text-center text-gray-500 mt-8">Loading images...</div>
      ) : (
        <div className="mt-12 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {images.map((img, index) => (
          <motion.div
            key={img.id}
            className="relative group overflow-hidden rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={img.image}
              alt={`Gallery Image ${index + 1}`}
              className="w-full h-64 object-cover transition-transform duration-500 ease-in-out"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-500 flex items-end p-4">
              <p className="text-white text-lg font-semibold">Image {index + 1}</p>
            </div>
          </motion.div>
        ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
