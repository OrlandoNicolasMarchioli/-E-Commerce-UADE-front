import { render, screen } from '@testing-library/react';
import StatCard from '../../../components/user/StatCard/StatCard';

describe('StatCard', () => {
  it('renders value and label', () => {
    render(<StatCard value="12" label="Orders" />);
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
  });

  it('applies default brand class', () => {
    render(<StatCard value="12" label="Orders" />);
    expect(document.querySelector('.ui-stat-card')).toBeInTheDocument();
  });

  it('applies custom color class', () => {
    render(<StatCard value="$500" label="Spent" color="success" />);
    expect(document.querySelector('.ui-stat-card--success')).toBeInTheDocument();
  });
});
