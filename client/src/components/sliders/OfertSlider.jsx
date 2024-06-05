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
      style={{ display: 'block', background: '#00000066', borderRadius: '50%' }}
    />
  );
};

const CustomPrevArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div
      className={`${className} prev-arrow`}
      onClick={onClick}
      style={{ display: 'block', background: '#00000066', borderRadius: '50%' }}
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
    slidesToShow: 5,
    slidesToScroll: 1,
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
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="p-4 rounded-lg w-[90%] md:w-[79%] pb-6 md:pb-10 mt-10 bg-white relative">
      <h2 className="text-lg font-bold mb-2">Inspired by the last thing you saw</h2>
      <Slider {...settings}>
        {products.map((product, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg p-2 transition-transform transform hover:scale-105 cursor-pointer flex flex-col"
            onClick={() => goToDetail(product)}
            style={{ height: '250px' }}
          >
            <img src={product.image1} alt={product.name} className="w-full h-20 md:h-40 object-cover rounded-t-lg" />
            <div className="p-2 flex-grow flex flex-col justify-between">
              <h3 className="text-xs font-semibold mb-1">{product.name}</h3>
              <p className="text-sm font-bold text-gray-700 mb-2">${product.price.toLocaleString()}</p>
              <p className="text-xs text-red-500 mb-1">
                <span className="line-through">${(product.price * 1.1).toLocaleString()}</span> 10% OFF
              </p>
              <p className="text-xs text-gray-500 mb-1">{product.store}</p>
              {product.freeShipping && (
                <p className="text-green-500 text-xs font-semibold">Envío gratis</p>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductSlider;