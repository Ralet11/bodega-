import React from 'react';
import { Toaster } from 'react-hot-toast';
import './toasterStyles.css';
import { useLocation } from 'react-router-dom';

const ToasterConfig = () => {
  const location = useLocation();
  const toastStyle = location.pathname === "/settings" ? "md:mt-12" : "";

  return (
    <div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName={`z-50 mt-1 h-36 ${toastStyle}`}
        toastOptions={{
          className: "custom-toast",
          duration: 3000,
          style: {
            background: '#ffc8c8',
            color: '#000',
            fontSize: '17px',
          },
          success: {
            duration: 3000,
            style: {
              background: '#00A868',
              color: '#FFFF',
              fontWeight: 'bold',
            },
          },
          error: {
            duration: 3000,
            style: {
              background: '#C43433',
              color: '#fff',
              fontWeight: 'bold',
            },
          },
        }}
      />
    </div>
  );
};

export default ToasterConfig;
