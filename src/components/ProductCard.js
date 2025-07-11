import './ProductCard.css';
// This component displays a product card with its details and actions
const ProductCard = ({ product, onDelete, onViewDetails }) => {
  const firstComment = product.comments && product.comments.length > 0 ? product.comments[0] : null;

  return (
    <li className="product-card">

      <div className="product-card-info">
        <h2>{product.name}</h2>
        <p>Count: {product.count}</p>
        <p>Size: {product.size.width}x{product.size.height} cm</p>
        <p>Weight: {product.weight} kg</p>

        {firstComment && (
          <div className="product-card-comment">
            <div><small>{firstComment.date}</small></div>
            <div>{firstComment.description}</div>
          </div>
        )}

      </div>

      <div className="product-card-actions">
        <button onClick={() => onViewDetails(product.id)} className="product-card-link">
          Details
        </button>
        <button onClick={() => onDelete(product.id)} className="product-card-delete-btn">
          Delete
        </button>
      </div>
      
    </li>
  );
};

export default ProductCard;
