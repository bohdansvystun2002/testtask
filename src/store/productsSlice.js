import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import formatDate from '../utils/formatter';
// This file manages the products state, including fetching, adding, and updating products
// here we define the actions and reducers for the products slice
// It includes asynchronous actions for fetching products from the server, adding a new product, and updating an existing product
// Here I had troubles with adding a comment with date to the new product bu
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const res = await axios.get('http://localhost:3001/products');
  return res.data;
});

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (product) => {
    const res = await axios.post('http://localhost:3001/products', product);
    return res.data;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (product) => {
    const res = await axios.put(`http://localhost:3001/products/${product.id}`, product);
    return res.data;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = 'succeeded';
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        // Додаємо коментар з датою для нового продукту
        const newProduct = action.payload;
        if (!newProduct.comments) {
          newProduct.comments = [];
        }
        if (newProduct.initialComment) {
          newProduct.comments.push({
            id: newProduct.id,
            productId: newProduct.id,
            description: newProduct.initialComment,
            date: formatDate(new Date()),
          });
        }
        state.list.push(newProduct);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.list.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export default productsSlice.reducer;
