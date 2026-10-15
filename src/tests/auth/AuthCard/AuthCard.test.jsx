import { render, screen, fireEvent } from '@testing-library/react';
import AuthCard from '../../../components/auth/AuthCard/AuthCard';

describe('AuthCard', () => {
  it('renders Sign In tab by default', () => {
    render(<AuthCard />);
    expect(screen.getAllByText('Sign In').length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
  });

  it('switches to Register tab', () => {
    render(<AuthCard />);
    fireEvent.click(screen.getByText('Create Account'));
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
  });

  it('shows error when submitting empty login form', () => {
    render(<AuthCard />);
    fireEvent.click(screen.getAllByText('Sign In')[1]);
    expect(screen.getByText('All fields are required.')).toBeInTheDocument();
  });

  it('calls onLogin with form data on valid submission', () => {
    const onLogin = vi.fn();
    render(<AuthCard onLogin={onLogin} />);
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
    fireEvent.click(screen.getAllByText('Sign In')[1]);
    expect(onLogin).toHaveBeenCalledWith(expect.objectContaining({ email: 'test@test.com' }));
  });
});
