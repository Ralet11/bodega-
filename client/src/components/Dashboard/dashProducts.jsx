import React from 'react';

const ProductsComponent = ({ products }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Products</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Image</th>
              <th className="py-2 px-4 border-b">Category ID</th>
              <th className="py-2 px-4 border-b">State</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="py-2 px-4 border-b">{product.id}</td>
                <td className="py-2 px-4 border-b">{product.name}</td>
                <td className="py-2 px-4 border-b">{product.price}</td>
                <td className="py-2 px-4 border-b">{product.description}</td>
                <td className="py-2 px-4 border-b">
                  <img src={product.img} alt={product.name} className="w-16 h-16 object-cover" />
                </td>
                <td className="py-2 px-4 border-b">{product.categories_id}</td>
                <td className="py-2 px-4 border-b">{product.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsComponent;
