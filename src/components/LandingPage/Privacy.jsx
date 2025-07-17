import React from "react";

const Privacy = () => {
  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-black mb-8">
          Privacy Policy
        </h1>
        <p className="text-center text-gray-600 mb-8">
          📅 Effective Date: March 20, 2025
        </p>

        {/* Information We Collect */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">
            1. Information We Collect
          </h2>
          <p className="text-gray-700 mb-4 leading-7">
            📝 We collect client details such as name, email, phone number, and
            project-related information to facilitate our services.
          </p>
          <p className="text-gray-700 leading-7">
            🔒 Payment Information: We do not store payment details. All
            transactions are processed securely via third-party payment
            gateways.
          </p>
        </div>

        {/* How We Use Information */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">
            2. How We Use Information
          </h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Project execution and service delivery.</li>
            <li>Communication regarding ongoing projects.</li>
            <li>Enhancing and improving our services.</li>
            <li>Internal analytics and performance tracking.</li>
          </ul>
          <p className="text-gray-700 leading-7 mt-4">
            We do <strong>not</strong> sell or share client data with third
            parties for marketing purposes.
          </p>
        </div>

        {/* Data Security */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">
            3. Data Security
          </h2>
          <p className="text-gray-700 leading-7">
            🔐 We implement industry-standard security measures to protect
            client data from unauthorized access, misuse, or disclosure.
            However, while we strive for absolute security, no digital platform
            can guarantee
            <strong> 100% protection</strong>.
          </p>
        </div>

        {/* Third-Party Services */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">
            4. Third-Party Services
          </h2>
          <p className="text-gray-700 leading-7">
            🌐 Capital Bus Service may utilize third-party tools such as hosting
            services, analytics platforms, or marketing integrations. While we
            choose reputable service providers, we are{" "}
            <strong>not responsible</strong>
            for their individual privacy policies or data handling practices.
          </p>
        </div>

        {/* Client Rights */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">
            5. Client Rights
          </h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>
              Request <strong>access, modification, or deletion</strong> of
              their personal data.
            </li>
            <li>Opt-out of marketing communications.</li>
            <li>Raise concerns regarding their data privacy.</li>
          </ul>
          <p className="text-gray-700 leading-7 mt-4">
            📩 To exercise these rights, contact us at
            <a
              href="mailto:info@capitalservice.com"
              className="text-blue-600 ml-1 hover:underline"
            >
              capitalbusserv@gmail.com
            </a>
          </p>
        </div>

        {/* Policy Updates */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">
            6. Policy Updates
          </h2>
          <p className="text-gray-700 leading-7">
            🔄 We may update this Privacy Policy periodically to reflect service
            changes or legal requirements. Clients will be notified of
            <strong> significant updates</strong> via email or our website.
          </p>
        </div>

        {/* Contact Information */}
        <div className="pb-6 mb-6">
          <h2 className="text-2xl font-semibold text-black mb-4">
            📞 Contact Information
          </h2>
          <p className="text-gray-700 leading-7">
            For any privacy-related inquiries, feel free to reach out:
          </p>
          <p className="text-gray-700 mt-2">
            📧 Email:
            <a
              href="mailto:info@capitalservice.com"
              className="text-blue-600 ml-1 hover:underline"
            >
              capitalbusserv@gmail.com
            </a>
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

export default Privacy;
