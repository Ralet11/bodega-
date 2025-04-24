import React, { useState } from "react";
import axios from "axios";
import { getParamsEnv } from "../../functions/getParamsEnv.js";
import toast from "react-hot-toast";
import ToasterConfig from "../../ui_bodega/Toaster.jsx";

const { API_URL_BASE } = getParamsEnv();

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL_BASE}/api/contact/sendContactMail`, formData);
      toast.success("Your message has been sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("There was an error sending your message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Form Section (2/3 of the width) */}
            <div className="md:col-span-2 p-8 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Contact Us</h2>
              <p className="text-gray-600 mb-6">
                We would love to hear from you. Please fill out the form below and we will get
                in touch with you soon.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                             focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                             focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Message"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                             focus:outline-none focus:ring-2 focus:ring-yellow-500 h-24"
                  required
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg 
                             shadow-md hover:bg-yellow-600 transition duration-300 flex 
                             items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        ></path>
                      </svg>
                      Sending...
                    </div>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>

            {/* Illustration Section (1/3 of the width) */}
            <div className="hidden md:flex bg-yellow-50 items-center justify-center p-8">
              <img
                src="https://res.cloudinary.com/doqyrz0sg/image/upload/v1744224388/sobre_f6f8fm.png"
                alt="Contact Illustration"
                className="max-h-56"
              />
            </div>
          </div>
        </div>
      </div>
      <ToasterConfig />
    </>
  );
};

export default Contact;
