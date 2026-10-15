import { useState } from 'react';
import StarSelector from '../../primitives/StarSelector/StarSelector';
import '../../ui.css';

const ReviewEditForm = ({ initialRating = 0, initialComment = '', onSave, onCancel }) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.({ rating, comment });
  };

  return (
    <div className="ui-review-edit-form">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label className="ui-label" style={{ marginBottom: 6, display: 'block' }}>Your rating</label>
          <StarSelector value={rating} onChange={setRating} />
        </div>
        <div className="ui-form-group">
          <label className="ui-label">Your review</label>
          <textarea
            className="ui-textarea"
            rows={3}
            placeholder="Share your experience with this product…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          {onCancel && (
            <button type="button" className="ui-btn ui-btn--ghost ui-btn--sm" onClick={onCancel}>Cancel</button>
          )}
          <button type="submit" className="ui-btn ui-btn--primary ui-btn--sm" disabled={!rating}>Save review</button>
        </div>
      </form>
    </div>
  );
};

export default ReviewEditForm;
