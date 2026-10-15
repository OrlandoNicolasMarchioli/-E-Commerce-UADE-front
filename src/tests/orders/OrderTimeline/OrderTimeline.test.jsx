import { render, screen } from '@testing-library/react';
import OrderTimeline from '../../../components/orders/OrderTimeline/OrderTimeline';

describe('OrderTimeline', () => {
  it('renders all steps', () => {
    render(<OrderTimeline status="SHIPPED" />);
    expect(screen.getByText('Ordered')).toBeInTheDocument();
    expect(screen.getByText('Paid')).toBeInTheDocument();
    expect(screen.getByText('Shipped')).toBeInTheDocument();
    expect(screen.getByText('Delivered')).toBeInTheDocument();
  });

  it('renders done dots for steps before current status', () => {
    render(<OrderTimeline status="SHIPPED" />);
    const doneDots = document.querySelectorAll('.ui-tl-dot--done');
    expect(doneDots.length).toBeGreaterThan(0);
  });

  it('renders active dot for current status', () => {
    render(<OrderTimeline status="SHIPPED" />);
    const activeDots = document.querySelectorAll('.ui-tl-dot--active');
    expect(activeDots.length).toBe(1);
  });

  it('renders cancelled message for CANCELLED status', () => {
    render(<OrderTimeline status="CANCELLED" />);
    expect(screen.getByText(/cancelled/i)).toBeInTheDocument();
  });
});
