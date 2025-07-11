import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import formatDate from '../utils/formatter';

const ProductDetailsPage = ({ productId, onClose, onSave }) => {
  // Fetch the product details from the Redux store
  const products = useSelector(state => state.products.list);

  const product = products.find(p => p.id === productId);

  // State for form fields
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    count: 0,
    size: { width: 0, height: 0 },
    weight: '',
    comments: [],
  });
  // тут так само можна було використати один об'єкт state для всіх полів, але я вирішив розділити їх для власного розуміння коду
  const [commentText, setCommentText] = useState('');
  const [commentId, setCommentId] = useState(null);
  const [commentDate, setCommentDate] = useState('');
  
  // Populate form data when product is loaded
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        count: product.count,
        size: product.size,
        weight: product.weight,
        comments: product.comments || [],
      });

      if (product.comments && product.comments.length > 0) {
        const lastComment = product.comments[product.comments.length - 1];
        setCommentText(lastComment.description);
        setCommentId(lastComment.id);
        setCommentDate(lastComment.date);
      } else {
        setCommentText('');
        setCommentId(null);
        setCommentDate('');
      }
    }
  }, [product]);

  // Handle edit button click
  const handleEditClick = () => setIsEditing(true);

  // Handle form field changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'width' || name === 'height') {
      setFormData(prev => ({
        ...prev,
        size: {
          ...prev.size,
          [name]: value,
        }
      }));
    } else if (name === 'count') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  const handleSave = () => {
    const updatedComments = [...formData.comments];
    const newDate = formatDate(new Date());

    if (commentId != null) {
      const commentIndex = updatedComments.findIndex(comment => comment.id === commentId);
      if (commentIndex !== -1) {
        updatedComments[commentIndex] = {
          ...updatedComments[commentIndex],
          description: commentText,
          date: newDate,
        };
      } else {
        updatedComments.push({
          id: Date.now(),
          productId: productId,
          description: commentText,
          date: newDate,
        });
      }
    } else if (commentText.trim()) {
      updatedComments.push({
        id: Date.now(),
        productId: productId,
        description: commentText,
        date: newDate,
      });
    }

    const updatedProduct = {
      ...product,
      ...formData,
      comments: updatedComments,
    };

    onSave(updatedProduct);
    setIsEditing(false);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-details-page">
      <h2>Product Details</h2>

      <div>
        <label>Name:</label>
        {isEditing ? (
          <input name="name" value={formData.name} onChange={handleChange} />
        ) : (
          <span>{formData.name}</span>
        )}
      </div>

      <div>
        <label>Count:</label>
        {isEditing ? (
          <input
            type="number"
            name="count"
            value={formData.count}
            onChange={handleChange}
          />
        ) : (
          <span>{formData.count}</span>
        )}
      </div>

      <div>
        <label>Size:</label>
        {isEditing ? (
          <>
            <input
              type="number"
              name="width"
              value={formData.size.width}
              onChange={handleChange}
              style={{ width: '50px', marginRight: '5px' }}
            />
            x
            <input
              type="number"
              name="height"
              value={formData.size.height}
              onChange={handleChange}
              style={{ width: '50px', marginLeft: '5px' }}
            />
          </>
        ) : (
          <span>{formData.size.width} x {formData.size.height} cm</span>
        )}
      </div>

      <div>
        <label>Weight:</label>
        {isEditing ? (
          <input name="weight" value={formData.weight} onChange={handleChange} />
        ) : (
          <span>{formData.weight} kg</span>
        )}
      </div>

      <div>
        <label>Comment:</label>
        {isEditing ? (
          <>
            <textarea value={commentText} onChange={handleCommentChange} />
            <div><small>Last updated: {commentDate}</small></div>
          </>
        ) : (
          <p>{commentText || 'No comments yet.'}</p>
        )}
      </div>

      {!isEditing ? (
        <button onClick={handleEditClick}>Edit</button>
      ) : (
        <button onClick={handleSave}>Save</button>
      )}

      <button onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default ProductDetailsPage;
