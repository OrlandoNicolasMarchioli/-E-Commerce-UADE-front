import { render, screen, fireEvent } from '@testing-library/react';
import OrderStatusAction from '../../../components/orders/OrderStatusAction/OrderStatusAction';

describe('OrderStatusAction', () => {
  it('renders transition button for PENDING status', () => {
    render(<OrderStatusAction currentStatus="PENDING" orderId="1" />);
    expect(screen.getByText('Mark as paid')).toBeInTheDocument();
  });

  it('renders transition button for PAID status', () => {
    render(<OrderStatusAction currentStatus="PAID" orderId="1" />);
    expect(screen.getByText('Mark as shipped')).toBeInTheDocument();
  });

  it('calls onAdvance with orderId and next status when button clicked', () => {
    const onAdvance = vi.fn();
    render(<OrderStatusAction currentStatus="PENDING" orderId="1" onAdvance={onAdvance} />);
    fireEvent.click(screen.getByText('Mark as paid'));
    expect(onAdvance).toHaveBeenCalledWith('1', 'PAID');
  });

  it('renders Final state button when status is DELIVERED', () => {
    render(<OrderStatusAction currentStatus="DELIVERED" orderId="1" />);
    expect(screen.getByText('Final state')).toBeInTheDocument();
  });
});
