import React from 'react';

const Title = ({ text, className }) => {
  return (
    <h1 className={`text-center text-6xl font-bold leading-9 tracking-tight text-gray-900 ${className}`}>
      {text}
    </h1>
  );
};

export default Title;
