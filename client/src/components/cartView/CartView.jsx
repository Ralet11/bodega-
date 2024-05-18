import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, setDistOrder } from '../../redux/actions/actions';
import { getParamsEnv } from '../../functions/getParamsEnv';
import axios from 'axios';

const { API_URL_BASE } = getParamsEnv();

const CartView = ({ onClose }) => {
    const cartItems = useSelector((state) => state?.cart);
    const user = useSelector((state) => state?.client.client);
    const local_id = useSelector((state) => state?.activeShop);
    const [itemQuantities, setItemQuantities] = useState({});
    const dispatch = useDispatch();
    const order_date = new Date();
    const [total, setTotal] = useState(0);
    const token = useSelector((state) => state?.client.token)

    // Actualizar el estado itemQuantities
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

    // Función para agregar un producto al carrito
    const addItemToCart = (item) => {
        dispatch(addToCart(item));
    };

    // Función para eliminar un producto del carrito
    const removeItemFromCart = (itemId) => {
        dispatch(removeFromCart(itemId));
    };

    // Función para manejar el pago
    const handlePayment = async () => {
        const products = cartItems;
        const customerInfo = { name: user.name, mail: user.mail, id: user.id };
    
        try {
            // Crear la orden
            const orderResponse = await axios.post(`${API_URL_BASE}/api/distOrder/add`, { local_id, order_details: cartItems, order_date },  {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (orderResponse.status === 201) { // Asegurarse de que el estado de respuesta es 201 (Created)
                const orderId = orderResponse.data[0].order_id;
                console.log(orderResponse);
    
                try {
                    // Iniciar el pago
                    const paymentResponse = await axios.post(`${API_URL_BASE}/api/payment/distPayment`, { products, customerInfo, orderData: orderId }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log(paymentResponse, "respuesta");
    
                    // Actualizar el estado y redirigir
                    dispatch(setDistOrder(paymentResponse.data));
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

    return (
        <div className="flex justify-center items-center min-h-[400px] w-full">
            <div className="max-w-4xl w-full p-8 bg-white rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
                {cartItems.length > 0 ? (
                    <div>
                        {uniqueCartItems.map((item) => (
                            <div key={item.id} className="flex items-center border-b py-4 space-x-4">
                                <img className="w-24 h-24 rounded-lg" src={item.image1} alt={item.name} />
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold">{item.name}</h3>
                                    <p className="text-gray-600">${item.price}</p>
                                    <div className="flex items-center space-x-2 mt-2">
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
                        <div className="mt-6">
                            <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">Your cart is empty</p>
                )}
                <div className="mt-6 flex justify-end">
                    <button onClick={handlePayment} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded">
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartView;