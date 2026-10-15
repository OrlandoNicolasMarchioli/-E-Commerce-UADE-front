import { render, screen } from '@testing-library/react';
import OrderNumberPill from '../../../components/orders/OrderNumberPill/OrderNumberPill';

describe('OrderNumberPill', () => {
  it('renders the order id with # prefix', () => {
    render(<OrderNumberPill orderId="ORD-001" />);
    expect(screen.getByText('#ORD-001')).toBeInTheDocument();
  });

  it('applies the pill class', () => {
    render(<OrderNumberPill orderId="ORD-001" />);
    expect(document.querySelector('.ui-order-number-pill')).toBeInTheDocument();
  });
});
