import '../../ui.css';

/** Displays a green success banner with a checkmark and a message string. */
const SuccessBanner = ({ message }) => (
  <div className="ui-success-banner" role="status">
    <span>✓</span>
    <span>{message}</span>
  </div>
);

export default SuccessBanner;
