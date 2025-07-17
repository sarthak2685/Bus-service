import React, { useState, useEffect } from "react";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Initialize EmailJS when component mounts
  useEffect(() => {
    emailjs.init('ogUx0NT98KbPRK6QJ');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await emailjs.send(
        'service_03kz58b', // Your service ID
        'template_739o0hg', // Your template ID
        formData
      );

      if (response.status === 200) {
        setSubmitStatus({
          success: true,
          message: 'Message sent successfully! We will get back to you soon.'
        });
        setFormData({
          name: "",
          email: "",
          number: "",
          message: ""
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      setSubmitStatus({
        success: false,
        message: error.message || 'An error occurred while sending your message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="contact-page min-h-screen bg-white px-6 py-12 flex flex-col items-center relative overflow-hidden"
      id="contact"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20 z-0"></div>
      <h1 className="text-4xl font-bold text-orange-500 mb-8 z-10">
        Contact Us
      </h1>

      <div className="max-w-4xl w-full bg-gray-50 mt-16 rounded-lg shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-600 mb-4">
            Whether you have questions about our services or need assistance,
            feel free to reach out!
          </p>
          <div className="flex items-center mb-3 text-gray-700">
            <FaPhoneAlt className="text-orange-500 mr-3" />
            <span>+91 9155286099</span>
          </div>
          <div className="flex items-center mb-3 text-gray-700">
            <FaEnvelope className="text-orange-500 mr-3" />
            <span>capitalbusserv@gmail.com</span>
          </div>
        </div>

        {/* Contact Form */}
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="number"
            placeholder="Your Number"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
            value={formData.number}
            onChange={handleChange}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 h-32"
            required
            value={formData.message}
            onChange={handleChange}
          ></textarea>
          
          {submitStatus && (
            <div className={`p-3 rounded-lg ${submitStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {submitStatus.message}
            </div>
          )}
          
          <button
            type="submit"
            className="bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;