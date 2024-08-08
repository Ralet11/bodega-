import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import 'tailwindcss/tailwind.css';
import CreateDiscountModal from '../modal/CreateDiscountModal';
import { getParamsEnv } from '../../functions/getParamsEnv';

const { API_URL_BASE } = getParamsEnv();

const Discounts = () => {
  const [showAddDiscountModal, setShowAddDiscountModal] = useState(false);
  const [aux, setAux] = useState(false);
  const [discounts, setDiscounts] = useState(null);
  const [products, setProducts] = useState({});
  const shop = useSelector((state) => state?.activeShop);
  const token = useSelector((state) => state?.client.token);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/discounts/getByLocalId/${shop}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDiscounts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDiscounts();
  }, [aux]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/products/getByLocalId/${shop}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddDiscount = () => {
    setShowAddDiscountModal(true);
  };

  const handleCloseModal = () => {
    setShowAddDiscountModal(false);
  };

  const getDeliveryText = (delivery) => {
    switch (delivery) {
      case 0:
        return "Pick-up / delivery";
      case 1:
        return "Order-in";
      case 3:
        return "All";
      default:
        return "";
    }
  };

  const DiscountCard = ({ discount }) => {
    const newPrice = (discount.product.price * (1 - discount.percentage / 100)).toFixed(2);

    return (
      <div className="max-w-xs rounded-lg overflow-hidden shadow-lg m-2 bg-white transform transition duration-500 hover:scale-105 hover:shadow-xl text-xs">
        <img className="w-full h-24 object-cover" src={discount.image} alt={discount.productName} />
        <div className="px-2 py-1">
          <div className="font-bold text-sm mb-1 text-gray-800">{discount.productName}</div>
          <p className="text-gray-600 text-xs mb-1">
            {getDeliveryText(discount.delivery)}
          </p>
          <p className="text-gray-600 text-xs mb-1">
            Min Purchase: ${discount.minPurchaseAmount}
          </p>
          <p className="text-gray-600 text-xs mb-1">
            Discount: {discount.percentage}% (up to ${discount.maxDiscountAmount})
          </p>
          <p className="text-gray-600 text-xs mb-1">
            Valid until: {new Date(discount.limitDate).toLocaleDateString()}
          </p>
          <p className="text-gray-600 text-xs mb-1">
            Product: {discount.product.name} - ${discount.product.price}
          </p>
        </div>
        <div className="px-2 pt-1 pb-2 flex flex-wrap justify-between">
          <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#{discount.product_id}</span>
          <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">#{discount.category_id}</span>
        </div>
        <div className="px-2 py-1 flex justify-between items-center">
          <p className="text-red-500 line-through text-xs">${discount.product.price}</p>
          <p className="text-green-500 font-bold text-sm">${newPrice}</p>
        </div>
      </div>
    );
  };

  const DiscountList = ({ discounts }) => {
    return (
      <div className="flex flex-wrap justify-center">
        {discounts.map(discount => (
          <DiscountCard key={discount.id} discount={discount} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-2">
      <div className="pb-4 text-center mt-16">
        <h3 className="text-xs md:text-sm font-bold mt-2 text-gray-800">Discounts</h3>
        <hr className="my-2 border-t border-gray-300 mx-auto w-1/2" />
      </div>
      {discounts && <DiscountList discounts={discounts} />}
      <div className="text-center mt-2">
        <button onClick={handleAddDiscount} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-2 text-xs">Add New Discount</button>
      </div>
      {showAddDiscountModal && <CreateDiscountModal products={products} aux={aux} setAux={setAux} setShowAddDiscountModal={setShowAddDiscountModal} />}
    </div>
  );
};

export default Discounts;
