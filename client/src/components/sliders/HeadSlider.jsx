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
            image: 'https://res.cloudinary.com/doqyrz0sg/image/upload/v1719847074/fume_cejexw.png',
            title: 'Top Quality Products',
            description: 'Find the best products here.'
        },
        {
            image: 'https://www.nepawholesale.com/web/image/187806-603577af/1905x538px%20Premium%20Cigars_5_16%20copy%204.webp',
            title: 'Wide Range of Categories',
            description: 'Explore products across various categories.'
        }
    ];

    return (
        <div className="w-full bg-gradient-to-b md:mt-10  md:ml-8 from-[#F2BB26] pb-5 to-gray-200 p-3 mx-auto">
            <Slider {...settings}>
                {sliderItems.map((item, index) => (
                    <div key={index} className="flex w-full mx-auto justify-center items-center md:h-[34rem]">
                        <img src={item.image} alt={item.title} className="h-full md:w-[85%] mx-auto w-full object-contain rounded-lg" />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default HeadSlider;