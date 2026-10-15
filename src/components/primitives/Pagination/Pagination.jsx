import '../../ui.css';

// Builds the array of page numbers/ellipsis strings to render, capped at 7 items.
// Ellipsis ('…') entries collapse the middle of long page ranges.
const buildPages = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total];
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '…', current - 1, current, current + 1, '…', total];
};

/** Renders page navigation with smart ellipsis collapsing for large page counts. */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = buildPages(currentPage, totalPages);
  return (
    <nav className="ui-pagination" aria-label="Pagination">
      <button
        className="ui-pg-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >‹</button>

      {pages.map((p, i) =>
        p === '…' ? (
          <button key={`e${i}`} className="ui-pg-btn ui-pg-btn--ellipsis" disabled>…</button>
        ) : (
          <button
            key={p}
            className={`ui-pg-btn${p === currentPage ? ' ui-pg-btn--active' : ''}`}
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        className="ui-pg-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >›</button>
    </nav>
  );
};

export default Pagination;
