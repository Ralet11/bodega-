import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../../redux/actions/actions';
import Title from '../../ui_bodega/Title';
import ThumbnailImage from '../../ui_bodega/ThumbnailImage';
import CheckIcon from '../../icons/checkIcon';
import GoBackArrow from '../GobackArrow';
import ToasterConfig from '../../ui_bodega/Toaster';
import toast from 'react-hot-toast';

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
        try {
            dispatch(addToCart(product));
            toast.success("Item added to cart");
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    };

    return (
        <>
            <GoBackArrow />
            <div className="flex mt-20 p-2 bg-gray-200 justify-center lg:pt-20 items-center my-6">
                <div className="bg-white rounded-xl shadow-2xl max-w-screen-xl w-full p-6 sm:p-12 pb-24"> {/* Increased bottom padding */}
                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/4 flex flex-wrap justify-center md:flex-col md:items-start md:space-y-4 mb-6 md:mb-0 space-x-4 md:space-x-0">
                            {[product.image1, product.image2, product.image3].map((image, index) => (
                                <ThumbnailImage
                                    key={index}
                                    src={image}
                                    alt={`Product Thumbnail ${index + 1}`}
                                    onClick={() => handleThumbnailClick(image)}
                                    className="cursor-pointer rounded-lg shadow-md hover:shadow-lg w-16 h-16 sm:w-24 sm:h-24"
                                />
                            ))}
                        </div>
                        <div className="w-full md:w-1/2 flex justify-center items-center p-4">
                            <img
                                src={selectedImage || product.image1}
                                alt="Product"
                                className="object-contain w-full h-full rounded-lg shadow-lg max-h-64 md:max-h-96"
                            />
                        </div>
                        <div className="w-full md:w-1/4 flex flex-col justify-start space-y-6 md:ml-8 mt-8 md:mt-0">
                            <div className="text-center">
                                <h1 className="text-3xl sm:text-2xl font-bold text-gray-800 mb-6">{product.name}</h1>
                                <div className="flex flex-col sm:flex-row justify-center items-center">
                                    <span className="text-4xl p-4 mb-2 md:text-4xl md:mt-2 font-bold leading-9 tracking-tight text-gray-900">{`$${product.price}`}</span>
                                    <span className="text-green-600 text-xl sm:text-2xl font-semibold ml-4">10% discount</span>
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
                                    className="text-white bg-blue-600 font-bold hover:bg-blue-700 w-full md:w-48 h-12 sm:h-14 rounded-lg focus:outline-none"
                                >
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToasterConfig />
        </>
    );
};

export default DistProdCard;