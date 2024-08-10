import React, { useState } from 'react';

const ShopSelector = ({ shops, onSelectShop }) => {
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [isHovered, setIsHovered] = useState(null);

  const handleSelectShop = (id) => {
    setSelectedShopId(id); // Actualiza el estado de la tienda seleccionada
    onSelectShop(id); // Llama a la función externa con el ID seleccionado
  };

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
      padding: '8px 12px',
      minWidth: '80px',
      maxWidth: '150px',
      backgroundColor: '#f8f9fa',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      border: '1px solid #ddd',
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#666',
      cursor: 'pointer',
      transition: 'transform 0.3s ease, background-color 0.3s ease',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      flexGrow: 1,
    },
    buttonHover: {
      transform: 'scale(1.05)',
      backgroundColor: '#e0e0e0',
    },
    buttonSelected: {
      backgroundColor: '#F2BB26', // Fondo amarillo #F2BB26 para el botón seleccionado
      color: '#000', // Texto negro para el botón seleccionado
      border: '1px solid #ccac00', // Borde más oscuro para el botón seleccionado
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.buttonContainer}>
        <button
          style={{
            ...styles.button,
            ...(isHovered === 'all' && styles.buttonHover),
            ...(selectedShopId === 'all' && styles.buttonSelected),
          }}
          onMouseEnter={() => handleMouseEnter('all')}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleSelectShop('all')}
        >
          All
        </button>
        {shops.map((shop) => (
          <button
            key={shop.id}
            style={{
              ...styles.button,
              ...(isHovered === shop.id && styles.buttonHover),
              ...(selectedShopId === shop.id && styles.buttonSelected),
            }}
            onMouseEnter={() => handleMouseEnter(shop.id)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleSelectShop(shop.id)}
            title={shop.name}
          >
            {shop.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShopSelector;