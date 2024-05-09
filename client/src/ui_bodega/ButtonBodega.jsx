import React from 'react';

const ButtonBodega = ({ children, className,  ...rest }) => {
  return (
    <button
      {...rest}
      className={` font-bold rounded-full border border-white ${className}`}
       // Aquí establecemos el ancho usando la prop 'width'
    >
      {children}
    </button>
  );
};

export default ButtonBodega;
