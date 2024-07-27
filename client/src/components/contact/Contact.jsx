import axios from "axios";
import { useState } from "react";
import { useSelector } from 'react-redux';
import { getParamsEnv } from './../../functions/getParamsEnv.js';

const { API_URL_BASE } = getParamsEnv();

export default function ContactForm() {
  const token = useSelector((state) => state?.client.token);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);

    try {
      const response = await axios.post(`${API_URL_BASE}/api/contact/sendContactMail`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log(response);

      if (response.statusText === "OK") {
        alert("Email sent successfully!");
      } else {
        alert("Error sending email. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error sending email. Please try again.");
    }
  };

  return (
    <div className="mt-16 pb-16 h-screen">
      <div className="flex pb-16 bg-gray-200 justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 rounded-lg shadow-lg w-full max-w-xs md:max-w-md border-t-4 border-yellow-400"
        >
          <h2 className="text-lg font-bold mb-4 text-center text-gray-800">Contact Us</h2>
          <p className="text-sm text-center text-gray-600 mb-4">
            Send us your inquiry, we will respond as soon as possible.
          </p>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            ></textarea>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            >
              SEND
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}