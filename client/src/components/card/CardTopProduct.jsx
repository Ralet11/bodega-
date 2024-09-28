import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setDistProd } from '../../redux/actions/actions';
import { getParamsEnv } from '../../functions/getParamsEnv';

const { API_URL_BASE } = getParamsEnv();

const TopProducts = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.client.token)

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/distProducts/getAll`,{
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
       
        setAllProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllProducts();
  }, []);

  const handleHover = (index) => {
    setHoveredIndex(index);
  };

  const goToDetail = (distProduct) => {
    dispatch(setDistProd(distProduct));
    navigate('/distProduct-detail');
  };

  return (
    <div>
      {allProducts.slice(0, 3).map((offer, index) => (
        <div key={index} className="flex bg-white rounded-lg overflow-hidden  mb-4 ${hoveredIndex === index ? 'hovered' : ''}">
          <div className="w-1/2">
            <div className="relative">
              <img className="w-full h-32 object-cover rounded-t-lg" src={hoveredIndex === index ? offer.image2 : offer.image1} alt={offer.name} />
              
            </div>
          </div>
          <div className="w-1/2 p-4">
            <h3 className="font-bold mb-2">{offer.name}</h3>
            <p className="text-black font-bold text-2xl mb-2">${offer.price}</p>
            {/* Agrega aquí la lista de características */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopProducts;
