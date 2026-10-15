import { render, screen } from '@testing-library/react';
import ProductContextStrip from '../../../components/products/ProductContextStrip/ProductContextStrip';

describe('ProductContextStrip', () => {
  it('renders product name', () => {
    render(<ProductContextStrip name="Headphones" category="Electronics" />);
    expect(screen.getByText('Headphones')).toBeInTheDocument();
  });

  it('renders product category', () => {
    render(<ProductContextStrip name="Headphones" category="Electronics" />);
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('renders image when imageUrl is provided', () => {
    render(<ProductContextStrip name="Headphones" imageUrl="img.jpg" />);
    expect(screen.getByRole('img')).toHaveAttribute('src', 'img.jpg');
  });
});
