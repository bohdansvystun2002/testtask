import './ConfirmModal.css';
// This component is used to confirm modal actions
// It displays a message and has Confirm and Cancel buttons
const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal-box">
        <p className="confirm-modal-message">{message}</p>

        <div className="confirm-modal-actions">
          <button onClick={onCancel} className="confirm-modal-btn">
            Cancel
          </button>
          
          <button onClick={onConfirm} className="confirm-modal-btn confirm">
            Confirm
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmModal;
