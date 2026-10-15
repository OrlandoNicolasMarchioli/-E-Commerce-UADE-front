import { render, screen, fireEvent } from '@testing-library/react';
import ReviewCard from '../../../components/reviews/ReviewCard/ReviewCard';

const review = {
  id: 1,
  firstName: 'Alice',
  lastName: 'Smith',
  rating: 5,
  reviewDate: '2024-01-10',
  comment: 'Great product, highly recommended!',
};

describe('ReviewCard', () => {
  it('renders author name', () => {
    render(<ReviewCard review={review} />);
    expect(screen.getByText('Alice Smith', { exact: false })).toBeInTheDocument();
  });

  it('renders review comment', () => {
    render(<ReviewCard review={review} />);
    expect(screen.getByText('Great product, highly recommended!')).toBeInTheDocument();
  });

  it('renders edit button when isOwner is true', () => {
    render(<ReviewCard review={review} isOwner />);
    expect(screen.getByText(/Edit/)).toBeInTheDocument();
  });

  it('does not render edit button when isOwner is false', () => {
    render(<ReviewCard review={review} />);
    expect(screen.queryByText(/Edit/)).not.toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    render(<ReviewCard review={review} isOwner onEdit={onEdit} />);
    fireEvent.click(screen.getByText(/Edit/));
    expect(onEdit).toHaveBeenCalledWith(review);
  });
});
