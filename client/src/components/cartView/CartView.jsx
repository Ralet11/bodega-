import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, setDistOrder } from '../../redux/actions/actions';
import { getParamsEnv } from '../../functions/getParamsEnv';
import axios from 'axios';

const {API_URL_BASE} = getParamsEnv()

const CartView = ({ onClose }) => {
    const cartItems = useSelector((state) => state?.cart);
    const user = useSelector((state) => state?.client.client);
    const local_id = useSelector((state) => state?.activeShop)
    const [itemQuantities, setItemQuantities] = useState({});
    const dispatch = useDispatch();
    const order_date = new Date()
    const [total, setTotal] = useState(0);

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

    // Calcular la suma total final

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
        const products = cartItems
        const customerInfo = { name: user.name, mail: user.mail, id: user.id };

        try {
            const response = await axios.post(`${API_URL_BASE}/api/payment/distPayment`, { products, customerInfo });
            if (response.statusText === "OK") {

                try {
                    const response = await axios.post(`${API_URL_BASE}/api/distOrder/add`, {local_id, order_details: cartItems, order_date })
                    console.log(response, "respuesta")
                    dispatch(setDistOrder(response.data))
                } catch (error) {
                    console.log(error)
                }

                window.location.href = response.data.url;
                onClose();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const uniqueCartItems = Object.values(cartItems.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
    }, {}))

    
    return (
        <div className="flex min-w-[500px] justify-center items-center">
            <div className="max-w-lg w-full p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
                {cartItems.length > 0 ? (
                    <div>
                        {uniqueCartItems.map((item) => (
                            <div key={item.id} className="flex items-center border-b py-2">
                                {/* Renderizar información del producto */}
                                <img className="w-20 h-20 mr-4 rounded-lg" src={item.image1} alt={item.name} />
                                <div>
                                    <h3 className="text-lg font-semibold">{item.name}</h3>
                                    <p className="text-gray-600">${item.price}</p>
                                    <div className="flex items-center">
                                        {/* Botón para reducir la cantidad */}
                                        <button
                                            className="mr-2 text-gray-600 focus:border-yellow-600"
                                            onClick={() => removeItemFromCart(item.id)}
                                            disabled={(itemQuantities[item.id] || 1) <= 0}
                                        >
                                            -
                                        </button>
                                        {/* Mostrar la cantidad */}
                                        <p className="text-black font-bold">x{itemQuantities[item.id] || 1}</p>
                                        {/* Botón para aumentar la cantidad */}
                                        <button
                                            className="ml-2 text-gray-600 focus:border-yellow-600"
                                            onClick={() => addItemToCart(item)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                {/* Mostrar el precio total del producto */}
                                <p className="text-gray-600 ml-auto">${item.price * (itemQuantities[item.id] || 1)}</p>
                            </div>
                        ))}
                        {/* Mostrar el total */}
                        <div className="mt-4">
                            <p className="text-lg font-semibold">Total: ${total}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">Your cart is empty</p>
                )}
                {/* Botón para el pago */}
                <div className="mt-4">
                    <span onClick={handlePayment} className="cursor-pointer bg-black hover:bg-yellow-600 focus:border-yellow-600 text-yellow-600 hover:text-black font-bold font-semibold py-2 px-4 rounded">
                        Checkout
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CartView;
