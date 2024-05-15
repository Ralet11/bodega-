import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDownLeftIcon } from "@heroicons/react/24/solid";
import { ArrowLeftIcon } from 'lucide-react';

const GoBackArrow = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1); // Esta función te lleva a la página anterior
    };

    return (
        <div onClick={goBack} className='cursor-pointer mt-20 h-screen' style={{ position: 'fixed', top: '2.4%', left: '12.5%' }}>
            <div className='p-2 flex gap-6 rounded-lg'>
                <ArrowLeftIcon className='w-8 h-8 text-yellow-600' />
                
            </div>
        </div>
    );
}

export default GoBackArrow;