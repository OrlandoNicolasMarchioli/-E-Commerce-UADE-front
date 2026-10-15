import { render, screen } from '@testing-library/react';
import NextStepsList from '../../../components/orders/NextStepsList/NextStepsList';

const steps = [
  { icon: '📧', title: 'Check your email', description: 'Confirmation email sent.' },
  { icon: '🚚', title: 'Track delivery', description: 'Use your order number.' },
];

describe('NextStepsList', () => {
  it('renders all steps', () => {
    render(<NextStepsList steps={steps} />);
    expect(screen.getByText('Check your email')).toBeInTheDocument();
    expect(screen.getByText('Track delivery')).toBeInTheDocument();
  });

  it('renders step descriptions', () => {
    render(<NextStepsList steps={steps} />);
    expect(screen.getByText('Confirmation email sent.')).toBeInTheDocument();
  });

  it('renders empty list when no steps', () => {
    render(<NextStepsList steps={[]} />);
    expect(document.querySelector('li')).not.toBeInTheDocument();
  });
});
