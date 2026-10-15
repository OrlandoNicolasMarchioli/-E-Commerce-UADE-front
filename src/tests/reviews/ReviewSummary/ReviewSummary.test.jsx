import { render, screen } from '@testing-library/react';
import ReviewSummary from '../../../components/reviews/ReviewSummary/ReviewSummary';

const reviews = [
  { rating: 5 }, { rating: 5 }, { rating: 4 }, { rating: 4 }, { rating: 3 },
  { rating: 2 }, { rating: 1 },
];

describe('ReviewSummary', () => {
  it('renders calculated average rating', () => {
    render(<ReviewSummary reviews={reviews} />);
    const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
    expect(screen.getByText(avg)).toBeInTheDocument();
  });

  it('renders total reviews count', () => {
    render(<ReviewSummary reviews={reviews} />);
    expect(screen.getByText(`${reviews.length} reviews`)).toBeInTheDocument();
  });

  it('renders star breakdown labels', () => {
    render(<ReviewSummary reviews={reviews} />);
    expect(screen.getByText('5★')).toBeInTheDocument();
    expect(screen.getByText('1★')).toBeInTheDocument();
  });

  it('renders nothing when reviews is empty', () => {
    const { container } = render(<ReviewSummary reviews={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
