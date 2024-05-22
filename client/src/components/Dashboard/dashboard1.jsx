import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { CurrencyDollarIcon, StarIcon, ShoppingBagIcon } from '@heroicons/react/24/solid';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, Dot } from 'recharts';
import axios from 'axios'
import {getParamsEnv} from './../../functions/getParamsEnv.js'
import {useSelector} from 'react-redux'
import dayjs from 'dayjs';

import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrAfter);

const {API_URL_BASE} = getParamsEnv()


function Dashboard1() {
  const [isChecked, setIsChecked] = useState(true);
  
  const [totalSalesDay, setTotalSalesDay] = useState(0);
  const [totalSalesMonth, setTotalSalesMonth] = useState(0);
  const [topProductId, setTopProductId] = useState(null);
  const [localProducts, setLocalProducts] = useState(null);

  const shop = useSelector((state) => state?.activeShop)
  const token = useSelector((state) => state?.client.token)

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  const salesAndComparisonData = [
    { name: 'January', 'Current Sales': 12000, 'Last Year Sales': 10000 },
    { name: 'February', 'Current Sales': 14500, 'Last Year Sales': 13000 },
    { name: 'March', 'Current Sales': 13200, 'Last Year Sales': 11000 },
    { name: 'April', 'Current Sales': 15500, 'Last Year Sales': 12000 },
  ];

  const mostSoldItemsData = [
    { name: 'Item 1', 'sold this month': 20 },
    { name: 'Item 2', 'sold this month': 15 },
    { name: 'Item 3', 'sold this month': 10 },
  ];

  const salesAndCategoriesData = [
    { name: 'Jan', thisQuarter: 10, lastQuarter: 6 },
    { name: 'Feb', thisQuarter: 15, lastQuarter: 10 },
    { name: 'Mar', thisQuarter: 8, lastQuarter: 12 },
    { name: 'Apr', thisQuarter: 10, lastQuarter: 11 },
  ];

  useEffect(() => {
    const fetchOrdersByDay = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/orders/get/${shop}`, {
          headers: {
            authorization: `Bearer ${token}`
          }
        });

        console.log(response.data, "orders");

        // Process orders
        let totalSalesValueDay = 0;
        let totalSalesValueMonth = 0;
        const productSalesCount = {};
        const today = dayjs().startOf('day');
        const startOfMonth = dayjs().startOf('month');

        response.data.forEach(order => {
          const orderDate = dayjs(order.date_time);
          const orderDetails = order.order_details.orderDetails;

          if (Array.isArray(orderDetails)) {
            orderDetails.forEach(detail => {
              if (typeof detail.price === 'number' && typeof detail.id === 'number') {
                // Add to total sales value for the day
                if (orderDate.isSame(today, 'day')) {
                  totalSalesValueDay += detail.price;
                }

                // Add to total sales value for the month
                if (orderDate.isSameOrAfter(startOfMonth)) {
                  totalSalesValueMonth += detail.price;
                }

                // Count each product sale
                if (!productSalesCount[detail.id]) {
                  productSalesCount[detail.id] = 0;
                }
                productSalesCount[detail.id] += 1;
              }
            });
          } else {
            console.error('orderDetails is not an array', order);
          }
        });

        // Determine the most sold product
        let mostSoldProductId = null;
        let maxSalesCount = 0;

        Object.entries(productSalesCount).forEach(([productId, count]) => {
          if (count > maxSalesCount) {
            mostSoldProductId = productId;
            maxSalesCount = count;
          }
        });

        setTotalSalesDay(totalSalesValueDay);
        setTotalSalesMonth(totalSalesValueMonth);
        setTopProductId(mostSoldProductId);

      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrdersByDay();
  }, [shop, token]);

  useEffect(() => {
    const fetchProductsByLocal = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/products//getByLocalId/${shop}`, {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
        console.log(response.data, "productos ready")
        setLocalProducts(response.data.length)

      } catch (error) {
        console.log(error)
      }
    }
    fetchProductsByLocal()
  },[])

console.log(localProducts)
console.log(totalSalesMonth, totalSalesDay, topProductId)

  const sortedMostSoldItemsData = mostSoldItemsData.sort((a, b) => b['sold this month'] - a['sold this month']);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  if (isMobile) {
    return (
      <div className="flex flex-col p-4 pt-20 pb-20 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className='flex flex-col w-full'>
            <div className='flex justify-between w-full mb-4'>
              <div className='bg-cards1 shadow-lg w-[48%] h-[100%] rounded-lg flex items-center p-2'>
                <div className='w-10 h-10 flex items-center  justify-center'>
                  <CurrencyDollarIcon className='text-blue-500' />
                </div>
                <div className='ml-3'>
                  <span className='text-[20px]'><strong>${totalSalesDay.toFixed(2)}</strong></span>
                  <p className='text-[13px]'>Sold Today</p>
                </div>
              </div>
              <div className='bg-cards1 shadow-lg w-[48%] h-[100%] rounded-lg flex items-center p-2'>
                <div className='w-10 h-10 flex items-center justify-center'>
                  <CurrencyDollarIcon className='text-red-500' />
                </div>
                <div className='ml-3'>
                  <span className='text-[20px]'><strong>${totalSalesMonth.toFixed(2)}</strong></span>
                  <p className='text-[13px]'>This month</p>
                </div>
              </div>
            </div>
            <div className='flex shadow-lg justify-between w-full'>
              <div className='bg-cards1 w-[48%] h-[100%] rounded-lg flex items-center p-2 mb-4'>
                <div className='w-10 h-10 flex items-center justify-center'>
                  <ShoppingBagIcon className='text-green-500' />
                </div>
                <div className='ml-3'>
                  <span className='ml-2 text-[20px]'><strong>{localProducts}</strong></span>
                  <p className='text-[12.3px] ml-2'>Products ready</p>
                </div>
              </div>
              <div className='bg-cards1 shadow-lg w-[48%] h-[100%] rounded-lg flex items-center p-2 mb-4'>
                <div className='w-10 h-10 flex items-center justify-center'>
                  <StarIcon className='text-yellow-500' />
                </div>
                <div className='ml-3'>
                  <span className='text-[23px] font-bold'>$5500.00</span>
                  <p className='text-[13px]'>Bodega Balance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-grow mb-6">
          <h2 className="text-lg font-semibold">Sales Comparison</h2>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={salesAndComparisonData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='Current Sales' fill="rgba(112, 161, 255, 0.6)" stroke="#70a1ff" strokeWidth={2} />
                <Bar dataKey='Last Year Sales' fill="rgba(0, 216, 216, 0.6)" stroke="#00d8d8" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex-grow mb-6">
          <h2 className="text-lg font-semibold">Most Sold Items</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart layout="vertical" data={sortedMostSoldItemsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="sold this month" fill="#0072B2" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex-grow mb-6">
          <h2 className="text-lg font-semibold">Sales & Categories</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={salesAndCategoriesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="thisQuarter" name="This Quarter" stroke="#8884d8" fill="#8884d8" dot={<Dot r={6} strokeWidth={2} />} />
                <Area type="monotone" dataKey="lastQuarter" name="Last Quarter" stroke="#82ca9d" fill="#82ca9d" dot={<Dot r={6} strokeWidth={2} />} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }
  

  return (
    <div className='flex flex-col w-[93%] h-[85%] mt-[86px] ml-[85px] p-5'>
      <div className='w-[100%] h-[14%] flex justify-between pl-6 pr-6'>
        <div className='bg-cards1 w-[20%] h-[100%] rounded-full flex items-center'>
          <div className='w-10 h-10 ml-5 flex items-center justify-center'>
            <CurrencyDollarIcon className='text-blue-500' />
          </div>
          <div>
            <span className='text-[20px] ml-[30px] mt-4'><strong>${totalSalesDay.toFixed(2)}</strong></span>
            <p className='ml-5 text-[13px]'>Sold Today</p>
          </div>
        </div>
        <div className='bg-cards1 w-[20%] h-[100%] rounded-full flex items-center'>
          <div className='w-10 h-10 ml-5 flex items-center justify-center'>
            <CurrencyDollarIcon className='text-red-500' />
          </div>
          <div>
            <span className='text-[20px] ml-[30px] pt-3'><strong>${totalSalesMonth.toFixed(2)}</strong></span>
            <p className='ml-5 text-[13px]'>This month</p>
          </div>
        </div>
        <div className='bg-cards1 w-[18%] h-[100%] rounded-full flex items-center'>
          <div className='w-10 h-10 ml-5 flex items-center justify-center'>
            <ShoppingBagIcon className='text-green-500' />
          </div>
          <div>
            <span className='text-[20px] ml-[30px] pt-3'><strong>115</strong></span>
            <p className='ml-5 text-[13px] ml-2'>Products ready</p>
          </div>
        </div>
        <div className='bg-cards1 w-[17%] h-[100%] rounded-full flex items-center'>
          <div className='w-10 h-10 ml-5 flex items-center justify-center'>
            <StarIcon className='text-yellow-500' />
          </div>
          <div className='ml-3'>
          <span className='text-[23px] font-bold'>$5500.00</span>
                  <p className='text-[13px]'>Bodega Balance</p>
          </div>
        </div>
      </div>

      <div className='w-[100%] h-[43%] flex gap-4 pl-6 pr-6'>
        <div className='bg-cards1 w-[81%] h-[100%] rounded-lg mt-5 p-5'>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={salesAndComparisonData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='Current Sales' fill="rgba(112, 161, 255, 0.6)" stroke="#70a1ff" strokeWidth={2} />
              <Bar dataKey='Last Year Sales' fill="rgba(0, 216, 216, 0.6)" stroke="#00d8d8" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className='bg-cards1 w-[22.1%] h-[100%] rounded-lg mt-5 ml-[60px]'>
          <div className='min-h-[280px] max-h-[280px]'>
            <div className="bg-white shadow-md rounded-md p-4 space-y-2">
              <input
                className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] focus:before:scale-100 focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                type="checkbox"
                role="switch"
                id="flexSwitchChecked"
                checked={isChecked}
                onChange={handleToggle}
              />
              <label
                className="inline-block pl-[0.15rem] hover:cursor-pointer"
                htmlFor="flexSwitchChecked"
              >
                {isChecked ? 'Ready for receiving orders!' : 'Not ready'}
              </label>
            </div>
            <div className='max-h-[100%]'>
              <img
                className='max-h-[170px] w-[90%] m-auto'
                src={isChecked ? '../../../public/img/rocketReady.png' : '../../../public/img/rocketNotActive.png'}
                alt="Rocket"
                style={{ opacity: 0.7, transition: 'opacity 0.3s' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className='w-[100%] h-[43%] flex gap-5 pl-5 pr-6 gap-6'>
        <div className='bg-cards1 w-[50%] h-[80%] rounded-lg ml-[8px] mt-[40px]'>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart layout="vertical" data={sortedMostSoldItemsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="sold this month"
                fill="#0072B2"
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          className='w-[50%] h-[80%] rounded-lg mt-[40px] ml-[60px]'
          style={{
            background: "white"
          }}
        >
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={salesAndCategoriesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="thisQuarter" name="This Quarter" stroke="#8884d8" fill="#8884d8" dot={<Dot r={6} strokeWidth={2} />} />
              <Area type="monotone" dataKey="lastQuarter" name="Last Quarter" stroke="#82ca9d" fill="#82ca9d" dot={<Dot r={6} strokeWidth={2} />} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard1;
