import { render, screen, fireEvent } from '@testing-library/react';
import ProfileNav from '../../../components/user/ProfileNav/ProfileNav';

const items = [
  { id: 'orders', label: '📦 My orders' },
  { id: 'profile', label: '✏️ Edit profile' },
  { id: 'logout', label: '🚪 Sign out', danger: true },
];

describe('ProfileNav', () => {
  it('renders all nav items', () => {
    render(<ProfileNav items={items} />);
    expect(screen.getByText('📦 My orders')).toBeInTheDocument();
    expect(screen.getByText('✏️ Edit profile')).toBeInTheDocument();
  });

  it('calls onChange when a nav item is clicked', () => {
    const onChange = vi.fn();
    render(<ProfileNav items={items} onChange={onChange} />);
    fireEvent.click(screen.getByText('✏️ Edit profile'));
    expect(onChange).toHaveBeenCalledWith('profile');
  });

  it('marks the active item', () => {
    render(<ProfileNav items={items} activeId="orders" />);
    const active = document.querySelector('.ui-pn-item--active');
    expect(active?.textContent).toContain('My orders');
  });
});
