import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../../redux/actions/actions';
import ThumbnailImage from '../../ui_bodega/ThumbnailImage';
import CheckIcon from '../../icons/checkIcon';
import ToasterConfig from '../../ui_bodega/Toaster';
import toast from 'react-hot-toast';

const DistProdCard = () => {
    const dispatch = useDispatch();
    const distProduct = useSelector((state) => state?.selectedDistProd);
    const [product, setProduct] = useState(distProduct || {});
    const [selectedImage, setSelectedImage] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);

    // Array de variantes de muestra
    const variants = [
        { option: 'Color Rojo', stock: 10, price: 100 },
        { option: 'Color Azul', stock: 15, price: 110 },
        { option: 'Color Verde', stock: 20, price: 120 }
    ];

    useEffect(() => {
        setProduct(distProduct);
        const initialQuantities = {};
        variants.forEach((variant, index) => {
            initialQuantities[index] = 1; // Initialize all quantities to 1
        });
        setQuantities(initialQuantities);
    }, [distProduct]);

    useEffect(() => {
        calculateTotalPrice();
    }, [quantities]);

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

    const handleQuantityChange = (index, amount) => {
        setQuantities((prevQuantities) => {
            const newQuantities = { ...prevQuantities };
            newQuantities[index] = newQuantities[index] + amount;
            if (newQuantities[index] < 1) newQuantities[index] = 1;
            return newQuantities;
        });
    };

    const calculateTotalPrice = () => {
        let total = 0;
        variants.forEach((variant, index) => {
            total += variant.price * (quantities[index] || 1);
        });
        setTotalPrice(total);
    };

    return (
        <>
            <div className="flex justify-center mt-10 bg-gray-200 py-10 px-4">
                <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full p-6 md:p-12">
                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/4 flex flex-col items-center mb-6 md:mb-0">
                            {[product.image1, product.image2, product.image3].map((image, index) => (
                                <ThumbnailImage
                                    key={index}
                                    src={image}
                                    alt={`Product Thumbnail ${index + 1}`}
                                    onClick={() => handleThumbnailClick(image)}
                                    className="cursor-pointer rounded-lg shadow-md hover:shadow-lg w-16 h-16 sm:w-24 sm:h-24 mb-2"
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
                        <div className="w-full md:w-1/4 flex flex-col justify-start space-y-4 md:ml-8 mt-8 md:mt-0">
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                                <div className="flex items-center mb-4">
                                    <span className="text-yellow-500 text-xl">★</span>
                                    <span className="ml-2 text-gray-600 text-sm">4.6 (263)</span>
                                </div>
                                <div className="flex items-center mb-4">
                                    <span className="text-2xl font-bold text-gray-900">{`$${product.price}`}</span>
                                    <span className="text-green-600 text-xl ml-2">10% OFF</span>
                                </div>
                                <div className="flex items-center mb-4">
                                    <span className="text-gray-600 text-sm">Envío gratis comprando 5 o más unidades</span>
                                </div>
                                <div className="flex items-center mb-4">
                                    <button
                                        className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
                                        onClick={itemToCart}
                                    >
                                        Agregar al carrito
                                    </button>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 pt-4">
                                <div className="ml-2 flex flex-col space-y-2">
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
                    <div className="mt-4">
                        <p className="text-gray-600 text-sm">Stock disponible</p>
                        <p className="text-gray-600 text-sm">Cantidad: {Object.values(quantities).reduce((a, b) => a + b, 1)} unidad (+50 disponibles)</p>
                    </div>
                    <div className="mt-4">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Options</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partial Price</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {variants.map((variant, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{variant.option}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{variant.stock}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${variant.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                                            <button
                                                className="bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-l-lg hover:bg-gray-400"
                                                onClick={() => handleQuantityChange(index, -1)}
                                            >
                                                -
                                            </button>
                                            <span className="px-4">{quantities[index]}</span>
                                            <button
                                                className="bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-r-lg hover:bg-gray-400"
                                                onClick={() => handleQuantityChange(index, 1)}
                                            >
                                                +
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${variant.price * (quantities[index] || 1)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                        <button
                            className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700"
                            onClick={itemToCart}
                        >
                            Agregar todos al carrito
                        </button>
                        <span className="text-xl font-bold text-gray-800">{`Total: $${totalPrice}`}</span>
                    </div>
                </div>
            </div>
            <ToasterConfig />
        </>
    );
};

export default DistProdCard;
