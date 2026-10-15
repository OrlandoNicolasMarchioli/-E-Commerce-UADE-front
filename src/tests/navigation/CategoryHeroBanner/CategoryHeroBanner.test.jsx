import { render, screen } from '@testing-library/react';
import CategoryHeroBanner from '../../../components/navigation/CategoryHeroBanner/CategoryHeroBanner';

describe('CategoryHeroBanner', () => {
  it('renders title and description', () => {
    render(<CategoryHeroBanner icon="💻" title="Electronics" description="Latest gadgets" />);
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Latest gadgets')).toBeInTheDocument();
  });

  it('renders product count when provided', () => {
    render(<CategoryHeroBanner icon="💻" title="Electronics" productCount={42} />);
    expect(screen.getByText('42 products')).toBeInTheDocument();
  });

  it('does not render product count when not provided', () => {
    render(<CategoryHeroBanner icon="💻" title="Electronics" />);
    expect(screen.queryByText(/products/)).not.toBeInTheDocument();
  });
});
