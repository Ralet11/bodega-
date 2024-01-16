import { useEffect, useState } from "react";
import axios from "axios";

function OrderModal({ order, closeModal }) {

    const [userInfo, setUserInfo] = useState(null)

    const innerOrderDetails = JSON.parse(order.oder_details);
    const orderDetails = innerOrderDetails.orderDetails;

    const conteoProductos = {};

    orderDetails.forEach(function (detalle) {
        const { id, img, name, price } = detalle;
        conteoProductos[name] = conteoProductos[name] || { cantidad: 0, nombre: name, imagen: img, preciotodal: 0 };
        conteoProductos[name].cantidad += 1; // Corregido de quantity a cantidad
        conteoProductos[name].preciotodal += price; // Corregido de totalPrice a preciotodal
    });

    // Formatear el resultado
    const resultadoFinal = Object.values(conteoProductos);

    useEffect(() => {

        const id = order.users_id

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/users/get/${id}`,)
                setUserInfo(response.data)
                
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    }, [])


    if(userInfo) {
        console.log(userInfo)
    }
    return (
        <div>
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white w-[700px] h-[400px] rounded-lg shadow-lg">
                    <div className="w-100%">
                        <div className="w-100% bg-custom2 min-h-[60px] pt-4">
                            <h2 className="text-m font-semibold mb-4 ml-2">Order Details</h2>
                        </div>
                        <div className="m-3">
                            <div className="grid grid-cols-2 gap-4 mb-4 ">
                                <div className="min-w-[300px] min-h-[300px] max-h-[300px] bg-gray-100 p-4 rounded-lg shadow-md overflow-auto">
                                    <h3 className="text-lg font-semibold mb-2">Product Details</h3>
                                    <div>
                                        {resultadoFinal.map((product, index) => (
                                            <div key={index} className="mb-2 flex mt-5">
                                                <img className="w-[30px] h-[30px] mr-5" src={`http://localhost:3000/${product.imagen}`} />
                                                <p>{`${product.cantidad} X`}</p>
                                                <p className="ml-4">{`${product.nombre}`}</p>
                                                <p className="ml-auto">{`$ ${product.preciotodal}`}</p>
                                            </div>
                                        ))}
                                        <p className="mt-[60px] pl-[140px]">Total Price: $ {order.total_price}</p>
                                    </div>
                                </div>
                                <div className="bg-gray-100 p-4 rounded-lg shadow-md min-w-[300px] min-h-[300px] max-h-[300px] overflow-auto">
                                    <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                                    {userInfo && (
                                        <div>
                                            <p>Name: {userInfo[0].name}</p>
                                            <p>Email: {userInfo[0].email}</p>
                                            <p>Phone: {userInfo[0].phone}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-100 px-6 py-4 flex justify-end">
                        <button onClick={closeModal} className="text-blue-500 hover:underline cursor-pointer mr-4">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderModal;
