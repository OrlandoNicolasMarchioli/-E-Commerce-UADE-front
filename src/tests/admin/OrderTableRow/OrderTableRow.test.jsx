import { render, screen, fireEvent } from '@testing-library/react';
import OrderTableRow from '../../../components/admin/OrderTableRow/OrderTableRow';

const order = { id: 'ORD-001', customer: 'Alice', date: '2024-01-15', items: 2, total: 199.98, status: 'PAID' };

describe('OrderTableRow', () => {
  const renderRow = (props = {}) =>
    render(<table><tbody><tr><OrderTableRow order={order} {...props} /></tr></tbody></table>);

  it('renders order id', () => {
    renderRow();
    expect(screen.getByText('#ORD-001')).toBeInTheDocument();
  });

  it('renders customer name', () => {
    renderRow();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('renders status badge', () => {
    renderRow();
    expect(screen.getByText('PAID')).toBeInTheDocument();
  });

  it('calls onView when view button is clicked', () => {
    const onView = vi.fn();
    renderRow({ onView });
    fireEvent.click(screen.getByText('View'));
    expect(onView).toHaveBeenCalledWith(order);
  });
});
