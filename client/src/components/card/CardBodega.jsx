import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../../redux/actions/actions';
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
            toast.error(error.message);
        }
    };

    return (
        <>
        <GoBackArrow />
            <div className="flex justify-center mt-10 bg-gray-200 py-20 px-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-4 md:p-8">
                    <div className="flex flex-col md:flex-row">
                        {/* <div className="flex flex-col items-center md:w-1/4 mb-4 md:mb-0">
                            {[product.image1, product.image2, product.image3].map((image, index) => (
                                <ThumbnailImage
                                    key={index}
                                    src={image}
                                    alt={`Product Thumbnail ${index + 1}`}
                                    onClick={() => handleThumbnailClick(image)}
                                    className="cursor-pointer rounded-lg shadow-md hover:shadow-lg w-20 h-20 md:w-24 md:h-24 mb-2"
                                />
                            ))}
                        </div> */}
                        <div className="flex justify-center items-center md:w-1/2 mb-4 md:mb-0">
                            <img
                                src={selectedImage || product.image1}
                                alt="Product"
                                className="object-contain w-full max-h-64 md:max-h-96 rounded-lg shadow-lg"
                            />
                        </div>
                        <div className="flex flex-col justify-between md:w-1/4 space-y-4">
                            <div>
                                <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-2 text-center md:text-left">{product.name}</h1>
                                <div className="flex items-center justify-center md:justify-start mb-2">
                                    <span className="text-yellow-500 text-xl">★</span>
                                    <span className="ml-2 text-gray-600 text-sm">4.6 (263)</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start mb-2">
                                    <span className="text-2xl font-bold text-gray-900">{`$${product.price}`}</span>
                                    <span className="text-green-600 text-xl ml-2">10% OFF</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start mb-2">
                                    <span className="text-gray-600 text-sm">Envío gratis comprando 5 o más unidades</span>
                                </div>
                                <div className="flex justify-center md:justify-start">
                                    <button
                                        className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
                                        onClick={itemToCart}
                                    >
                                        Agregar al carrito
                                    </button>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex flex-col space-y-2">
                                    {[product.feature_1, product.feature_2, product.feature_3].map((feature, index) => (
                                        <div key={index} className="flex items-center">
                                            <CheckIcon className="h-4 w-4 mr-2 text-green-500" />
                                            <p className="text-sm text-gray-700">{feature}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-gray-600 text-sm">Stock disponible</p>
                        <p className="text-gray-600 text-sm">Cantidad: 1 unidad (+50 disponibles)</p>
                    </div>
                </div>
            </div>
            <ToasterConfig />
        </>
    );
};

export default DistProdCard;