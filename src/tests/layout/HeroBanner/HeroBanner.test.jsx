import { render, screen, fireEvent } from '@testing-library/react';
import HeroBanner from '../../../components/layout/HeroBanner/HeroBanner';

describe('HeroBanner', () => {
  it('renders title and subtitle', () => {
    render(<HeroBanner title="Welcome" subtitle="Best deals here" />);
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('Best deals here')).toBeInTheDocument();
  });

  it('renders CTA button with default label', () => {
    render(<HeroBanner title="Welcome" subtitle="Sub" />);
    expect(screen.getByText('Shop Now')).toBeInTheDocument();
  });

  it('calls onCta when button is clicked', () => {
    const onCta = vi.fn();
    render(<HeroBanner title="Welcome" subtitle="Sub" onCta={onCta} />);
    fireEvent.click(screen.getByText('Shop Now'));
    expect(onCta).toHaveBeenCalled();
  });
});
