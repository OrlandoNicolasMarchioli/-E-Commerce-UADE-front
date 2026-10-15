import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../../../components/primitives/Pagination/Pagination';

describe('Pagination', () => {
  it('renders page buttons', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls onPageChange when a page is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText('3'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('disables prev button on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />);
    const prev = screen.getByLabelText('Previous page');
    expect(prev).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />);
    const next = screen.getByLabelText('Next page');
    expect(next).toBeDisabled();
  });

  it('marks current page with aria-current', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByText('3')).toHaveAttribute('aria-current', 'page');
  });
});
