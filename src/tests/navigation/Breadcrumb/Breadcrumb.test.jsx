import { render, screen } from '@testing-library/react';
import Breadcrumb from '../../../components/navigation/Breadcrumb/Breadcrumb';

describe('Breadcrumb', () => {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Electronics', href: '/electronics' },
    { label: 'Headphones' },
  ];

  it('renders all breadcrumb items', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Headphones')).toBeInTheDocument();
  });

  it('renders last item as current page', () => {
    render(<Breadcrumb items={items} />);
    const current = screen.getByText('Headphones');
    expect(current).toHaveAttribute('aria-current', 'page');
  });

  it('renders links for non-last items', () => {
    render(<Breadcrumb items={items} />);
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toBeInTheDocument();
  });
});
