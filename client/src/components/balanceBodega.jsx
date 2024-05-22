import React, { useEffect, useState } from 'react';
import Modal from './Modal'; // Ensure you have the Modal component
import { useSelector } from 'react-redux';
import axios from 'axios';
import { getParamsEnv } from '../functions/getParamsEnv';

const {API_URL_BASE} = getParamsEnv();

const RequestOrderModal = ({ isOpen, onRequestClose, onSubmit }) => {
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    onSubmit({ file, comment });
    onRequestClose();
  };

  return (
    <>
      {isOpen && (
        <Modal onRequestClose={onRequestClose} contentLabel="Request New Order">
          <h2 className="text-xl font-semibold mb-4">Request New Order</h2>
          <input
            type="file"
            onChange={handleFileChange}
            className="mb-4"
          />
          <textarea
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
          <div className="flex justify-end">
            <button
              onClick={onRequestClose}
              className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded"
            >
              Submit Request
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

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/clients/${client.id}`, {
          headers: {
            authorization: `Bearer ${token}`
          }
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

  const handleSubmitOrder = (order) => {
    console.log('Order submitted:', order);
  };

  console.log(clientNow);

  return (
    <div className="container mx-auto p-6">
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
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders available.</p>
          ) : (
            <ul className="space-y-4">
              {orders.map((order, index) => (
                <li key={index} className="flex items-center bg-gray-100 p-3 rounded-lg shadow-md">
                  <img
                    src={order.image}
                    alt="Order"
                    className="w-12 h-12 rounded-lg mr-4 object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-black font-medium">Date: {new Date(order.date).toLocaleDateString()}</p>
                    <p className={`mt-2 px-2 py-1 rounded text-white text-xs font-medium inline-block ${
                      order.status === 'accepted' ? 'bg-green-500' :
                      order.status === 'pending' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex-2 w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg flex flex-col justify-center items-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Account Balance</h2>
          <p className="text-3xl font-bold text-green-500">${clientNow && clientNow.balance.toFixed(2)}</p>
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