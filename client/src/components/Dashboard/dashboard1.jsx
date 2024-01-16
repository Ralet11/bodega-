import React from 'react';
import { CurrencyDollarIcon, StarIcon, ShoppingBagIcon } from '@heroicons/react/24/solid';
import SalesAndCategoriesChart from '../charts/TopOrdersCard';
import AreaChartComponent from '../charts/areaChart';
import CardWithSwitch from './ActiveShopCard';
import MostSelledItemsChart from '../charts/mostSold';

function Dashboard1() {
    return (
        <div className='flex flex-col w-[93%] h-[85%] mt-[86px] ml-[85px] p-5'>
            <div className='w-[100%] h-[14%] flex justify-between pl-6 pr-6'>
                <div className='bg-cards1 w-[20%] h-[100%] rounded-full flex items-center'>
                    <div className='w-10 h-10 ml-5 flex items-center justify-center'>
                        <CurrencyDollarIcon className='text-blue-500' />
                    </div>
                    <div>
                        <span className='text-[20px] ml-[30px] mt-4'><strong>$3,251</strong></span>
                        <p className='text-[13px]'>Sold Today</p>
                    </div>
                </div>
                <div className='bg-cards1 w-[20%] h-[100%] rounded-full flex items-center'>
                    <div className='w-10 h-10 ml-5 flex items-center justify-center'>
                        <CurrencyDollarIcon className='text-red-500' />
                    </div>
                    <div>
                        <span className='text-[20px] ml-[30px] pt-3'><strong>$15,251</strong></span>
                        <p className='text-[13px]'>This month</p>
                    </div>
                </div>
                <div className='bg-cards1 w-[18%] h-[100%] rounded-full flex items-center'>
                    <div className='w-10 h-10 ml-5 flex items-center justify-center'>
                        <ShoppingBagIcon className='text-green-500' />
                    </div>
                    <div>
                        <span className='text-[20px] ml-[30px] pt-3'><strong>115</strong></span>
                        <p className='text-[13px] ml-2'>Products ready</p>
                    </div>
                </div>
                <div className='bg-cards1 w-[20%] h-[100%] rounded-full flex items-center'>
                    <div className='w-10 h-10 ml-5 flex items-center justify-center'>
                        <StarIcon className='text-yellow-500' />
                    </div>
                    <div className='ml-3'>
                        <span className='text-[23px] font-bold ml-[30px]'>4.9</span>
                        <p className='text-[13px]'>out of 5</p>
                    </div>
                </div>
            </div>

            <div className='w-[100%] h-[43%] flex gap-4 pl-6 pr-6'>
                <div className='bg-cards1 w-[81%] h-[100%] rounded-lg mt-5 p-5'>
                    <SalesAndCategoriesChart />
                </div>
                <div className='bg-cards1 w-[22.1%] h-[100%] rounded-lg mt-5 ml-[60px]'>
                    <CardWithSwitch />
                </div>
            </div>

            <div className='w-[100%] h-[43%] flex gap-5 pl-5 pr-6 gap-6'>
                <div className='bg-cards1 w-[50%] h-[80%] rounded-lg ml-[8px] mt-[40px]'>
                    <MostSelledItemsChart />
                </div>
                
                <div
                    className='w-[50%] h-[80%] rounded-lg mt-[40px] ml-[60px]'
                    style={{
                        background: "white"
                    }}
                >
                    <AreaChartComponent />
                </div>



            </div>
        </div>
    );
}

export default Dashboard1;
