import React from 'react';
import { Toaster } from 'react-hot-toast';
import './toasterStyles.css'

const ToasterConfig = () => {
  return (
    <div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName="z-50 mt-1 h-36"
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