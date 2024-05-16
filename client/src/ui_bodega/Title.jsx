import React from 'react';

const Title = ({ text, className }) => {
  return (
    <h1 className={className ? `${className}` : `text-center text-6xl font-bold leading-9 tracking-tight text-gray-900`}>
      {text}
    </h1>
  );
};

export default Title;

