import { render, screen } from '@testing-library/react';
import AdminStatsBar from '../../../components/admin/AdminStatsBar/AdminStatsBar';

const stats = [
  { icon: '📦', value: '142', label: 'Products', trend: 5 },
  { icon: '👥', value: '890', label: 'Users', trend: -2 },
  { icon: '💰', value: '$12,400', label: 'Revenue' },
];

describe('AdminStatsBar', () => {
  it('renders all stat cards', () => {
    render(<AdminStatsBar stats={stats} />);
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders values', () => {
    render(<AdminStatsBar stats={stats} />);
    expect(screen.getByText('142')).toBeInTheDocument();
    expect(screen.getByText('$12,400')).toBeInTheDocument();
  });

  it('renders trend when provided', () => {
    render(<AdminStatsBar stats={stats} />);
    expect(screen.getByText(/5%/)).toBeInTheDocument();
  });
});
