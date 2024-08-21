import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import axios from 'axios';
import DiscountCard from './DiscountCard';
import { getParamsEnv } from '../../../functions/getParamsEnv';
import { PlusCircle, Trash } from 'lucide-react';

const { API_URL_BASE } = getParamsEnv();

function DiscountCards({
  selectedCategory,
  discounts,
  setDiscounts,
  searchTerm,
  setSearchTerm,
  handleCardClick,
  selectedDiscount,
  setShowNewDiscountModal,
}) {
  const token = useSelector((state) => state?.client.token);

  const filteredDiscounts = discounts.filter((discount) =>
    discount.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenNewDiscountModal = () => {
    setShowNewDiscountModal(true);
  };

  const handleDeleteDiscount = async (discountId) => {
    try {
      await axios.delete(`${API_URL_BASE}/api/discounts/delete/${discountId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiscounts(prevDiscounts => prevDiscounts.filter(discount => discount.id !== discountId));
    } catch (error) {
      console.error('Error al eliminar el descuento:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-2 py-1 placeholder-gray-400 text-gray-700 bg-white rounded-full text-xs border-0 shadow outline-none focus:outline-none focus:ring w-full md:w-[200px]"
        />
        <div className="flex space-x-2">
          <button
            className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-500 font-semibold border border-blue-500 rounded-md bg-transparent hover:bg-blue-500 hover:text-white transition-colors duration-200"
            onClick={handleOpenNewDiscountModal}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Discount</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDiscounts.length === 0 ? (
          <p className="text-xs">No hay descuentos disponibles</p>
        ) : (
          filteredDiscounts.map((discount) => (
            <DiscountCard
              key={discount.id}
              discount={discount}
              isSelected={discount.id === selectedDiscount?.id}
              handleClick={handleCardClick}
              handleDelete={() => handleDeleteDiscount(discount.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

DiscountCards.propTypes = {
  discounts: PropTypes.array.isRequired,
  setDiscounts: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  handleCardClick: PropTypes.func.isRequired,
  selectedDiscount: PropTypes.object,
  selectedCategory: PropTypes.number,
  setShowNewDiscountModal: PropTypes.func.isRequired,
};

export default DiscountCards;