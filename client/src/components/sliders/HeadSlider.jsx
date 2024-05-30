import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HeadSlider = () => {
    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    const sliderItems = [
        {
            image: 'https://res.cloudinary.com/doqyrz0sg/image/upload/v1716867149/Green_and_Yellow_Simple_Clean_Shoes_Sale_Banner_chica_tsondi.jpg',
            title: 'Top Quality Products',
            description: 'Find the best products here.'
        },
        {
            image: 'https://res.cloudinary.com/doqyrz0sg/image/upload/v1716867149/Green_and_Yellow_Simple_Clean_Shoes_Sale_Banner_chica_tsondi.jpg',
            title: 'Wide Range of Categories',
            description: 'Explore products across various categories.'
        },
        {
            image: 'https://res.cloudinary.com/doqyrz0sg/image/upload/v1716867149/Green_and_Yellow_Simple_Clean_Shoes_Sale_Banner_chica_tsondi.jpg',
            title: 'Best Prices Guaranteed',
            description: 'Get the best deals on top products.'
        }
    ];

    return (
        <div className="w-full bg-gradient-to-b mt-14 from-[#F2BB26] pb-5 to-gray-200 p-3 mx-auto">
            <Slider {...settings}>
                {sliderItems.map((item, index) => (
                    <div key={index} className="flex w-full mx-auto justify-center items-center md:h-[34rem]">
                        <img src={item.image} alt={item.title} className="h-full md:w-[85%] mx-auto w-full object-fit rounded-lg" />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default HeadSlider;
