import { render, screen } from '@testing-library/react';
import Navbar from '../../../components/navigation/Navbar/Navbar';

describe('Navbar', () => {
  it('renders logo', () => {
    render(<Navbar />);
    expect(screen.getByText('UADE')).toBeInTheDocument();
  });

  it('renders user first name when user is provided', () => {
    render(<Navbar user={{ firstName: 'Alice' }} />);
    expect(screen.getByText(/Alice/)).toBeInTheDocument();
  });

  it('renders guest sign in button when no user', () => {
    render(<Navbar />);
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('renders ADMIN badge when isAdmin is true', () => {
    render(<Navbar isAdmin user={{ firstName: 'Admin' }} />);
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
  });
});
