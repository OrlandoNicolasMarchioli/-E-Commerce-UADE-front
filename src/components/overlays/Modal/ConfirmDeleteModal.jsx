import Modal from './Modal';

/** Danger confirmation modal for deleting a product by name; wraps the base Modal with a preset danger variant. */
const ConfirmDeleteModal = ({ productName, onConfirm, onCancel }) => (
  <Modal
    title="Delete product?"
    variant="danger"
    confirmLabel="Delete"
    onConfirm={onConfirm}
    onCancel={onCancel}
  >
    <p>
      You are about to delete <strong>"{productName}"</strong>. This action cannot be undone.
    </p>
  </Modal>
);

export default ConfirmDeleteModal;
