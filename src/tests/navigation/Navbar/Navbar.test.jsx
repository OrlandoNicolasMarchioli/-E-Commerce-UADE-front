import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

describe('Navbar · onNavigate', () => {
  it('sin onNavigate el logo no navega (href "#")', () => {
    render(<Navbar />);
    expect(screen.getByText('UADE').closest('a')).toHaveAttribute('href', '#');
  });

  it('con onNavigate el logo y "My orders" avisan la ruta destino', async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<Navbar user={{ firstName: 'Alice' }} onNavigate={onNavigate} />);
    await user.click(screen.getByText('UADE'));
    await user.click(screen.getByText('My orders'));
    expect(onNavigate).toHaveBeenNthCalledWith(1, '/');
    expect(onNavigate).toHaveBeenNthCalledWith(2, '/my-orders');
  });
});

