import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (userId, thunkAPI) => {
    if (!userId) throw new Error("No userId provided");
    const response = await fetch(`http://localhost:4000/order?userId=${userId}`);
    if (!response.ok) {
      const text = await response.text();
      console.error('Server response:', text);
      throw new Error('Failed to fetch orders');
    }
    const data = await response.json();
    return data;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default orderSlice.reducer;
