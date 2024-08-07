import React from 'react';

const Contact = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300 flex items-center justify-center">
      <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-2xl transform transition-all hover:scale-105">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6">Contact Us</h1>
        <p className="text-lg text-gray-600 mb-8">
          Reach out to us for any questions or support. We're here to assist you.
        </p>
        <div className="space-y-6">
          <input
            type="text"
            placeholder="Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-yellow-500"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-yellow-500"
          />
          <textarea
            placeholder="Message"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm h-32 focus:outline-none focus:ring-4 focus:ring-yellow-500"
          />
          <button className="w-full px-4 py-3 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
