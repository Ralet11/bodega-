import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setDistProd } from '../../redux/actions/actions';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getParamsEnv } from '../../functions/getParamsEnv';

const { API_URL_BASE } = getParamsEnv();

const CustomNextArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div
      className={`${className} next-arrow`}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#00000066',
        borderRadius: '50%',
        width: '25px',
        height: '25px',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        right: '10px',
        zIndex: 1,
        cursor: 'pointer',
      }}
    />
  );
};

const CustomPrevArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div
      className={`${className} prev-arrow`}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#00000066',
        borderRadius: '50%',
        width: '25px',
        height: '25px',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        left: '10px',
        zIndex: 1,
        cursor: 'pointer',
      }}
    />
  );
};

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const ProductSlider = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state?.allDistProducts);
  const [products, setProducts] = useState([]);
  const token = useSelector((state) => state?.client.token);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/distProducts/getAll`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data.slice(0, 8)); // Limit to 8 products
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [token]);

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      setProducts(shuffleArray(allProducts).slice(0, 8)); // Limit to 8 products
    }
  }, [allProducts]);

  const goToDetail = (product) => {
    dispatch(setDistProd(product));
    navigate('/distProduct-detail');
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4, // Cambiado a 4 para avanzar 4 productos a la vez
    dotsClass: "slick-dots slick-thumb",
    customPaging: (i) => <button>{i + 1}</button>,
    appendDots: dots => (
      <div style={{ position: 'absolute', bottom: '-25px', width: '100%' }}>
        <ul style={{ margin: '0 auto', padding: '0', display: 'flex', justifyContent: 'center' }}>{dots}</ul>
      </div>
    ),
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3, // Cambiado a 3 para avanzar 3 productos a la vez
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2, // Cambiado a 2 para avanzar 2 productos a la vez
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1 // Mantener 1 para dispositivos pequeños
        }
      }
    ]
  };

  return (
    <div className="p-4 rounded-lg w-[90%] md:w-[75%] pb-6 md:pb-8 mt-10 bg-gray-100 relative shadow-2xl border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Inspired by the last thing you saw</h2>
      <Slider {...settings}>
        {products.map((product, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg p-3 transition-transform transform hover:scale-105 cursor-pointer flex flex-col border border-gray-100 hover:shadow-2xl"
            onClick={() => goToDetail(product)}
            style={{ height: '400px', maxHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '10px', borderRadius: '10px' }}
          >
            <div style={{ flex: '1 0 auto', marginBottom: '10px' }}>
              <img
                src={product.image1}
                alt={product.name}
                className="w-full h-32 object-cover rounded-lg"
                style={{ marginBottom: '10px' }}
              />
              <h3 className="text-lg font-bold text-center text-gray-800">{product.name}</h3>
            </div>
            <div style={{ flex: '1 0 auto' }}>
              <div className="flex flex-col items-start mb-2">
                <span className="text-xs font-bold text-gray-700 mb-1">PRODUCT PRICE</span>
                <div className="flex items-center justify-between w-full">
                  <p className="text-2xl font-bold text-gray-700">${product.price.toLocaleString()}</p>
                  <span className="line-through text-gray-400 text-sm">${(product.price * 1.1).toLocaleString()}</span>
                  <span className="text-red-500 text-lg font-bold">10% OFF</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-2 text-center">{product.store}</p>
              {product.freeShipping && (
                <p className="text-green-500 text-xs font-semibold text-center">Envío gratis</p>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductSlider;