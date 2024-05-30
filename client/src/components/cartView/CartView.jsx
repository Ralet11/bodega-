import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, setDistOrder } from '../../redux/actions/actions';
import { getParamsEnv } from '../../functions/getParamsEnv';
import axios from 'axios';
import { StarIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const { API_URL_BASE } = getParamsEnv();

const CartView = ({ onClose }) => {
    const cartItems = useSelector((state) => state?.cart);
    const user = useSelector((state) => state?.client.client);
    const local_id = useSelector((state) => state?.activeShop);
    const [itemQuantities, setItemQuantities] = useState({});
    const dispatch = useDispatch();
    const order_date = new Date();
    const [total, setTotal] = useState(0);
    const token = useSelector((state) => state?.client.token);
    const shop = useSelector((state) => state?.activeShop);
    const [isBodegaCheckout, setIsBodegaCheckout] = useState(false);
    const client = useSelector((state) => state?.client.client);
    const [clientNow, setClientNow] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

        useEffect(() => {
            const fetchClient = async () => {
                try {
                    const response = await axios.get(`${API_URL_BASE}/api/clients/${client.id}`, {
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                    });
                    setClientNow(response.data);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchClient();
        }, []);

    console.log(clientNow)
    useEffect(() => {
        const quantities = {};
        for (const item of cartItems) {
            if (!quantities[item.id]) {
                quantities[item.id] = 0;
            }
            quantities[item.id]++;
        }
        setItemQuantities(quantities);
    }, [cartItems]);

    useEffect(() => {
        let totalPrice = 0;
        for (const item of cartItems) {
            totalPrice += item.price;
        }
        setTotal(totalPrice);
    }, [cartItems, itemQuantities]);

    const addItemToCart = (item) => {
        dispatch(addToCart(item));
    };

    const removeItemFromCart = (itemId) => {
        dispatch(removeFromCart(itemId));
    };

    const handlePayment = async (method) => {
        if (method === 'bodega') {
            setIsBodegaCheckout(true);
            return;
        }

        const products = cartItems;
        const customerInfo = { name: user.name, mail: user.mail, id: user.id, phone: user.phone };

        try {
            const orderResponse = await axios.post(`${API_URL_BASE}/api/distOrder/add`, { local_id, order_details: cartItems, order_date }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (orderResponse.status === 201) {
                const orderId = orderResponse.data[0].order_id;
                dispatch(setDistOrder(orderResponse.data));

                try {
                    const paymentResponse = await axios.post(`${API_URL_BASE}/api/payment/distPayment`, { products, customerInfo, orderData: orderId, shop }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    window.location.href = paymentResponse.data.url;
                    onClose();
                } catch (paymentError) {
                    console.error("Error al procesar el pago:", paymentError);
                }
            }
        } catch (orderError) {
            console.error("Error al crear la orden:", orderError);
        }
    };

    const finalizeBodegaPurchase = async (remainingBalance) => {
        setIsLoading(true);  // Establecer el estado de carga a verdadero
        try {
            const orderResponse = await axios.post(`${API_URL_BASE}/api/distOrder/add`, { local_id, order_details: cartItems, order_date }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(orderResponse.data);
            if (orderResponse.status === 201) {
                dispatch(setDistOrder(orderResponse.data));

                try {
                    const paymentResponse = await axios.post(`${API_URL_BASE}/api/payment/bodegaPayment`, { remainingBalance, clientId: client.id, orderData: orderResponse.data, localId: shop }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (paymentResponse.statusText === "OK") {
                        navigate("/succesPaymentDist");
                    }

                } catch (paymentError) {
                    console.error("Error al procesar el pago:", paymentError);
                }
            }
        } catch (orderError) {
            console.error("Error al crear la orden:", orderError);
        } finally {
            setIsLoading(false);  // Restablecer el estado de carga a falso
        }
    };

    const uniqueCartItems = Object.values(cartItems.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
    }, {}));

   

    if (isBodegaCheckout) {
        const BodegaBalance = clientNow && clientNow.client.balance;
        console.log(clientNow)
        const remainingBalance = BodegaBalance - total;
        
        return (
            <div className="flex justify-center items-center w-full h-screen fixed inset-0 z-50 bg-gray-900 bg-opacity-50">
                <div className="w-full h-full md:h-auto md:max-w-4xl p-4 sm:p-8 md:p-10 bg-white rounded-xl shadow-2xl overflow-y-auto max-h-screen relative">
                    <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={onClose}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 sm:mb-6 text-gray-800">Confirm Bodega Balance Purchase</h2>
                    <div className="text-base sm:text-lg md:text-xl font-medium mb-4 sm:mb-8 text-gray-700">
                        <div className="flex justify-between items-center mb-2 sm:mb-4">
                            <span>Total:</span>
                            <span className="font-semibold text-gray-900">${total}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2 sm:mb-4">
                            <span>Bodega Balance:</span>
                            <span className="flex items-center font-semibold text-gray-900">
                                <StarIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-yellow-500 mr-1 sm:mr-2" />
                                {BodegaBalance}
                            </span>
                        </div>
                        <div className="border-t border-gray-300 my-4 sm:my-6"></div>
                        <div className="flex justify-between items-center mb-2 sm:mb-4">
                            <span>Remaining Balance:</span>
                            <span className="flex items-center font-semibold text-gray-900">
                                <StarIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-yellow-500 mr-1 sm:mr-2" />
                                {remainingBalance}
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-6 flex justify-end">
                        <button
                            onClick={() => { finalizeBodegaPurchase(remainingBalance) }}
                            className={`bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg shadow-lg transform transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300 ${BodegaBalance < total || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            aria-label="Finalize Purchase"
                            disabled={BodegaBalance < total || isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Finalize Purchase'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center w-full h-screen fixed inset-0 z-50 bg-gray-900 bg-opacity-50">
            <div className="w-full h-full md:h-auto md:max-w-5xl p-4 sm:p-6 md:p-10 bg-white rounded-lg shadow-xl overflow-y-auto max-h-screen relative">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={onClose}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Your Cart</h2>
                {cartItems.length > 0 ? (
                    <div>
                        {uniqueCartItems.map((item) => (
                            <div key={item.id} className="flex flex-col md:flex-row items-center border-b py-2 sm:py-4 space-y-2 sm:space-y-4 md:space-y-0 md:space-x-4">
                                <img className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg" src={item.image1} alt={item.name} />
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-md sm:text-lg md:text-xl font-semibold">{item.name}</h3>
                                    <p className="text-gray-600">${item.price}</p>
                                    <div className="flex items-center justify-center md:justify-start space-x-2 mt-1">
                                        <button
                                            className="text-gray-600 hover:text-gray-800 focus:outline-none"
                                            onClick={() => removeItemFromCart(item.id)}
                                            disabled={(itemQuantities[item.id] || 1) <= 0}
                                        >
                                            -
                                        </button>
                                        <p className="text-black font-bold">x{itemQuantities[item.id] || 1}</p>
                                        <button
                                            className="text-gray-600 hover:text-gray-800 focus:outline-none"
                                            onClick={() => addItemToCart(item)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-600 font-semibold">${item.price * (itemQuantities[item.id] || 1)}</p>
                            </div>
                        ))}
                        <div className="mt-4 sm:mt-6">
                            <p className="text-lg sm:text-xl md:text-2xl font-semibold">Total: ${total.toFixed(2)}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">Your cart is empty</p>
                )}
                <div className="mt-4 sm:mt-8 flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-4">
                    <button
                        onClick={() => handlePayment('stripe')}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 sm:py-3 px-4 rounded"
                    >
                        Checkout with Stripe
                    </button>
                    <button
                        onClick={() => handlePayment('bodega')}
                        className="bg-[#F2BB26] text-black font-bold py-2 sm:py-3 px-4 rounded"
                    >
                        Checkout with Bodega Balance
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartView;