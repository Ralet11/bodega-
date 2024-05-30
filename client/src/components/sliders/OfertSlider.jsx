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
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const sampleProducts = [
    {
      name: "Notebook Hp 255 G9 R5",
      price: 749999,
      image1: "https://source.unsplash.com/random/400x300?laptop1",
      store: "Store A",
      discount: 15,
      originalPrice: 889999,
      freeShipping: true
    },
    {
      name: "Notebook Asus X515ea",
      price: 705999,
      image1: "https://source.unsplash.com/random/400x300?laptop2",
      store: "Store B",
      discount: 3,
      originalPrice: 730999,
      freeShipping: true
    },
    {
      name: "Notebook Samsung Galaxy",
      price: 999999,
      image1: "https://source.unsplash.com/random/400x300?laptop3",
      store: "Store C",
      discount: 26,
      originalPrice: 1350000,
      freeShipping: true
    },
    {
      name: "Notebook Banghó Max L5",
      price: 739999,
      image1: "https://source.unsplash.com/random/400x300?laptop4",
      store: "Store D",
      discount: 3,
      originalPrice: 764999,
      freeShipping: true
    },
    {
      name: "Notebook Lenovo Ideapad",
      price: 441799,
      image1: "https://source.unsplash.com/random/400x300?laptop5",
      store: "Store E",
      discount: 10,
      originalPrice: 495999,
      freeShipping: true
    },
    {
      name: "Notebook Banghó Intel Core",
      price: 1023999,
      image1: "https://source.unsplash.com/random/400x300?laptop6",
      store: "Store F",
      discount: 0,
      originalPrice: 1023999,
      freeShipping: true
    }
  ];

  return (
    <div className="p-10 rounded-lg w-[80%] mt-20 bg-white relative">
      <h2 className="text-2xl font-bold mb-4">Inspirado en lo último que viste</h2>
      <Slider {...settings}>
        {sampleProducts.map((product, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105 cursor-pointer flex flex-col"
            onClick={() => goToDetail(product)}
            style={{ height: '400px' }}
          >
            <img src={product.image1} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
            <div className="p-4 flex-grow flex flex-col justify-between">
              <h3 className="text-sm font-semibold mb-1">{product.name}</h3>
              <p className="text-xl font-bold text-gray-700 mb-2">${product.price.toLocaleString()}</p>
              {product.discount > 0 && (
                <p className="text-sm text-red-500 mb-1">
                  <span className="line-through">${product.originalPrice.toLocaleString()}</span> {product.discount}% OFF
                </p>
              )}
              <p className="text-sm text-gray-500 mb-4">{product.store}</p>
              {product.freeShipping && (
                <p className="text-green-500 text-sm font-semibold">Envío gratis</p>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductSlider;
