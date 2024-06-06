import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';

const GoBackArrow = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1); // This function takes you to the previous page
    };

    return (
        <div
            onClick={goBack}
            className=' cursor-pointer mt-20 h-screen fixed top-[0.5%] left-[0.5%] md:left-[12.5%]'
        >
            <div className='p-2 flex gap-6 rounded-lg'>
                <ArrowLeftIcon className='w-8 h-8 text-black sm:w-6 sm:h-6 md:w-8 md:h-8' />
            </div>
        </div>
    );
}

export default GoBackArrow;