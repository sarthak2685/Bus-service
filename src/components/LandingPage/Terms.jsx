import React from "react";

const Terms = () => {
  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-black mb-8">
          Terms & Conditions
        </h1>
        <p className="text-center text-gray-600 mb-8">
          📅 Effective Date: March 20, 2025
        </p>

        {/* Introduction */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">
            1. Introduction
          </h2>
          <p className="text-gray-700 leading-7">
            Our service provides a dedicated bus transportation system for
            students, ensuring safe and reliable travel. Payments for the
            service are managed through a secure payment gateway for parents.
          </p>
        </div>

        {/* Services Offered */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">
            2. Services Offered
          </h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Student bus transportation services.</li>
            <li>Safe and secure route planning.</li>
            {/* <li>Real-time tracking of buses.</li> */}
            <li>Automated payment processing for parents.</li>
            <li>Customer support for transport-related queries.</li>
          </ul>
        </div>

        {/* Client Responsibilities */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">
            3. Responsibilities
          </h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>
              Parents must ensure timely payments for uninterrupted service.
            </li>
            <li>Students must adhere to bus safety rules and guidelines.</li>
            <li>
              Any route changes or special requests should be communicated in
              advance.
            </li>
          </ul>
        </div>

        {/* Payment Terms */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">
            4. Payment Terms
          </h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>
              💰 Payments must be made in advance through the designated payment
              gateway.
            </li>
            <li>
              💰 Late payments may result in temporary suspension of bus
              service.
            </li>
            {/* <li>
              💰 No refunds are issued for missed rides due to student absence.
            </li> */}
          </ul>
        </div>

        {/* Refund Policy */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">
            5. Refund Policy
          </h2>
          <p className="text-gray-700 leading-7">
            🔄 Refunds may only be issued in exceptional cases, such as service
            discontinuation by the provider. Requests must be submitted in
            writing.
          </p>
        </div>

        {/* Service Termination */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">
            6. Service Termination
          </h2>
          <p className="text-gray-700 leading-7">
            The service provider reserves the right to terminate transportation
            services in cases of non-payment, violation of bus safety policies,
            or misconduct by students.
          </p>
        </div>

        {/* Governing Law */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">
            7. Governing Law
          </h2>
          <p className="text-gray-700 leading-7">
            These terms are governed by the laws of Bihar.
          </p>
        </div>

        {/* Contact Information */}
        <div className="pb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">
            📞 Contact Information
          </h2>
          <p className="text-gray-700 leading-7">For inquiries, contact:</p>
          <p className="text-gray-700 mt-2">
            📧 Email:
            <a
              href="mailto:info@capitalservice.com"
              className="text-blue-600 ml-1 hover:underline"
            >
              info@capitalservice.com
            </a>
          </p>
          <p className="text-gray-700 mt-2">📱 Phone: +91 82105 84092</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
