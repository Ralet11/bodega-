import React, { useState } from 'react';
import axios from 'axios';
import { getParamsEnv } from '../../functions/getParamsEnv.js';
import toast from 'react-hot-toast';
import ToasterConfig from '../../ui_bodega/Toaster.jsx';

const { API_URL_BASE } = getParamsEnv();

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL_BASE}/api/contact/sendContactMail`, formData);
      toast.success('Your message has been sent successfully!');
      setFormData({ name: '', email: '', message: '' }); // Limpiar el formulario después del éxito
    } catch (error) {
      toast.error('There was an error sending your message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center px-4 md:px-8">
        <div className="w-full max-w-lg p-8 md:p-10 bg-white rounded-2xl shadow-xl transform transition-all hover:scale-105">
          <p className="text-base md:text-lg text-gray-600 mb-6">
            Reach out to us for any questions or support. We're here to assist you.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm h-28 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex justify-center items-center">
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
                  'Send'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToasterConfig />
    </>
  );
};

export default Contact;
