import { render, screen } from '@testing-library/react';
import ProductPreviewCard from '../../../components/products/ProductPreviewCard/ProductPreviewCard';

describe('ProductPreviewCard', () => {
  it('renders product name', () => {
    render(<ProductPreviewCard name="Headphones" price="99.99" stock={5} />);
    expect(screen.getByText('Headphones')).toBeInTheDocument();
  });

  it('renders formatted price', () => {
    render(<ProductPreviewCard name="Headphones" price="99.99" stock={5} />);
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('shows In Stock when stock > 0', () => {
    render(<ProductPreviewCard name="Headphones" price="99.99" stock={5} />);
    expect(screen.getByText('In Stock')).toBeInTheDocument();
  });

  it('shows Out of Stock when stock is 0', () => {
    render(<ProductPreviewCard name="Headphones" price="99.99" stock={0} />);
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });
});
