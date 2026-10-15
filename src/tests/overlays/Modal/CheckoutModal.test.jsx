import { render, screen, fireEvent } from '@testing-library/react';
import CheckoutModal from '../../../components/overlays/Modal/CheckoutModal';

const items = [
  { productName: 'Headphones', quantity: 1, unitPrice: 99.99, subtotal: 99.99 },
];

describe('CheckoutModal', () => {
  it('renders confirmation title', () => {
    render(<CheckoutModal items={items} />);
    expect(screen.getByText('Confirm purchase')).toBeInTheDocument();
  });

  it('renders item name', () => {
    render(<CheckoutModal items={items} />);
    expect(screen.getByText(/Headphones/)).toBeInTheDocument();
  });

  it('calls onConfirm when Confirm button is clicked', () => {
    const onConfirm = vi.fn();
    render(<CheckoutModal items={items} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(<CheckoutModal items={items} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });
});
