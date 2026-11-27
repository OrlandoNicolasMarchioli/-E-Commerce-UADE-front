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

describe('Navbar · tema y búsqueda guardada', () => {
  it('sin onToggleTheme no muestra el botón de tema', () => {
    render(<Navbar />);
    expect(screen.queryByRole('button', { name: /Activar tema/ })).not.toBeInTheDocument();
  });

  it('en tema claro ofrece pasar al oscuro y avisa el click', async () => {
    const onToggleTheme = vi.fn();
    const user = userEvent.setup();
    render(<Navbar theme="light" onToggleTheme={onToggleTheme} />);
    const button = screen.getByRole('button', { name: 'Activar tema oscuro' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    await user.click(button);
    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('en tema oscuro ofrece volver al claro, también en la navbar admin', () => {
    render(<Navbar isAdmin user={{ firstName: 'Admin' }} theme="dark" onToggleTheme={() => {}} />);
    expect(screen.getByRole('button', { name: 'Activar tema claro' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('el buscador arranca con la última búsqueda guardada', () => {
    render(<Navbar defaultQuery="notebook" />);
    expect(screen.getByPlaceholderText('Search products...')).toHaveValue('notebook');
  });
});
