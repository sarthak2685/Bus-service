import React from 'react';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

const Gallery = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

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
    <>
      <div className="relative bg-white px-4 sm:px-6 lg:px-8 overflow-hidden -mt-24">

        {/* Layered Background Patterns */}
        {/* <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/double-bubble-outline.png')] opacity-5 z-0"></div> */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20 z-0"></div>
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-50 animate-blob z-0"></div>

      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-40 animate-blob z-0"></div>

        {/* Animated Gradient Overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-orange-100 via-white to-orange-50 animate-gradient-move z-0"></div> */}

        <div className="text-center relative z-10">
          <h1 className="text-4xl font-bold text-orange-500 animate-fade-in">Gallery</h1>
        </div>

        {/* Slider */}
        <div className="mt-10 max-w-6xl mx-auto relative z-10">
          <Slider {...settings}>
            {images.map((img, index) => (
              <div key={index} className="p-3">
                <img
                  src={img}
                  alt={`Gallery Image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg shadow-lg hover:scale-110 hover:brightness-110 transition-transform duration-500 ease-in-out hover:shadow-2xl"
                />
              </div>
            ))}
          </Slider>
        </div>

      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-in-out forwards;
        }

        @keyframes blob {
          0%, 100% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.2) translate(-20px, -20px); }
        }
        .animate-blob {
          animation: blob 6s infinite ease-in-out;
        }

        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradient-move 8s ease infinite;
        }
      `}</style>
    </>
  );
};

export default Gallery;
