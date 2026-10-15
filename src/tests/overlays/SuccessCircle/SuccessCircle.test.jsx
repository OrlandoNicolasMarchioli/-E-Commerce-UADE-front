import { render, screen } from '@testing-library/react';
import SuccessCircle from '../../../components/overlays/SuccessCircle/SuccessCircle';

describe('SuccessCircle', () => {
  it('renders confirmation message', () => {
    render(<SuccessCircle />);
    expect(screen.getByText('Order confirmed!')).toBeInTheDocument();
  });

  it('renders order id when provided', () => {
    render(<SuccessCircle orderId="ORD-123" />);
    expect(screen.getByText(/ORD-123/)).toBeInTheDocument();
  });

  it('does not render order id section when not provided', () => {
    render(<SuccessCircle />);
    expect(screen.queryByText(/Order #/)).not.toBeInTheDocument();
  });
});
