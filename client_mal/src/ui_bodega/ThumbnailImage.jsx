import React from 'react';

const ThumbnailImage = ({ src, alt, onClick }) => {
  return (
    <a href="#" className="block" onClick={() => onClick(src)}>
      <img src={src} alt={alt} className="w-12 h-12 m-2 rounded-full" />
    </a>
  );
};

export default ThumbnailImage;
