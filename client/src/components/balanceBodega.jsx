import React, { useEffect, useState } from 'react';
import Modal from './Modal'; // Asegúrate de tener el componente Modal
import { useSelector } from 'react-redux';
import axios from 'axios';
import { getParamsEnv } from '../functions/getParamsEnv';

const { API_URL_BASE } = getParamsEnv();

const RequestOrderModal = ({ isOpen, onRequestClose, onSubmit }) => {
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const client = useSelector((state) => state?.client.client);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    let errors = {};

    if (!file) {
      errors.file = 'Please upload a file.';
    }

    if (!amount) {
      errors.amount = 'Please enter an amount in dollars.';
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('comment', comment);
    formData.append('amount', amount);
    formData.append('id', client.id);

    setIsLoading(true);

    try {
      await onSubmit(formData);
      handleModalClose();
    } catch (error) {
      console.error('Error submitting the order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setFile(null);
    setComment('');
    setAmount('');
    setErrors({});
    onRequestClose();
  };

  return (
    <>
      {isOpen && (
        <Modal onRequestClose={handleModalClose} contentLabel="Request New Order">
          <h2 className="text-xl font-semibold mb-4">Request New Order</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
              Upload transference comprobant
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
            {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
          </div>
          <div className="mb-4 w-1/3">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              Amount in usd
            </label>
            <input
              id="amount"
              type="number"
              placeholder="Amount in dollars"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded no-spinner"
            />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
            <style jsx>{`
              /* Chrome, Safari, Edge, Opera */
              .no-spinner::-webkit-outer-spin-button,
              .no-spinner::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
              }

              /* Firefox */
              .no-spinner[type='number'] {
                -moz-appearance: textfield;
              }
            `}</style>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comment">
              Comment
            </label>
            <textarea
              id="comment"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleModalClose}
              className="text-black font-semibold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 2.42.86 4.63 2.291 6.29l1.709-1.71z"
                  ></path>
                </svg>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

const Dashboard = ({ orders, onRequestNewOrder }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const client = useSelector((state) => state?.client.client);
  const [clientNow, setClientNow] = useState(null);
  const token = useSelector((state) => state?.client.token);
  const [balanceRequests, setBalanceRequests] = useState([]);

  const fetchBalanceRequest = async () => {
    try {
      const response = await axios.get(`${API_URL_BASE}/api/balanceRequest/getByClient/${client.id}`, {
        headers: { authorization: `Bearer ${token}` }
      });
      console.log(response.data, "request");
      setBalanceRequests(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBalanceRequest();
  }, []);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/clients/${client.id}`, {
          headers: { authorization: `Bearer ${token}` }
        });
        console.log(response.data, "productos ready");
        setClientNow(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchClient();
  }, []);

  const handleRequestNewOrder = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmitOrder = async (formData) => {
    try {
      const response = await axios.post(`${API_URL_BASE}/api/up-image/addNewBalance`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${token}`
        }
      });
      console.log('Order submitted:', response.data);
      fetchBalanceRequest(); // Vuelve a obtener las solicitudes de balance después de enviar una nueva orden
      handleModalClose(); // Cierra el modal
    } catch (error) {
      console.error('Error submitting the order:', error);
    }
  };

  return (
    <div className="container md:h mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white p-4 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-black">Order Requests</h2>
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
              onClick={handleRequestNewOrder}
            >
              Request New Order
            </button>
          </div>
          {balanceRequests.length === 0 ? (
            <p className="text-gray-500">No orders available.</p>
          ) : (
            <ul className="space-y-4">
              {balanceRequests.map((order, index) => (
                <li key={index} className="flex items-center bg-gray-100 p-3 rounded-lg shadow-md">
                  <img
                    src={order.img}
                    alt="Order"
                    className="w-12 h-12 rounded-lg mr-4 object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-black font-medium">Date: {order.date}</p>
                    <p className={`mt-2 px-2 py-1 rounded text-white text-xs font-medium inline-block ${
                      order.statusBalance.status === 'accepted' ? 'bg-green-500' :
                      order.statusBalance.status === 'pending' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}>
                      {order.statusBalance.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex-2 w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg flex flex-col justify-center items-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Account Balance</h2>
          <p className="text-3xl font-bold text-green-500">${clientNow && clientNow.client.balance}</p>
        </div>
      </div>

      <RequestOrderModal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        onSubmit={handleSubmitOrder}
      />
    </div>
  );
};

const exampleOrders = [
  {
    image: 'https://via.placeholder.com/150',
    date: '2023-01-01T12:00:00Z',
    status: 'accepted'
  },
  {
    image: 'https://via.placeholder.com/150',
    date: '2023-01-02T12:00:00Z',
    status: 'pending'
  },
  {
    image: 'https://via.placeholder.com/150',
    date: '2023-01-03T12:00:00Z',
    status: 'rejected'
  }
];

const App = () => (
  <Dashboard balance={1000.00} orders={exampleOrders} />
);

export default App;
