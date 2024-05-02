import React, { useEffect, useState } from 'react';
import CreateDiscountModal from '../modal/CreateDiscountModal';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getParamsEnv } from '../../functions/getParamsEnv';

const { API_URL_BASE } = getParamsEnv();

const Discounts = () => {

    const [showAddDiscountModal, setShowAddDiscountModal] = useState(false);
    const [aux, setAux] = useState(false);
    const [discounts, setDiscounts] = useState(null);
    const [products, setProducts] = useState({});
    const shop = useSelector((state) => state?.activeShop);
    
    console.log(shop);

    useEffect(() => {
        const fetchDiscounts = async () => {
            try {
                const response = await axios.get(`${API_URL_BASE}/api/discounts/getAll`);
                
                console.log(response.data);
                setDiscounts(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchDiscounts();
    }, [aux]);

    useEffect(() => {

        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_URL_BASE}/api/products/getByLocalId/${shop}`);
                setProducts(response.data);
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        };

        fetchProducts();
    }, []);

    console.log(products);

    const handleAddDiscount = () => {
        console.log("papa");
        setShowAddDiscountModal(true);
    };

    // Divide el array en grupos de 3
    const groupedDiscounts = discounts ? discounts.reduce((acc, curr, index) => {
        const chunkIndex = Math.floor(index / 3);
        if (!acc[chunkIndex]) {
            acc[chunkIndex] = [];
        }
        acc[chunkIndex].push(curr);
        return acc;
    }, []) : [];

    return (
        <>
            <div className='mt-[100px] ml-[100px]'>
                <h1 className="text-3xl font-bold mb-4">Discounts</h1>
                <div className='mt-20 ml-20'>
                    {groupedDiscounts.map((row, rowIndex) => (
                        <div key={rowIndex} className='flex flex-row gap-10'>
                            {row.map((discount, index) => (
                                <div key={index} className="bg-black rounded-2xl shadow-sm shadow-sky-500-outline-offset-8 mb-4">
                                    <p className='mb-[-23px] font-bold text-white pl-2 w-full ml-[250px]'>{discount.limitDate.substring(5)}</p>
                                    <div className="group overflow-hidden relative after:duration-500 before:duration-500 duration-500 hover:after:duration-500 hover:after:translate-x-24 hover:before:translate-y-12 hover:before:-translate-x-32 hover:duration-500 after:absolute after:w-24 after:h-24 after:rounded-full after:blur-xl after:bottom-0 after:right-16 after:w-12 after:h-12 before:absolute before:w-20 before:h-20 before:rounded-full before:blur-xl before:top-full before:right-16 before:w-12 before:h-12 hover:rotate-12 flex justify-center items-center h-56 w-80 rounded-2xl outline outline-slate-400 -outline-offset-8" style={{ backgroundImage: `url(${discount.image})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                        <div className="z-10 flex flex-col items-center gap-2 w-full h-full">
                                            <p className="text-gray-50 bg-blue-500 bg-opacity-25 w-full p-5">{discount.productName}</p>
                                            <div className='flex flex-row mt-auto bg-blue-500 bg-opacity-50 w-full'>
                                                <p className="text-black font-bold text-2xl mr-20 w-full p-5" style={{textDecoration: 'line-through', textDecorationThickness: '0.1em'}}>${discount.initialPrice}</p>
                                                <p className="text-gray-50 font-bold text-2xl w-full p-5">${discount.discountPrice}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className='mt-[-23px] font-bold text-white pl-2'>-{discount.percentage}%</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <button onClick={handleAddDiscount} className="ml-20 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Add New Discount</button>
            </div>
            {showAddDiscountModal && (
                <CreateDiscountModal products={products} aux={aux} setAux={setAux} setShowAddDiscountModal={setShowAddDiscountModal}/>
            )}
        </>
    );
};

export default Discounts;