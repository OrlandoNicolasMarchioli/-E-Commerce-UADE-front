import { render, screen, fireEvent } from '@testing-library/react';
import AdminToolbar from '../../../components/admin/AdminToolbar/AdminToolbar';

describe('AdminToolbar', () => {
  it('renders search box when onSearch provided', () => {
    render(<AdminToolbar onSearch={vi.fn()} searchPlaceholder="Search products" />);
    expect(screen.getByPlaceholderText('Search products')).toBeInTheDocument();
  });

  it('calls onSearch when input changes', () => {
    const onSearch = vi.fn();
    render(<AdminToolbar onSearch={onSearch} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'headphones' } });
    expect(onSearch).toHaveBeenCalledWith('headphones');
  });

  it('renders Add button when onAdd is provided', () => {
    render(<AdminToolbar onAdd={vi.fn()} addLabel="Add Product" />);
    expect(screen.getByText('+ Add Product')).toBeInTheDocument();
  });

  it('calls onAdd when Add button is clicked', () => {
    const onAdd = vi.fn();
    render(<AdminToolbar onAdd={onAdd} addLabel="Add" />);
    fireEvent.click(screen.getByText('+ Add'));
    expect(onAdd).toHaveBeenCalled();
  });
});
