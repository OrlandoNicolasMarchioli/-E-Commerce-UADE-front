import '../../ui.css';

const StockBadge = ({ status, count }) => {
  if (status === 'out') return <span className="ui-badge ui-badge--stock-out">Out of stock</span>;
  if (status === 'low') return <span className="ui-badge ui-badge--stock-low">⚠ {count} u.</span>;
  return <span className="ui-badge ui-badge--stock-ok">✓ {count} u.</span>;
};

export default StockBadge;
