import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, setDistOrder } from '../../redux/actions/actions';
import { getParamsEnv } from '../../functions/getParamsEnv';
import axios from 'axios';
import {
    StarIcon
  } from '@heroicons/react/24/solid'

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
    const client = useSelector((state) => state?.client.client)
    const [clientNow, setClientNow] = useState(null)

    useEffect(() => {
        const fetchClient = async () => {
          try {
            const response = await axios.get(`${API_URL_BASE}/api/clients/${client.id}`, {
              headers: {
                authorization: `Bearer ${token}`
              }
            })
           
            console.log(response.data, "productos ready")
            setClientNow(response.data)
    
          } catch (error) {
            console.log(error)
          }
        }
        fetchClient()
      },[])

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

    const finalizeBodegaPurchase = async () => {
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
                    const paymentResponse = await axios.post(`${API_URL_BASE}/api/payment/bodegaPayment`, { products, customerInfo, orderData: orderId, shop }, {
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

    const uniqueCartItems = Object.values(cartItems.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
    }, {}));

    if (isBodegaCheckout) {
        const BodegaBalance = clientNow && clientNow.balance

        const remainingBalance = BodegaBalance - total;
        return (
            <div className="flex justify-center items-center w-full bg-gradient-to-br from-gray-100 to-gray-300">
                <div className="max-w-4xl w-full p-8 md:p-10 bg-white rounded-xl shadow-2xl">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-800">Confirm Bodega Balance Purchase</h2>
                    <div className="text-lg md:text-xl font-medium mb-8 text-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <span>Total:</span>
                            <span className="font-semibold text-gray-900">{total}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <span>Bodega Balance:</span>
                            <span className="flex items-center font-semibold text-gray-900">
                                <StarIcon className="h-6 w-6 text-yellow-500 mr-2" />
                                {BodegaBalance}
                            </span>
                        </div>
                        <div className="border-t border-gray-300 my-6"></div>
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
                            onClick={finalizeBodegaPurchase}
                            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300"
                            aria-label="Finalize Purchase"
                        >
                            Finalize Purchase
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-[600px] w-full">
            <div className="max-w-5xl w-full p-6 md:p-10 bg-white rounded-lg shadow-xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">Your Cart</h2>
                {cartItems.length > 0 ? (
                    <div className="max-h-[600px] overflow-y-auto">
                        {uniqueCartItems.map((item) => (
                            <div key={item.id} className="flex flex-col md:flex-row items-center border-b py-6 space-y-6 md:space-y-0 md:space-x-6">
                                <img className="w-20 h-20 md:w-32 md:h-32 rounded-lg" src={item.image1} alt={item.name} />
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-xl md:text-2xl font-semibold">{item.name}</h3>
                                    <p className="text-gray-600">${item.price}</p>
                                    <div className="flex items-center justify-center md:justify-start space-x-2 mt-2">
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
                        <div className="mt-8">
                            <p className="text-xl md:text-2xl font-semibold">Total: ${total.toFixed(2)}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">Your cart is empty</p>
                )}
                <div className="mt-8 flex flex-col md:flex-row justify-end space-y-4 md:space-y-0 md:space-x-4">
                    <button
                        onClick={() => handlePayment('stripe')}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Checkout with Stripe
                    </button>
                    <button
                        onClick={() => handlePayment('bodega')}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Checkout with Bodega Balance
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartView;
