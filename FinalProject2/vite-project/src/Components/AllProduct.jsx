import React, { useState, useEffect } from "react";
import UserForm from "../features/user/UserForm";
import { AllProductStyle } from './AllProductStyle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSelector, useDispatch } from 'react-redux';
import SelectedProductModal from './SelectedProductModal';
import { addToCart } from '../features/cart/cartSlice';

function Logo() {
  return (
    <div style={AllProductStyle.logoContainer}>
      <span style={AllProductStyle.logoText}>Luxury housewares</span>
    </div>
  );
}

export default function AllProduct() {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.currentUser);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/product")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(err => console.error("Error loading products:", err));
  }, []);

  useEffect(() => {
    let updatedProducts = [...products];

    if (searchTerm) {
      updatedProducts = updatedProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortOption) {
      case "priceAsc":
        updatedProducts.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        updatedProducts.sort((a, b) => b.price - a.price);
        break;
      case "stockAsc":
        updatedProducts.sort((a, b) => a.stockQuantity - b.stockQuantity);
        break;
      case "stockDesc":
        updatedProducts.sort((a, b) => b.stockQuantity - a.stockQuantity);
        break;
      default:
        break;
    }

    setFilteredProducts(updatedProducts);
  }, [searchTerm, sortOption, products]);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    if (!currentUser) {
      setSelectedProduct(null);
      setShowForm(true);
      return;
    }
    const quantity = quantities[product.id] || 1;
    if (quantity < 1 || quantity > product.stockQuantity) {
      alert("Invalid quantity");
      return;
    }
    dispatch(addToCart({ ...product, qty: quantity }));
    alert(`Added ${quantity} unit(s) of '${product.name}' to the cart.`);
    setQuantities(prev => ({
      ...prev,
      [product.id]: 1,
    }));
  };

  const handleQuantityChange = (productId, value) => {
    const number = parseInt(value);
    if (isNaN(number)) return;
    setQuantities(prev => ({
      ...prev,
      [productId]: number,
    }));
  };

  const handleCardClick = (product) => {
    if (!currentUser) {
      setSelectedProduct(null);
      setShowForm(true);
      return;
    }
    setSelectedProduct(product);
  };

  return (
    <div style={AllProductStyle.page}>
      <Logo />

      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 30 }}>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 8,
            border: '1.5px solid #d4af37',
            width: 200,
            backgroundColor: '#121212',
            color: '#f0e6d2',
            fontWeight: '600'
          }}
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 8,
            border: '1.5px solid #d4af37',
            width: 220,
            backgroundColor: '#121212',
            color: '#f0e6d2',
            fontWeight: '600'
          }}
        >
          <option value="">Sort by</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="stockAsc">Stock: Low to High</option>
          <option value="stockDesc">Stock: High to Low</option>
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <div style={{
          color: '#d4af37',
          fontSize: '1.8rem',
          fontWeight: '700',
          textAlign: 'center',
          marginTop: 50,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          userSelect: 'none'
        }}>
          No matching results
        </div>
      ) : (
        <div style={AllProductStyle.productsGrid}>
          {filteredProducts.map(product => (
            <div
              key={product.id}
              style={AllProductStyle.card}
              onClick={() => handleCardClick(product)}
            >
              <div style={AllProductStyle.imageRow}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={AllProductStyle.productImage}
                />
              </div>

              <div style={AllProductStyle.infoColumn}>
                <h3 style={AllProductStyle.productName}>{product.name}</h3>
                <p style={AllProductStyle.productDesc}>{product.description}</p>
                <strong style={AllProductStyle.productPrice}>{product.price} ₪</strong>

                {product.stockQuantity > 0 ? (
                  <label style={AllProductStyle.qtyLabel}>
                    Quantity:{" "}
                    <input
                      type="number"
                      min="1"
                      max={product.stockQuantity}
                      value={quantities[product.id] || 1}
                      onClick={e => e.stopPropagation()}
                      onChange={e => handleQuantityChange(product.id, e.target.value)}
                      style={AllProductStyle.qtyInput}
                    />
                  </label>
                ) : (
                  <div style={AllProductStyle.outOfStock}>Out of stock</div>
                )}
              </div>

              <button
                onClick={(e) => handleAddToCart(product, e)}
                disabled={product.stockQuantity === 0}
                style={{
                  ...AllProductStyle.cartButton,
                  opacity: product.stockQuantity === 0 ? 0.5 : 1,
                  cursor: product.stockQuantity === 0 ? 'not-allowed' : 'pointer',
                }}
                title={product.stockQuantity === 0 ? 'Out of stock' : 'Add to cart'}
              >
                <ShoppingCartIcon fontSize="small" />
                Add to cart
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={AllProductStyle.modalOverlay}>
          <div style={AllProductStyle.modalContent}>
            <UserForm
              product={selectedProduct}
              onClose={() => setShowForm(false)}
              onContinue={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {selectedProduct && currentUser && (
        <SelectedProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
