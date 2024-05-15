import React from 'react';

const ThumbnailImage = ({ src, alt, onClick }) => {
  return (
    <a href="#" className="block transform transition duration-300 hover:scale-105" onClick={() => onClick(src)}>
      <img src={src} alt={alt} className="w-20 h-20 m-2 rounded-lg shadow-md hover:shadow-lg object-cover" />
    </a>
  );
};

export default ThumbnailImage;