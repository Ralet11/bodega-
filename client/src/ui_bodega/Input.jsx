import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Input = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <input
        className={`px-2 mb-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${props.className}`}
        {...props}
        type={showPassword && props.type === 'password' ? 'text' : props.type}
      />
      {props.type === 'password' && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
  );
};

export default Input;
