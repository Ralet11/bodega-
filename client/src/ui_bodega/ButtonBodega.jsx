import React from 'react';

const ButtonBodega = ({ children, className,  ...rest }) => {
  return (
    <button
      {...rest}
      className={`mt-5 px-6 font-bold rounded-full  text-yellow-600 bg-black border border-white hover:text-black hover:bg-yellow-600 ${className}`}
       // Aquí establecemos el ancho usando la prop 'width'
    >
      {children}
    </button>
  );
};

export default ButtonBodega;
