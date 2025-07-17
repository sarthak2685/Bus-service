import React from "react";

const Refund = () => {
  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-black mb-8">
          Refund Policy
        </h1>
        <p className="text-center text-gray-600 mb-8">
          📅 Effective Date: March 20, 2025
        </p>

        {/* Refund Policy */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h3 className="text-xl font-semibold text-black mt-4 mb-2">
            1. Advance Payment Window
          </h3>
          <p className="text-gray-700 leading-7">
            🔄 User may make an advance payment.
          </p>
          <hr className="mt-5" />

          <h3 className="text-xl font-semibold text-black mt-4 mb-2">
            2. No Refund
          </h3>
          <p className="text-gray-700 leading-7">
            🚫 No refund shall be granted except in case of discontinuation of
            service.
          </p>

          <hr className="mt-5" />

                 <h3 className="text-xl font-semibold text-black mt-4 mb-2">
            3. Refund
          </h3>
          <p className="text-gray-700 leading-7">
            Clients may request a refund of the payment within 7 days of
            making the payment if there is any problem from us.
          </p>

          <hr className="mt-5" />

          <h3 className="text-xl font-semibold text-black mt-4 mb-2">
            📞 Contact Information
          </h3>
          <p className="text-gray-700 leading-7">
            For any refund-related inquiries, reach out to us:
          </p>
          <p className="text-gray-700 mt-2">
            📧 Email:
            <a
              href="mailto:info@capitalservice.com"
              className="text-blue-600 ml-1 hover:underline"
            >
              capitalbusserv@gmail.com            </a>
          </p>
          <p className="text-gray-700 mt-2">📱 Phone: 📞 +91 9155286099</p>
        </div>

        <footer className="mt-12 text-center">
          <p className="text-gray-700">
            Thank you for choosing Capital Bus Service 🚀
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Refund;
