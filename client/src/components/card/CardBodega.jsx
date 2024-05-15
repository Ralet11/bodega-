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
                <div className="bg-white rounded-xl shadow-xl max-w-screen-lg w-full p-8">
                    <div className="flex">
                        <div className="w-1/4 flex flex-col items-center justify-center space-y-4">
                            {[product.image1, product.image2, product.image3].map((image, index) => (
                                <ThumbnailImage
                                    key={index}
                                    src={image}
                                    alt={`Product Thumbnail ${index + 1}`}
                                    onClick={() => handleThumbnailClick(image)}
                                />
                            ))}
                        </div>

                        <div className="w-1/4 ml-20 flex justify-center items-center">
                            <div className="w-full h-full overflow-hidden">
                                <img
                                    src={selectedImage || product.image1}
                                    alt="Product"
                                    className="object-contain w-full h-full"
                                />
                            </div>
                        </div>

                        <div className="w-2/4 flex flex-col justify-start space-y-4 ml-8">
                            <div className="border-b border-gray-200 pb-4">
                                <Title className="text-lg text-black ml-2 mt-0" text={product.name} />
                            </div>

                            <div className="p-2">
                                <p className="ml-2 mt-2 text-sm">{product.description}</p>
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

                            <div className="flex justify-between items-center p-2">
                                <div>
                                    <Title className="ml-2 text-xl" text={`$ ${product.price}`} />
                                </div>
                                <div onClick={itemToCart}>
                                    <button className="text-yellow-600 bg-black font-bold hover:bg-yellow-600 hover:text-black w-42 h-12 rounded-lg focus:outline-none">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DistProdCard;