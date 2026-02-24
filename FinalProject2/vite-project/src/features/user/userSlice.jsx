import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const localUser = localStorage.getItem("currentUser");

const initialState = {
  currentUser: localUser ? JSON.parse(localUser) : null,
  status: 'idle',
  error: null
};

export const login = createAsyncThunk('user/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await axios.post('http://localhost:4000/user/login', credentials);
    return res.data;
  } catch (err) {
    // כאן אנחנו לוקחים את הטקסט שהשרת שלח (401) ומעבירים אותו ל-Slice
    return rejectWithValue(err.response.data);
  }
});

export const register = createAsyncThunk('user/register', async (userData) => {
  const res = await axios.post('http://localhost:4000/user/register', userData);
  return res.data;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.currentUser = null;
      localStorage.removeItem("currentUser");
    }
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
        localStorage.setItem("currentUser", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "משהו השתבש";
      })
      .addCase(register.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
        localStorage.setItem("currentUser", JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
