import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../../redux/actions/actions';
import Title from '../../ui_bodega/Title';
import ThumbnailImage from '../../ui_bodega/ThumbnailImage';
import CheckIcon from '../../icons/checkIcon';
import SearchBarCommerce from '../SearchBarCommerce/SearchBarCommerce';
import CartIcon from '../CartIcon';
import GoBackArrow from '../GobackArrow';

const DistProdCard = () => {
    const dispatch = useDispatch();
    const distProduct = useSelector((state) => state?.selectedDistProd);
    const [product, setProduct] = useState(distProduct || "");
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        setProduct(distProduct);
    }, [distProduct]);

    const handleThumbnailClick = (imageSrc) => {
        setSelectedImage(imageSrc);
    };

    const itemToCart = () => {
        dispatch(addToCart(product));
    };

    return (
        <>
            <GoBackArrow />
            <div className='bg-white rounded-lg mx-auto mt-[-1px] w-2/3'>
                <SearchBarCommerce />
            </div>
            <div className="flex justify-center items-center my-6">

                <div className="bg-white rounded-xl shadow-2xl max-w-screen-xl w-full p-12">
                    <div className="flex flex-col md:flex-row">
                        <div className="w-1/4 flex flex-col items-center space-y-4">

                            {[product.image1, product.image2, product.image3].map((image, index) => (
                                <ThumbnailImage
                                    key={index}
                                    src={image}
                                    alt={`Product Thumbnail ${index + 1}`}
                                    onClick={() => handleThumbnailClick(image)}

                                    className="cursor-pointer rounded-lg shadow-md hover:shadow-lg"

                                />
                            ))}
                        </div>
                        <div className="w-full md:w-1/2 flex justify-center items-center p-4">
                            <img
                                src={selectedImage || product.image1}
                                alt="Product"
                                className="object-contain w-full h-full rounded-lg shadow-lg"
                            />
                        </div>

                        <div className="w-full md:w-1/2 flex flex-col justify-start space-y-6 md:ml-8 mt-8 md:mt-0">
                            <div className="text-center">
                                <h1 className="text-5xl font-bold text-gray-800 mb-4">{product.name}</h1>
                                <div className="flex justify-center items-center">
                                    <h2 className="text-4xl text-gray-800 font-bold">{`$${product.price}`}</h2> 
                                    <span className="text-green-600 text-2xl font-semibold ml-4">10% discount</span>
                                </div>
                            </div>

                            <div className="border-b border-gray-200 pb-4">
                                <div className="ml-2 mt-2 flex flex-col space-y-1">
                                    {[product.feature_1, product.feature_2, product.feature_3].map((feature, index) => (
                                        <div key={index} className="flex items-center">
                                            <CheckIcon className="h-4 w-4 mr-2 text-gray-500" />
                                            <p className="text-sm text-gray-700">{feature}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>


                            <div className="flex space-x-4">
                                <button 
                                    onClick={itemToCart} 
                                    className="text-white bg-blue-600 font-bold hover:bg-blue-700 w-48 h-14 rounded-lg focus:outline-none"
                                >
                                   Add to cart
                                </button>
           </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DistProdCard;