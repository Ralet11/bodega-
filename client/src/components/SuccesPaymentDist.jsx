import React from 'react';
import { useSelector } from 'react-redux';
import { CheckCircle } from 'lucide-react';

const SuccessPaymentDist = () => {
  const cartItems = useSelector((state) => state?.cart);

  // Función para agrupar los productos con el mismo ID
  const groupedItems = cartItems.reduce((acc, item) => {
    const existingItem = acc.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex items-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-500 mr-4" />
            <h2 className="text-3xl font-semibold">Order Placed Successfully!</h2>
          </div>
          <p className="text-gray-600 mb-6">Your order has been placed successfully. The following items have been purchased:</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {groupedItems.map((item, index) => (
              <div key={index} className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">{item.name} {item.quantity > 1 && <span className="text-gray-600">x{item.quantity}</span>}</p>
                  <p className="text-gray-600">Price: ${item.price}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-600 mt-6">Delivery will be made within the next 5 days.</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPaymentDist;