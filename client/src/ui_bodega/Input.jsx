import React from 'react';

const Input = (props) => {
  const { className, ...rest } = props; // Extraer className de las props
  return (
    <input
      className={`block w-full border-l rounded-lg border-gray-200 shadow-lg rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${className}`}
      {...rest} // Pasar todas las props restantes al input
    />
  );
};

export default Input;
