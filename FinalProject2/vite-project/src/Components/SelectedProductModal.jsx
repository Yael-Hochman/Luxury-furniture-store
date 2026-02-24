import React from 'react';
import { AllProductStyle } from './AllProductStyle';

const SelectedProductModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div style={AllProductStyle.modalOverlay}>
      <div style={AllProductStyle.modalContent}>
        <button onClick={onClose} style={AllProductStyle.closeButton}>X</button>
        <img src={product.image} alt={product.name} style={{ width: '100%', maxHeight: 250, objectFit: 'cover' }} />
        <h2 style={{ color: '#d4af37' }}>{product.name}</h2>
        <p>{product.description}</p>
        <p><strong>Price:</strong> {product.price} ₪</p>
        <p><strong>Stock:</strong> {product.stockQuantity}</p>
      </div>
    </div>
  );
};

export default SelectedProductModal;
