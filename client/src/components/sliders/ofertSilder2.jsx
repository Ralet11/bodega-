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

const ProductSlider = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [token]);

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

  const sampleProducts = [
    {
        name: "RAW King Size Rolling Papers",
        price: 2.99,
        image1: "https://source.unsplash.com/random/400x300?rollingpapers",
        store: "Store A",
        discount: 0,
        originalPrice: 2.99,
        freeShipping: false
    },
    {
        name: "Glass Bong 12-inch",
        price: 59.99,
        image1: "https://source.unsplash.com/random/400x300?bong",
        store: "Store B",
        discount: 10,
        originalPrice: 66.66,
        freeShipping: true
    },
    {
        name: "Grinder 4-Piece",
        price: 19.99,
        image1: "https://source.unsplash.com/random/400x300?grinder",
        store: "Store C",
        discount: 5,
        originalPrice: 21.05,
        freeShipping: true
    },
    {
        name: "Silicone Dab Rig",
        price: 39.99,
        image1: "https://source.unsplash.com/random/400x300?dabrig",
        store: "Store D",
        discount: 15,
        originalPrice: 47.05,
        freeShipping: true
    },
    {
        name: "Hemp Wick Spool",
        price: 5.99,
        image1: "https://source.unsplash.com/random/400x300?hempwick",
        store: "Store E",
        discount: 0,
        originalPrice: 5.99,
        freeShipping: false
    },
    {
        name: "Ceramic Chillum",
        price: 14.99,
        image1: "https://source.unsplash.com/random/400x300?chillum",
        store: "Store F",
        discount: 10,
        originalPrice: 16.66,
        freeShipping: true
    },
    {
        name: "Cannabis Storage Jar",
        price: 24.99,
        image1: "https://source.unsplash.com/random/400x300?storagejar",
        store: "Store G",
        discount: 20,
        originalPrice: 31.24,
        freeShipping: true
    }
];

  return (
    <div className="p-4 rounded-lg w-[90%] md:w-[79%] pb-6 md:pb-10 mt-10 bg-white relative">
      <h2 className="text-lg font-bold mb-2">Best offerts</h2>
      <Slider {...settings}>
        {sampleProducts.map((product, index) => (
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
              {product.discount > 0 && (
                <p className="text-xs text-red-500 mb-1">
                  <span className="line-through">${product.originalPrice.toLocaleString()}</span> {product.discount}% OFF
                </p>
              )}
              <p className="text-xs text-gray-500 mb-1">{product.store}</p>
              {product.freeShipping && (
                <p className="text-green-500 text-xs font-semibold">Free delivery</p>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductSlider;