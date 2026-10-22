import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../../../components/products/ProductCard/ProductCard';

const product = { id: 1, name: 'Wireless Headphones', price: 99.99, type: 'PHYSICAL', stock: 10, category: 'Electronics' };
const outOfStockProduct = { ...product, stock: 0 };
const service = { id: 7, name: 'SQL Course', price: 45000, type: 'SERVICE', stock: null, minutesDuration: 480, attendanceType: 'PRESENCIAL', category: 'Courses' };

describe('ProductCard', () => {
  it('renders product name', () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
  });

  it('renders product category', () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('calls onClick with product id when card is clicked', () => {
    const onClick = vi.fn();
    render(<ProductCard product={product} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledWith(product.id);
  });

  it('shows out of stock label when stock is 0', () => {
    render(<ProductCard product={outOfStockProduct} />);
    expect(screen.getAllByText('Out of stock').length).toBeGreaterThan(0);
  });

  it('shows stock count when in stock', () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText(/10 in stock/)).toBeInTheDocument();
  });

  it('shows duration and attendance type for services', () => {
    render(<ProductCard product={service} />);
    expect(screen.getByText('480 min · Presencial')).toBeInTheDocument();
  });

  it('shows only the duration when a service has no attendance type', () => {
    render(<ProductCard product={{ ...service, attendanceType: null }} />);
    expect(screen.getByText('480 min')).toBeInTheDocument();
  });
});
