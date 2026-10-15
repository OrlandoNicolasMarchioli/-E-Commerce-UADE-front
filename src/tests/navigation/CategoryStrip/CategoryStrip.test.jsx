import { render, screen, fireEvent } from '@testing-library/react';
import CategoryStrip from '../../../components/navigation/CategoryStrip/CategoryStrip';

const categories = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Clothing' },
  { id: 3, name: 'Books' },
];

describe('CategoryStrip', () => {
  it('renders all categories', () => {
    render(<CategoryStrip categories={categories} onSelect={vi.fn()} />);
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Clothing')).toBeInTheDocument();
    expect(screen.getByText('Books')).toBeInTheDocument();
  });

  it('renders All chip', () => {
    render(<CategoryStrip categories={categories} onSelect={vi.fn()} />);
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('calls onSelect with category id when a category is clicked', () => {
    const onSelect = vi.fn();
    render(<CategoryStrip categories={categories} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Electronics'));
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it('marks the active category', () => {
    render(<CategoryStrip categories={categories} activeId={2} onSelect={vi.fn()} />);
    const activeChip = document.querySelector('.ui-cat-chip--active');
    expect(activeChip?.textContent).toBe('Clothing');
  });
});
