import { render, screen, fireEvent } from '@testing-library/react';
import StatusTabBar from '../../../components/navigation/StatusTabBar/StatusTabBar';

const statuses = [
  { value: 'all', label: 'All', count: 10 },
  { value: 'pending', label: 'Pending', count: 3 },
  { value: 'delivered', label: 'Delivered', count: 7 },
];

describe('StatusTabBar', () => {
  it('renders all tabs', () => {
    render(<StatusTabBar statuses={statuses} active="all" onChange={vi.fn()} />);
    expect(screen.getByText('All (10)')).toBeInTheDocument();
    expect(screen.getByText('Pending (3)')).toBeInTheDocument();
    expect(screen.getByText('Delivered (7)')).toBeInTheDocument();
  });

  it('calls onChange when a tab is clicked', () => {
    const onChange = vi.fn();
    render(<StatusTabBar statuses={statuses} active="all" onChange={onChange} />);
    fireEvent.click(screen.getByText('Pending (3)'));
    expect(onChange).toHaveBeenCalledWith('pending');
  });

  it('marks the active tab', () => {
    render(<StatusTabBar statuses={statuses} active="pending" onChange={vi.fn()} />);
    const active = document.querySelector('.ui-st-tab--active');
    expect(active?.textContent).toContain('Pending');
  });
});
