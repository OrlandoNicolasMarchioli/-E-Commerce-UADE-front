import { render, screen } from '@testing-library/react';
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
});
