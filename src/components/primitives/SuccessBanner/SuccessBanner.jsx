import '../../ui.css';

const SuccessBanner = ({ message }) => (
  <div className="ui-success-banner" role="status">
    <span>✓</span>
    <span>{message}</span>
  </div>
);

export default SuccessBanner;
