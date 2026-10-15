import '../../ui.css';

/** Aggregate review summary showing average score and a per-star distribution bar chart; hidden when there are no reviews. */
const ReviewSummary = ({ reviews = [] }) => {
  if (reviews.length === 0) return null;

  // Average rounded to one decimal place for display
  const avg  = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  // Distribution listed highest-to-lowest so 5★ appears at the top
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="ui-review-summary">
      <div>
        <div className="ui-rs-big">{avg}</div>
        <div className="ui-rs-stars">{'★'.repeat(Math.round(avg))}</div>
        <div className="ui-rs-count">{reviews.length} reviews</div>
      </div>
      <div className="ui-rs-bars">
        {dist.map(({ star, count }) => (
          <div key={star} className="ui-rs-bar-row">
            <span className="ui-rs-bar-label">{star}★</span>
            <div className="ui-rs-bar">
              <div
                className="ui-rs-fill"
                style={{ width: `${(count / reviews.length) * 100}%` }}
              />
            </div>
            <span className="ui-rs-num">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSummary;
