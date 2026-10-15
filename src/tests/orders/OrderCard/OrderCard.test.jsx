import { render, screen, fireEvent } from '@testing-library/react';
import OrderCard from '../../../components/orders/OrderCard/OrderCard';

const order = {
  id: 'ORD-001',
  orderDate: '2024-01-15T10:00:00Z',
  status: 'SHIPPED',
  total: 249.99,
  items: [],
};

describe('OrderCard', () => {
  it('renders order id', () => {
    render(<OrderCard order={order} />);
    expect(screen.getByText(/ORD-001/)).toBeInTheDocument();
  });

  it('renders status badge', () => {
    render(<OrderCard order={order} />);
    expect(screen.getByText('SHIPPED')).toBeInTheDocument();
  });

  it('renders view details button', () => {
    render(<OrderCard order={order} />);
    expect(screen.getByText(/View details/)).toBeInTheDocument();
  });

  it('calls onClick when view details is clicked', () => {
    const onClick = vi.fn();
    render(<OrderCard order={order} onClick={onClick} />);
    fireEvent.click(screen.getByText(/View details/));
    expect(onClick).toHaveBeenCalledWith(order.id);
  });
});
