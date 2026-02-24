import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],  // כל הפריטים עם כמות
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existing = state.cartItems.find(item => item.id === product.id);
      if (existing) {
        existing.qty += product.qty;
      } else {
        state.cartItems.push({ ...product });
      }
      state.totalAmount = state.cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    },
    removeFromCart(state, action) {
      state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
      state.totalAmount = state.cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    },
    updateQuantity(state, action) {
      const { code, qty } = action.payload;
      const item = state.cartItems.find(i => i.id === code);
      if (item) {
        item.qty = qty;
      }
      state.totalAmount = state.cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    },
    clearCart(state) {
      state.cartItems = [];
      state.totalAmount = 0;
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
