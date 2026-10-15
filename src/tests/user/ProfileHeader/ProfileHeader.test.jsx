import { render, screen } from '@testing-library/react';
import ProfileHeader from '../../../components/user/ProfileHeader/ProfileHeader';

const user = { firstName: 'Alice', lastName: 'Smith', email: 'alice@test.com', isEnabled: true };

describe('ProfileHeader', () => {
  it('renders user full name', () => {
    render(<ProfileHeader user={user} />);
    expect(screen.getByText(/Alice/)).toBeInTheDocument();
    expect(screen.getByText(/Smith/)).toBeInTheDocument();
  });

  it('renders user email', () => {
    render(<ProfileHeader user={user} />);
    expect(screen.getByText(/alice@test.com/)).toBeInTheDocument();
  });

  it('shows Active user badge when enabled', () => {
    render(<ProfileHeader user={user} />);
    expect(screen.getByText('Active user')).toBeInTheDocument();
  });

  it('shows Inactive account badge when disabled', () => {
    render(<ProfileHeader user={{ ...user, isEnabled: false }} />);
    expect(screen.getByText('Inactive account')).toBeInTheDocument();
  });
});
