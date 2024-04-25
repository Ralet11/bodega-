import { useEffect, useState } from "react";
import axios from "axios";

function OrderModal({ order, closeModal }) {
    const [userInfo, setUserInfo] = useState(null);
    console.log(order)
    const innerOrderDetails = JSON.parse(order.oder_details);
    const orderDetails = innerOrderDetails.orderDetails;

    const conteoProductos = {};

    orderDetails.forEach(function (detalle) {
        const { id, img, name, price } = detalle;
        conteoProductos[name] = conteoProductos[name] || {
            cantidad: 0,
            nombre: name,
            imagen: img,
            preciotodal: 0,
        };
        conteoProductos[name].cantidad += 1;
        conteoProductos[name].preciotodal += price;
    });

    const resultadoFinal = Object.values(conteoProductos);

    console.log(userInfo)

    useEffect(() => {
        const id = order.users_id;

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/users/get/${id}`);
                setUserInfo(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-full max-w-3xl mx-auto rounded-lg overflow-hidden shadow-lg">
                <div className="bg-blue-500 text-white p-4">
                    <h2 className="text-2xl font-semibold">Order Details</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Product Details</h3>
                            <div>
                                {resultadoFinal.map((product, index) => (
                                    <div key={index} className="mb-4 flex items-center">
                                        <img className="w-12 h-12 mr-4 rounded-full" src={`http://localhost:3000/${product.imagen}`} alt={`Product ${index}`} />
                                        <div>
                                            <p className="text-lg">{`${product.cantidad} X ${product.nombre}`}</p>
                                            <p className="text-gray-500">{`$ ${product.preciotodal}`}</p>
                                        </div>
                                    </div>
                                ))}
                                <p className="mt-6 text-xl font-semibold">Total Price: $ {Number(order.total_price).toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Customer Information</h3>
                            {userInfo && (
                                <div>
                                    <p className="mb-2 text-lg">
                                        <span className="font-semibold">Name:</span> {userInfo[0].name}
                                    </p>
                                    <p className="mb-2 text-lg">
                                        <span className="font-semibold">Email:</span> {userInfo[0].email}
                                    </p>
                                    <p className="mb-2 text-lg">
                                        <span className="font-semibold">Phone:</span> {userInfo[0].phone}
                                    </p>
                                    <p className="mb-2 text-lg">
                                        <span className="font-semibold">Address:</span> 123 Main Street, Cityville
                                    </p>
                                    {/* Espacio para el mapa (puedes renderizar el mapa aquí) */}
                                    <div className="mt-4 h-40 bg-gray-300 rounded-lg">
                                    <img src="https://res.cloudinary.com/doqyrz0sg/image/upload/v1705872273/mapa_sjtf8t.png" alt="Map Example" className="mt-4 h-40 rounded-lg" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 px-6 py-4 flex justify-end">
                    <button onClick={closeModal} className="text-blue-500 hover:underline cursor-pointer">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderModal;