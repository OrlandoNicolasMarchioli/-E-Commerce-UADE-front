import { render, screen, fireEvent } from '@testing-library/react';
import ActiveFilterTags from '../../../components/primitives/ActiveFilterTags/ActiveFilterTags';

const filters = [
  { id: 'electronics', label: 'Electronics' },
  { id: 'in-stock', label: 'In Stock' },
];

describe('ActiveFilterTags', () => {
  it('renders filter tags', () => {
    render(<ActiveFilterTags filters={filters} />);
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('In Stock')).toBeInTheDocument();
  });

  it('renders nothing when filters is empty', () => {
    const { container } = render(<ActiveFilterTags filters={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('calls onRemove with filter id when remove button clicked', () => {
    const onRemove = vi.fn();
    render(<ActiveFilterTags filters={filters} onRemove={onRemove} />);
    fireEvent.click(screen.getByLabelText('Remove Electronics'));
    expect(onRemove).toHaveBeenCalledWith('electronics');
  });

  it('shows clear all button when onClearAll is provided', () => {
    render(<ActiveFilterTags filters={filters} onClearAll={vi.fn()} />);
    expect(screen.getByText('Clear all')).toBeInTheDocument();
  });
});
