import React from 'react';
import { BsWhatsapp } from 'react-icons/bs';

const WhatsAppButton = () => {
  const openWhatsApp = () => {
    const phoneNumber = '919155286099';
    const message = 'Hello, I have questions about your bus services. Could you please provide information about:\n\n- Available routes and schedules\n- Fee prices\n- Booking process\n\nThank you!';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <div 
        className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-green-600 transition-colors duration-300 animate-bounce relative"
        onClick={openWhatsApp}
      >
        <BsWhatsapp className="text-white text-2xl" />
        <span className="sr-only">WhatsApp</span>
        
        {/* Tooltip */}
        <div className="absolute right-16 bottom-1/2 translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Chat with us!!
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-800 transform rotate-45"></div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppButton;