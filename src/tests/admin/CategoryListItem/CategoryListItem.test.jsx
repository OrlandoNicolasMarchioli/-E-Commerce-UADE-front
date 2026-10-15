import { render, screen, fireEvent } from '@testing-library/react';
import CategoryListItem from '../../../components/admin/CategoryListItem/CategoryListItem';

const category = { id: 1, name: 'Electronics', icon: '💻', productCount: 42 };

describe('CategoryListItem', () => {
  it('renders category name', () => {
    render(<CategoryListItem category={category} />);
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('renders product count', () => {
    render(<CategoryListItem category={category} />);
    expect(screen.getByText('42 products')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    render(<CategoryListItem category={category} onEdit={onEdit} />);
    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith(category);
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(<CategoryListItem category={category} onDelete={onDelete} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(onDelete).toHaveBeenCalledWith(category);
  });
});
