import { render, screen, fireEvent } from '@testing-library/react';
import ProductTableRow from '../../../components/admin/ProductTableRow/ProductTableRow';

const product = { id: 1, name: 'Headphones', category: 'Electronics', price: 99.99, stock: 10 };

describe('ProductTableRow', () => {
  const renderRow = (props = {}) =>
    render(<table><tbody><tr><ProductTableRow product={product} {...props} /></tr></tbody></table>);

  it('renders product name', () => {
    renderRow();
    expect(screen.getByText('Headphones')).toBeInTheDocument();
  });

  it('renders price', () => {
    renderRow();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    renderRow({ onEdit });
    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith(product);
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    renderRow({ onDelete });
    fireEvent.click(screen.getByText('Delete'));
    expect(onDelete).toHaveBeenCalledWith(product);
  });
});
