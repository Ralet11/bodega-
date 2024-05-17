import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle } from 'lucide-react';
import { emptyCart } from '../redux/actions/actions';
import axios from 'axios';
import { getParamsEnv } from '../functions/getParamsEnv';

const { API_URL_BASE } = getParamsEnv();

const SuccessPaymentDist = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state?.cart || []);
  const order = useSelector((state) => state?.order || []);
  const [items, setItems] = useState([]);
  const [groupedBySupplier, setGroupedBySupplier] = useState(null);
  const activeShop = useSelector((state) => state?.activeShop)
  const client = useSelector((state) => state?.client)
  const orderShop = client.locals.find((local) => local.id = activeShop)

  const localData = {
    name: orderShop.name,
    address: orderShop.address,
    id: orderShop.id,
    phone: orderShop.phone
  }

  const clientData = {
    name: client.client.name,
    id: client.client.id
  }

  console.log(client)
  // Agrupar items por su ID
  useEffect(() => {
    if (cartItems.length > 0) {
      const groupedItems = cartItems.reduce((acc, item) => {
        const existingItem = acc.find(i => i.id === item.id);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          acc.push({ ...item });
        }
        return acc;
      }, []);
      setItems(groupedItems);
      dispatch(emptyCart());
    }
  }, [cartItems, dispatch]);

  // Agrupar pedidos por proveedor
  useEffect(() => {
    if (order.length > 0) {
      const grouped = order.reduce((acc, orderItem) => {
        const { DistProduct } = orderItem;
        const { id_proveedor } = DistProduct; // Accede a id_proveedor desde DistProduct
        if (!acc[id_proveedor]) {
          acc[id_proveedor] = {
            supplierId: id_proveedor,
            products: [],
            totalQuantity: 0
          };
        }
        acc[id_proveedor].products.push({
          productId: orderItem.product_id,
          name: DistProduct.name,
          quantity: orderItem.quantity
        });
        acc[id_proveedor].totalQuantity += orderItem.quantity;
        return acc;
      }, {});
      setGroupedBySupplier(grouped);
    }
  }, [order]);

  // Enviar email con los datos agrupados del pedido
  useEffect(() => {
    if (groupedBySupplier) {
      console.log(groupedBySupplier);
      const sendEmail = async () => {
        try {
          const response = await axios.post(`${API_URL_BASE}/api/distProducts/sendEmailWithOrder`, { data: { orderData: groupedBySupplier, clientData, localData } });
          console.log('Email sent:', response.data);
        } catch (error) {
          console.error('Error sending email:', error);
        }
      };

      sendEmail();
    }
  }, [groupedBySupplier, API_URL_BASE]);

  // Aplanar la estructura de productos agrupados por proveedor
  const flattenedItems = groupedBySupplier ? Object.values(groupedBySupplier).flatMap(supplier => supplier.products) : [];

  return (
    <div className="container mx-auto mt-8 pt-20">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex items-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-500 mr-4" />
            <h2 className="text-3xl font-semibold">Order Placed Successfully!</h2>
          </div>
          <p className="text-gray-600 mb-6">Your order has been placed successfully. The following items have been purchased:</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {flattenedItems.map((item, index) => (
              <div key={index} className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">{item.name} <span className="text-gray-600">x{item.quantity}</span></p>
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
