import { useEffect, useState } from "react";
import axios from "axios";
import { getParamsEnv } from "../../functions/getParamsEnv";
import { useSelector } from "react-redux";

const { API_URL_BASE } = getParamsEnv();

function OrderModal({ order, closeModal }) {
    const [userInfo, setUserInfo] = useState(null);
    const [mapUrl, setMapUrl] = useState(null);
    const token = useSelector((state) => state?.client.token);
    const googleMapsApiKey = "AIzaSyAvritMA-llcdIPnOpudxQ4aZ1b5WsHHUc"; // Replace this with your new Google Maps API key

    const instructions = order.deliveryInstructions;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${API_URL_BASE}/api/users/getForWeb/${order.users_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserInfo(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [order.users_id, token]);

    useEffect(() => {
        if (order.type === "Delivery" && order.deliveryAddress) {
            const address = encodeURIComponent(order.deliveryAddress);
            const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${address}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7Clabel:A%7C${address}&key=${googleMapsApiKey}`;
            setMapUrl(mapUrl);
        }
    }, [order.deliveryAddress, order.type, googleMapsApiKey]);

    const orderDetails = order.order_details || [];

    return (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-full max-w-3xl mx-auto rounded-lg overflow-hidden shadow-lg">
                <div className="bg-blue-500 text-white p-4">
                    <h2 className="text-xl font-semibold">Order Details</h2>
                </div>
                <div className="p-4 lg:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md overflow-y-auto max-h-80">
                            <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                            <div>
                                {orderDetails.map((product, index) => (
                                    <div key={index} className="mb-4">
                                        <div className="flex items-center">
                                            <img className="w-10 h-10 mr-3 rounded-full" src={product.image} alt={`Product ${index}`} />
                                            <div>
                                                <p className="text-sm">{`${product.quantity} X ${product.name}`}</p>
                                                <p className="text-xs text-gray-500">{`$ ${parseFloat(product.price).toFixed(2)}`}</p>
                                            </div>
                                        </div>
                                        {product.selectedExtras && (
                                            <div className="ml-14 text-xs text-gray-500">
                                                {Object.keys(product.selectedExtras).map((extraKey, i) => (
                                                    <p key={i}>{`${product.selectedExtras[extraKey].name}: $${parseFloat(product.selectedExtras[extraKey].price).toFixed(2)}`}</p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <p className="mt-4 text-lg font-semibold">Total Price: $ {Number(order.total_price).toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                            {userInfo && (
                                <div>
                                    <p className="mb-2 text-sm">
                                        <span className="font-semibold">Name:</span> {userInfo.name}
                                    </p>
                                    <p className="mb-2 text-sm">
                                        <span className="font-semibold">Phone:</span> {userInfo.phone}
                                    </p>
                                    {order.type === "Delivery" && (
                                        <>
                                            <p className="mb-2 text-sm">
                                                <span className="font-semibold">Delivery Address:</span> {order.deliveryAddress}
                                            </p>
                                            {instructions && (
                                                <p className="mb-2 text-sm">
                                                    <span className="font-semibold">Instructions:</span> {instructions}
                                                </p>
                                            )}
                                            <div className="mt-4 h-32 bg-gray-300 rounded-lg overflow-hidden">
                                                {mapUrl ? (
                                                    <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                                                        <img src={mapUrl} alt="Delivery Map" className="h-full w-full object-cover" />
                                                    </a>
                                                ) : (
                                                    <p className="text-sm text-gray-500">Loading map...</p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                    {order.type !== "Delivery" && (
                                        <p className="text-sm font-semibold">{`Order Type: ${order.type}`}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 px-4 lg:px-6 py-3 flex justify-end">
                    <button onClick={closeModal} className="text-blue-500 hover:underline cursor-pointer text-sm lg:text-base">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderModal;