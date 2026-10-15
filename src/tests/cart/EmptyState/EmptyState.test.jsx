import { render, screen, fireEvent } from '@testing-library/react';
import EmptyState from '../../../components/cart/EmptyState/EmptyState';

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(<EmptyState icon="🛒" title="Your cart is empty" description="Add some products to get started." />);
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Add some products to get started.')).toBeInTheDocument();
  });

  it('renders action button when provided', () => {
    render(<EmptyState title="Empty" action={{ label: 'Shop Now', onClick: vi.fn() }} />);
    expect(screen.getByText('Shop Now')).toBeInTheDocument();
  });

  it('calls action onClick when button is clicked', () => {
    const onClick = vi.fn();
    render(<EmptyState title="Empty" action={{ label: 'Shop Now', onClick }} />);
    fireEvent.click(screen.getByText('Shop Now'));
    expect(onClick).toHaveBeenCalled();
  });
});
