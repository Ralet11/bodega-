import React, { useState } from 'react';
import CommerceSidebar from '../CommerceSidebar/CommerceSidebar';
import SearchBarCommerce from '../SearchBarCommerce/SearchBarCommerce';

const DistributorComerce = () => {

    const [product, setProduct] = useState()


  const all_offers = [
    {"name": "Glass Bong", "quantity": 20, "price": 29.99, "supplier": "SmokeTech", "category": 1, "image": "https://grav.com/cdn/shop/products/grav-r-small-wide-base-water-pipe-in-smoke-with-black-accents-4.jpg?v=1694116143"},
    {"name": "Wooden Pipe", "quantity": 30, "price": 19.99, "supplier": "GreenLeaf", "category": 1, "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpF4zoGTtNxzBMQm_gFZVwmPj7JhX8iZQ7aU2U3Habhw&s"},
    {"name": "Metal Grinder", "quantity": 50, "price": 9.99, "supplier": "SmokeTech", "category": 1, "image": "https://i.ebayimg.com/images/g/LYUAAOSw7iZeDuHS/s-l1200.jpg"},
    {"name": "Clipper Lighter", "quantity": 200, "price": 1.99, "supplier": "FireLight", "category": 1, "image": "https://www.ubuy.com.ar/productimg/?image=aHR0cHM6Ly9tLm1lZGlhLWFtYXpvbi5jb20vaW1hZ2VzL0kvNTFlekUtWHFDTEwuX1NTNDAwXy5qcGc.jpg"},
    {"name": "Tequila Reposado", "quantity": 15, "price": 39.99, "supplier": "AgaveLiquor", "category": 2, "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2PCd5dVDbbbHJlYPyu04v-IqPdLxItNDQjUiFZhHb6g&s"},
    {"name": "Single Malt Scotch Whisky", "quantity": 10, "price": 59.99, "supplier": "HighlandsDistillery", "category": 2, "image": "https://acdn.mitiendanube.com/stores/001/157/846/products/copia-de-diseno-sin-nombre-2022-03-09t092557-1431-0c74d4fd485814522f16468287918542-1024-1024.png"},
  ];

  const handleClick = (offer) => {
    setProduct(offer)
    
  }

  return (
    <>
      <CommerceSidebar />
      <div className="flex flex-col items-center w-full bg-gray-200">
        <div className='w-2/3'>
          <SearchBarCommerce />
        </div>
        <div className="flex flex-wrap justify-center mt-8 cursor-pointer">
        <div className="flex flex-wrap justify-center mt-8 cursor-pointer">
  {all_offers.map((offer, index) => (
    <div onClick={() => handleClick(offer)} key={index} className="max-w-sm w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 bg-white shadow-md rounded-lg overflow-hidden m-4 hover:shadow-lg transition duration-300">
      <img className="w-full h-40 object-cover object-center" src={offer.image} alt={offer.name} />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{offer.name}</h3>
        <p className="text-gray-600 mb-2">${offer.price}</p>
        <p className="text-gray-600 mb-2">Quantity: {offer.quantity}</p>
        <p className="text-gray-600 mb-2">Supplier: {offer.supplier}</p>
        <p className="text-gray-600 mb-2">Category: {offer.category}</p>
      </div>
    </div>
  ))}
</div>
</div>
      </div>
    </>
  );
}

export default DistributorComerce;