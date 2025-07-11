import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import commentsReducer from './commentsSlice';
// This file sets up the Redux store for the application
// It combines the products and comments slices into a single store
export const store = configureStore({
  reducer: {
    products: productsReducer,
    comments: commentsReducer,
  },
});
