import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Footer from '../../../components/layout/Footer/Footer';

const columns = [
  { heading: 'Company', links: [{ label: 'About', href: '/about' }, { label: 'Careers', href: '/careers' }] },
  { heading: 'Support', links: [{ label: 'FAQ', href: '/faq' }] },
];

describe('Footer', () => {
  it('renders column headings', () => {
    render(<Footer columns={columns} />);
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('renders links', () => {
    render(<Footer columns={columns} />);
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('FAQ')).toBeInTheDocument();
  });

  it('renders copyright text', () => {
    render(<Footer copyright="© 2024 MyShop" />);
    expect(screen.getByText('© 2024 MyShop')).toBeInTheDocument();
  });

  it('con onNavigate los links internos avisan la ruta en vez de recargar', async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<Footer columns={columns} onNavigate={onNavigate} />);
    await user.click(screen.getByText('About'));
    expect(onNavigate).toHaveBeenCalledWith('/about');
  });

  it('con onNavigate ignora los links sin ruta interna', async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<Footer columns={[{ heading: 'X', links: [{ label: 'Ext', href: 'https://uade.edu.ar' }, { label: 'Sin href' }] }]} onNavigate={onNavigate} />);
    await user.click(screen.getByText('Ext'));
    await user.click(screen.getByText('Sin href'));
    expect(onNavigate).not.toHaveBeenCalled();
  });
});
