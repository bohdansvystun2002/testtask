import { useState } from 'react';
import './ProductFormModal.css';
// This component is used to add or edit a product
// It includes fields for name, count, size (width and height), weight, and an optional initial comment

// звичайно, що оптимальніше можна було б використати 1 state для всіх полів, але для себе я використав окремі, а не створив один об'єкт state, щоб було ще простіше розуміти код
const ProductFormModal = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [count, setCount] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState('');
  const [initialComment, setInitialComment] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      name,
      count,
      size: {
        width,
        height
      },
      weight,
      initialComment,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          
          <input type="text" placeholder="Name" value={name} onChange={event => setName(event.target.value)} required />
          <input type="number" placeholder="Count" value={count} onChange={event => setCount(event.target.value)} required />
          <input type="number" placeholder="Width in cm" value={width} onChange={event => setWidth(event.target.value)} required />
          <input type="number" placeholder="Height in cm" value={height} onChange={event => setHeight(event.target.value)} required />
          <input type="number" placeholder="Weight in kg " value={weight} onChange={event => setWeight(event.target.value)} required />
          <input type="text" placeholder="Initial Comment" value={initialComment} onChange={event => setInitialComment(event.target.value)} />

          <div className="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
