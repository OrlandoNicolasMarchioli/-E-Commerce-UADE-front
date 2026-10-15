import { render, screen, fireEvent } from '@testing-library/react';
import CartItem from '../../../components/cart/CartItem/CartItem';

const item = { productId: 1, productName: 'Headphones', productCategory: 'Electronics', unitPrice: 99.99, quantity: 2 };

describe('CartItem', () => {
  it('renders product name', () => {
    render(<CartItem item={item} />);
    expect(screen.getByText('Headphones')).toBeInTheDocument();
  });

  it('renders quantity stepper with current quantity', () => {
    render(<CartItem item={item} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('calls onRemove when remove button clicked', () => {
    const onRemove = vi.fn();
    render(<CartItem item={item} onRemove={onRemove} />);
    fireEvent.click(screen.getByText(/Remove/));
    expect(onRemove).toHaveBeenCalledWith(item.productId);
  });

  it('calls onQtyChange when quantity changes', () => {
    const onQtyChange = vi.fn();
    render(<CartItem item={item} onQtyChange={onQtyChange} />);
    fireEvent.click(screen.getByLabelText('Increase'));
    expect(onQtyChange).toHaveBeenCalledWith(item.productId, 3);
  });
});
