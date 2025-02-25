import React from 'react';
import { motion } from 'framer-motion';

const Gallery = () => {
  const images = [
    'https://img.freepik.com/premium-photo/cute-pupil-walking-school-bus_13339-103164.jpg',
    'https://img.freepik.com/premium-photo/cute-pupil-walking-school-bus_13339-103164.jpg',
    'https://img.freepik.com/premium-photo/indian-school-boy-standing-white-background_601128-2.jpg',
    'https://img.freepik.com/free-photo/happy-mother-son-wearing-face-masks-while-commuting-school-by-bus_637285-11781.jpg',
    'https://img.freepik.com/free-photo/portrait-young-boy-school-student_23-2151031884.jpg',
    'https://img.freepik.com/free-photo/male-bus-driver-portrait_23-2151582526.jpg',
    'https://img.freepik.com/free-photo/view-young-students-attending-school_23-2151031880.jpg',
  ];

  return (
    <div className="relative bg-white px-4 sm:px-6 lg:px-8 py-12 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20 z-0"></div>

      <div className="text-center relative z-10">
        <h1 className="text-4xl font-bold text-orange-500">Gallery</h1>
      </div>

      {/* Image Grid with Animations */}
      <div className="mt-12 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {images.map((img, index) => (
          <motion.div
            key={index}
            className="relative group overflow-hidden rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={img}
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
    </div>
  );
};

export default Gallery;
