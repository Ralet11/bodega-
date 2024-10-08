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
    }, [client.id, token]);

    useEffect(() => {
        let totalPrice = 0;
        for (const item of cartItems) {
            totalPrice += item.price * item.quantity;
        }
        setTotal(totalPrice);
    }, [cartItems]);

    const addItemToCart = (item) => {
        const updatedItem = { ...item, quantity: 1 };
        dispatch(addToCart(updatedItem));
    };

    const removeItemFromCart = (item) => {
        const updatedItem = { ...item, quantity: 1 };
        dispatch(removeFromCart(updatedItem));
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
        setIsLoading(true);
        try {
            const orderResponse = await axios.post(`${API_URL_BASE}/api/distOrder/add`, { local_id, order_details: cartItems, order_date }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
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
            setIsLoading(false);
        }
    };

    const uniqueCartItems = Object.values(cartItems.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
    }, {}));

    if (isBodegaCheckout) {
        const BodegaBalance = clientNow && clientNow.client.balance;
        const remainingBalance = BodegaBalance - total;

        return (
            <div className="flex justify-center items-center w-full h-screen fixed inset-0 z-50 bg-gray-900 bg-opacity-50">
                <div className="w-full max-w-lg p-4 bg-white rounded-xl shadow-2xl overflow-y-auto">
                    <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={onClose}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                    <h2 className="text-2xl font-extrabold mb-4 text-gray-800">Confirm Bodega Balance Purchase</h2>
                    <div className="text-lg font-medium mb-6 text-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <span>Total:</span>
                            <span className="font-semibold text-gray-900">${total}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <span>Bodega Balance:</span>
                            <span className="flex items-center font-semibold text-gray-900">
                                <StarIcon className="h-6 w-6 text-yellow-500 mr-2" />
                                {BodegaBalance}
                            </span>
                        </div>
                        <div className="border-t border-gray-300 my-4"></div>
                        <div className="flex justify-between items-center mb-4">
                            <span>Remaining Balance:</span>
                            <span className="flex items-center font-semibold text-gray-900">
                                <StarIcon className="h-6 w-6 text-yellow-500 mr-2" />
                                {remainingBalance}
                            </span>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => { finalizeBodegaPurchase(remainingBalance) }}
                            className={`bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300 ${BodegaBalance < total || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            <div className="w-full max-w-2xl p-4 bg-white rounded-lg shadow-xl overflow-y-auto">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={onClose}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
                {cartItems.length > 0 ? (
                    <div>
                        {uniqueCartItems.map((item) => (
                            <div key={item.id} className="flex flex-col md:flex-row items-center border-b py-2 space-y-2 md:space-y-0 md:space-x-4">
                                <img className="w-16 h-16 md:w-24 md:h-24 rounded-lg" src={item.image1} alt={item.name} />
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-lg font-semibold">{item.name}</h3>
                                    <p className="text-gray-600">${item.price}</p>
                                    <div className="flex items-center justify-center md:justify-start space-x-2 mt-1">
                                        <button
                                            className="text-gray-600 hover:text-gray-800 focus:outline-none"
                                            onClick={() => removeItemFromCart(item)}
                                            disabled={item.quantity <= 0}
                                        >
                                            -
                                        </button>
                                        <p className="text-black font-bold">x{item.quantity}</p>
                                        <button
                                            className="text-gray-600 hover:text-gray-800 focus:outline-none"
                                            onClick={() => addItemToCart(item)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-600 font-semibold">${item.price * item.quantity}</p>
                            </div>
                        ))}
                        <div className="mt-4">
                            <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">Your cart is empty</p>
                )}
                <div className="mt-8 flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-4">
                    <button
                        onClick={() => handlePayment('stripe')}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded"
                    >
                        Checkout with Stripe
                    </button>
                    <button
                        onClick={() => handlePayment('bodega')}
                        className="bg-[#F2BB26] text-black font-bold py-3 px-4 rounded"
                    >
                        Checkout with Bodega Balance
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartView;