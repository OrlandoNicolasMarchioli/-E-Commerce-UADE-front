import { render, screen, fireEvent } from '@testing-library/react';
import OrderSummary from '../../../components/cart/OrderSummary/OrderSummary';

const items = [
  { productName: 'Headphones', quantity: 1, unitPrice: 99.99, subtotal: 99.99 },
  { productName: 'Case', quantity: 2, unitPrice: 19.99, subtotal: 39.98 },
];

describe('OrderSummary', () => {
  it('renders item names', () => {
    render(<OrderSummary items={items} />);
    expect(screen.getByText(/Headphones/)).toBeInTheDocument();
    expect(screen.getByText(/Case/)).toBeInTheDocument();
  });

  it('renders confirm purchase button', () => {
    render(<OrderSummary items={items} />);
    expect(screen.getByText('Confirm purchase')).toBeInTheDocument();
  });

  it('calls onCheckout when confirm button is clicked', () => {
    const onCheckout = vi.fn();
    render(<OrderSummary items={items} onCheckout={onCheckout} />);
    fireEvent.click(screen.getByText('Confirm purchase'));
    expect(onCheckout).toHaveBeenCalled();
  });
});
