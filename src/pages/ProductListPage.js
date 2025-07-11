import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/productsSlice';
import ProductFormModal from '../components/ProductFormModal';
import ConfirmModal from '../components/ConfirmModal';
import ProductDetailsPage from './ProductDetailsPage';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import './ProductListPage.css';
import formatDate from '../utils/formatter';  

// Function to sort products based on the selected method
const sortProducts = (products, method) => {
  const sorted = [...products];
  if (method === 'alphabetical') {
    sorted.sort((a, b) => a.name.localeCompare(b.name) || a.count - b.count);
  } else if (method === 'count') {
    sorted.sort((a, b) => a.count - b.count || a.name.localeCompare(b.name));
  } else if (method === 'reverse') {
    sorted.sort((a, b) => b.name.localeCompare(a.name) || b.count - a.count);
  }
  return sorted;
};


const ProductListPage = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.list);

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [sortMethod, setSortMethod] = useState('alphabetical');
  const [detailsProductId, setDetailsProductId] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddClick = () => setAddModalOpen(true);

  const handleAddSave = async (product) => {
    try {
      const comment = product.initialComment?.trim();
      const formattedDate = formatDate(new Date());

      const productWithComment = {
        ...product,
        comments: comment ? [{
          id: Date.now(),
          productId: product.id || Date.now(),
          description: comment,
          date: formattedDate,
        }] : [],
      };
      // Add the product with the initial comment to the server
      await axios.post('http://localhost:3001/products', productWithComment);
      dispatch(fetchProducts());
      setAddModalOpen(false);
    } catch (error) {
      alert('Failed to add product');
    }
  };

  const handleDeleteConfirm = async () => {
    // Confirm deletion of the product
    try {
      await axios.delete(`http://localhost:3001/products/${deleteProductId}`);
      dispatch(fetchProducts());
      setDeleteProductId(null);
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const handleSaveDetails = async (updatedProduct) => {
    // Save the updated product details
    try {
      await axios.put(`http://localhost:3001/products/${updatedProduct.id}`, updatedProduct);
      dispatch(fetchProducts());
      setDetailsProductId(null);
    } catch (error) {
      alert('Failed to save product details');
    }
  };

  const sortedProducts = sortProducts(products, sortMethod);

  return (
    <div className="product-list-container">
      <h1 className="product-list-title">Product List</h1>

      <div className="product-list-sort-container" >
        <label className='product-list-sort-label' htmlFor="sort-method" >Sort by:</label>
        <select
          id="sort-method"
          value={sortMethod}
          onChange={event => setSortMethod(event.target.value)}
          className="product-list-sort-select"
        >
          <option value="alphabetical">Alphabetical (A-Z, then count)</option>
          <option value="count">Count (ascending, then name)</option>
          <option value="reverse">Alphabetical (Z-A, then count)</option>
        </select>
      </div>

      <button onClick={handleAddClick} className="product-list-add-btn">
        Add Product
      </button>

      <ul className="product-list-items">
        {sortedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={(id) => setDetailsProductId(id)}
            onDelete={(id) => setDeleteProductId(id)}
          />
        ))}
      </ul>

      {isAddModalOpen && (
        <ProductFormModal
          onClose={() => setAddModalOpen(false)}
          onSave={handleAddSave}
        />
      )}

      {deleteProductId && (
        <ConfirmModal
          message="Are you sure you want to delete this product?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteProductId(null)}
        />
      )}

      {detailsProductId !== null && (
        <div className="product-details-modal-overlay">
          <div className="product-details-modal-content">
            <button
              onClick={() => setDetailsProductId(null)}
              className='product-details-modal-close-btn'
            >
              Close
            </button>

            <ProductDetailsPage
              productId={detailsProductId}
              onClose={() => setDetailsProductId(null)}
              onSave={handleSaveDetails}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
