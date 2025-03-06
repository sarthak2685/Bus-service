import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import config from "../Config"; // Importing API config
import { XCircle } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Gallery = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [images, setImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  // Fetch existing images when component mounts
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/gallery/`);

        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }

        const data = await response.json();
        setImages(data || []); // Directly use the returned array
        setLoading(false);
      } catch (err) {
        console.error("Error fetching images:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);

    if (files.length > 0) {
      setSelectedImage(URL.createObjectURL(files[0]));
    }

    for (let file of files) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch(`${config.apiUrl}/gallery/`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok && data.id) {
          // Add the new image object to the images array
          setImages((prevImages) => [...prevImages, data]);
        } else {
          console.error(
            "Error uploading image:",
            data.message || "Unknown error"
          );
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleDeleteImage = async (imageToDelete) => {
    try {
      const response = await fetch(`${config.apiUrl}/gallery/${imageToDelete.id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        setImages((prevImages) => prevImages.filter((image) => image.id !== imageToDelete.id));
        if (previewImage === imageToDelete.image) {
          setPreviewImage(null);
        }
        toast.success("Image deleted successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        const errorData = await response.json();
        toast.error(`Error deleting image: ${errorData.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error("Error deleting image. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error("Error deleting image:", error);
    }
  };
  
  

  // Rendering logic with loading and error states
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
          <div className="p-6 max-w-6xl mx-auto">
            <div className="bg-white shadow-lg rounded-2xl p-8">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center border-b pb-4">
                Gallery
              </h2>

              {/* File Upload Button */}
              <label className="bg-[#FFEFD5] text-black px-4 py-2 rounded cursor-pointer inline-block mb-4">
                Choose Files
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Loading State */}
              {loading && (
                <div className="text-center text-gray-600 py-4">
                  Loading images...
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center text-red-600 py-4">
                  Error: {error}
                </div>
              )}

              {/* Image Grid */}
              {!loading && !error && (
                <div>
                  {images.length === 0 ? (
                    <div className="text-center text-gray-600 py-4">
                      No images uploaded yet
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                      {images.map((imageData) => (
                        <div
                          key={imageData.id}
                          className="relative overflow-hidden rounded-lg shadow-md"
                        >
                          <img
                            src={imageData.image}
                            alt="Uploaded"
                            className="w-full h-48 object-cover cursor-pointer"
                            onClick={() => setPreviewImage(imageData.image)}
                          />
                          <button
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                            onClick={() => handleDeleteImage(imageData)}
                          >
                            <XCircle size={24} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Image Preview */}
      {previewImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative max-w-lg max-h-[80vh] bg-white p-4 rounded-lg shadow-lg">
            <button
              className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1"
              onClick={() => setPreviewImage(null)}
            >
              <XCircle size={30} />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[70vh] rounded-lg mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
