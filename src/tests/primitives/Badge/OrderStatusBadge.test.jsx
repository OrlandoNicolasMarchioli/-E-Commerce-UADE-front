import { render, screen } from '@testing-library/react';
import OrderStatusBadge from '../../../components/primitives/Badge/OrderStatusBadge';

describe('OrderStatusBadge', () => {
  it.each(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'])(
    'renders %s status correctly',
    (status) => {
      render(<OrderStatusBadge status={status} />);
      expect(screen.getByText(status)).toBeInTheDocument();
    },
  );

  it('renders unknown status as-is', () => {
    render(<OrderStatusBadge status="UNKNOWN" />);
    expect(screen.getByText('UNKNOWN')).toBeInTheDocument();
  });

  it('applies correct variant class for SHIPPED', () => {
    render(<OrderStatusBadge status="SHIPPED" />);
    expect(screen.getByText('SHIPPED')).toHaveClass('ui-badge--shipped');
  });
});
