import React, { useState } from 'react';

const ShopSelector = ({ shops, onSelectShop }) => {
  const [isHovered, setIsHovered] = useState(null);

  const handleMouseEnter = (id) => {
    setIsHovered(id);
  };

  const handleMouseLeave = () => {
    setIsHovered(null);
  };

  const styles = {
    container: {
      margin: '16px 0',
      textAlign: 'center',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: '16px',
    },
    button: {
      margin: '8px',
      width: '100px',
      height: '100px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      border: '1px solid #ddd',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#666',
      cursor: 'pointer',
      transition: 'transform 0.3s ease, background-color 0.3s ease',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    },
    buttonHover: {
      transform: 'scale(1.1)', // Ajuste para hacer el botón más grande al pasar el ratón
      backgroundColor: '#e0e0e0',
    },
  };

  return (
    <div style={styles.container}>
      <h2 className="text-center text-2xl font-bold">Welcome to your Shops</h2>
      <div style={styles.buttonContainer}>
        <button
          style={{
            ...styles.button,
            ...(isHovered === 'all' && styles.buttonHover),
          }}
          onMouseEnter={() => handleMouseEnter('all')}
          onMouseLeave={handleMouseLeave}
          onClick={() => onSelectShop('all')}
        >
          All
        </button>
        {shops.map((shop) => (
          <button
            key={shop.id}
            style={{
              ...styles.button,
              ...(isHovered === shop.id && styles.buttonHover),
            }}
            onMouseEnter={() => handleMouseEnter(shop.id)}
            onMouseLeave={handleMouseLeave}
            onClick={() => onSelectShop(shop.id)}
          >
            {shop.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShopSelector;
