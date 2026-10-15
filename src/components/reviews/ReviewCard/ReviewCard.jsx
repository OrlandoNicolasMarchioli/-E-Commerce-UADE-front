import '../../ui.css';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { dateStyle: 'medium' });

const ReviewCard = ({ review, isOwner = false, onEdit, onDelete }) => {
  const { id, rating, comment, reviewDate, firstName, lastName } = review;
  const initials = `${firstName?.[0] ?? '?'}${lastName?.[0] ?? ''}`;

  return (
    <div className="ui-review-card">
      <div className="ui-rc-head">
        <div className="ui-rc-avatar">{initials}</div>
        <div>
          <div className="ui-rc-user">
            {firstName} {lastName}
            {isOwner && (
              <span
                className="ui-badge ui-badge--mine"
                style={{ fontSize: '.6rem', padding: '1px 6px', marginLeft: 6 }}
              >
                My review
              </span>
            )}
          </div>
          <div className="ui-rc-date">{formatDate(reviewDate)}</div>
        </div>
        <div className="ui-rc-stars">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</div>
      </div>
      <div className="ui-rc-comment">{comment}</div>
      {isOwner && (
        <div className="ui-rc-actions">
          <button className="ui-rc-action ui-rc-action--edit" onClick={() => onEdit?.(review)}>
            ✏️ Edit
          </button>
          <button className="ui-rc-action ui-rc-action--del" onClick={() => onDelete?.(id)}>
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
