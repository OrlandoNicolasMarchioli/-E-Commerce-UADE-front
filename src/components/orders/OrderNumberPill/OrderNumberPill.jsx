import '../../ui.css';

/** Renders a styled pill displaying the order ID prefixed with #. */
const OrderNumberPill = ({ orderId }) => (
  <span className="ui-order-number-pill">#{orderId}</span>
);

export default OrderNumberPill;
