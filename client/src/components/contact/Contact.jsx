import React, { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
  };

  return (
    <div className="mt-20 pb-20 h-screen">
      <div className="pb-5 text-center">
        <h3 className="text-lg md:text-2xl font-bold mt-2 text-gray-800">Contact</h3>
        <hr className="my-4 border-t border-gray-300 mx-auto w-1/2" />
      </div>
      <div className="flex pb-20 bg-gray-200 justify-center p-4 md:p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-4xl border-t-4 border-yellow-400"
        >
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-gray-800">Contact Us</h2>
          <div className="mb-3 md:mb-4">
            <label className="block text-gray-700 text-sm md:text-base">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div className="mb-3 md:mb-4">
            <label className="block text-gray-700 text-sm md:text-base">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          <div className="mb-3 md:mb-4">
            <label className="block text-gray-700 text-sm md:text-base">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div className="mb-4 md:mb-6">
            <label className="block text-gray-700 text-sm md:text-base">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded h-24 md:h-32 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
            ></textarea>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="px-4 md:px-6 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              SEND
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
