import { render, screen, fireEvent } from '@testing-library/react';
import UserTableRow from '../../../components/admin/UserTableRow/UserTableRow';

const user = { id: 1, name: 'Alice', email: 'alice@test.com', role: 'Customer', joinDate: '2023-01-01', blocked: false };

describe('UserTableRow', () => {
  const renderRow = (props = {}) =>
    render(<table><tbody><tr><UserTableRow user={user} {...props} /></tr></tbody></table>);

  it('renders user name', () => {
    renderRow();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('renders user email', () => {
    renderRow();
    expect(screen.getByText('alice@test.com')).toBeInTheDocument();
  });

  it('shows Active badge for unblocked user', () => {
    renderRow();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('shows Blocked badge for blocked user', () => {
    renderRow({ user: { ...user, blocked: true } });
    expect(screen.getByText('Blocked')).toBeInTheDocument();
  });

  it('calls onToggleBlock when block button is clicked', () => {
    const onToggleBlock = vi.fn();
    renderRow({ onToggleBlock });
    fireEvent.click(screen.getByText('Block'));
    expect(onToggleBlock).toHaveBeenCalledWith(user);
  });
});
