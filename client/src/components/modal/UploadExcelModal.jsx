import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { getParamsEnv } from "../../functions/getParamsEnv";
import { useSelector } from 'react-redux';
import ToasterConfig from '../../ui_bodega/Toaster';
import toast from 'react-hot-toast';

const { API_URL_BASE } = getParamsEnv();

function UploadExcelModal({ show, handleClose, selectedCategory }) {
  const token = useSelector((state) => state?.client.token);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post(`${API_URL_BASE}/api/products/excellUploadInCatgeory/${selectedCategory}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          const { createdProducts, failedProducts } = response.data;

          if (createdProducts.length > 0 && failedProducts.length === 0) {
            toast.success(`${createdProducts.length} products were successfully uploaded.`);
          } else if (createdProducts.length > 0 && failedProducts.length > 0) {
            toast.custom((t) => (
              <div className={`bg-orange-500 text-white p-3 rounded ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
                <p>{createdProducts.length} products were created.</p>
                <p>The following products couldn't be created:</p>
                <ul>
                  {failedProducts.map((product, index) => (
                    <li key={index}>{product}</li>
                  ))}
                </ul>
              </div>
            ), { duration: 5000 });
          } else {
            toast.error("No products were created due to errors.");
          }

          const updatedProductsResponse = await axios.get(`${API_URL_BASE}/api/products/get/${selectedCategory}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          toast.error('Error uploading file');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error('Server error. Could not upload the file.');
      }
    }
  };

  const preHandleClose = () => {
    handleClose();
    setFile(null);
  };

  return (
    show && (
      <>
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white w-full max-w-md mx-2 md:mx-auto rounded-lg shadow-lg relative max-h-screen overflow-auto">
            <div className="bg-blue-400 p-2 rounded-t-lg">
              <h2 className="text-sm font-semibold text-white">Upload Excel</h2>
            </div>
            <div className="p-4">
              <form onSubmit={handleUpload}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-xs">Choose file</label>
                  <input
                    type="file"
                    accept=".xls,.xlsx"
                    onChange={handleFileChange}
                    className="w-full p-1 border border-gray-300 rounded text-xs"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-400 text-white py-1 px-2 rounded hover:bg-blue-600 w-full text-xs"
                >
                  Upload
                </button>
              </form>
            </div>
            <div className="bg-gray-100 px-3 py-2 flex justify-end rounded-b-lg">
              <button onClick={preHandleClose} className="text-blue-500 hover:underline cursor-pointer text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
        <ToasterConfig />
      </>
    )
  );
}

UploadExcelModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedCategory: PropTypes.number.isRequired,
};

export default UploadExcelModal;
