import { render, screen, fireEvent } from '@testing-library/react';
import BuyPanel from '../../../components/products/BuyPanel/BuyPanel';

const product = { id: 1, price: 99.99, stock: 5, type: 'PHYSICAL' };

describe('BuyPanel', () => {
  it('renders add to cart button', () => {
    render(<BuyPanel product={product} />);
    expect(screen.getByText('Add to cart')).toBeInTheDocument();
  });

  it('renders buy now button', () => {
    render(<BuyPanel product={product} />);
    expect(screen.getByText('Buy now')).toBeInTheDocument();
  });

  it('calls onAddToCart when button clicked', () => {
    const onAddToCart = vi.fn();
    render(<BuyPanel product={product} onAddToCart={onAddToCart} />);
    fireEvent.click(screen.getByText('Add to cart'));
    expect(onAddToCart).toHaveBeenCalledWith(1);
  });

  it('shows out of stock text when stock is 0', () => {
    render(<BuyPanel product={{ ...product, stock: 0 }} />);
    expect(screen.getByText(/Out of stock/)).toBeInTheDocument();
  });

  it('disables buttons when out of stock', () => {
    render(<BuyPanel product={{ ...product, stock: 0 }} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });
});
