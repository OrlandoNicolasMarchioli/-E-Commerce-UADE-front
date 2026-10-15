import { render, screen, fireEvent } from '@testing-library/react';
import StarSelector from '../../../components/primitives/StarSelector/StarSelector';

describe('StarSelector', () => {
  it('renders 5 stars', () => {
    render(<StarSelector />);
    const stars = screen.getAllByRole('radio');
    expect(stars).toHaveLength(5);
  });

  it('calls onChange when a star is clicked', () => {
    const onChange = vi.fn();
    render(<StarSelector onChange={onChange} />);
    const stars = screen.getAllByRole('radio');
    fireEvent.click(stars[2]);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('renders in readOnly mode without radio roles', () => {
    render(<StarSelector readOnly value={4} />);
    const radios = screen.queryAllByRole('radio');
    expect(radios).toHaveLength(0);
  });

  it('does not fire onChange in readOnly mode', () => {
    const onChange = vi.fn();
    render(<StarSelector readOnly value={4} onChange={onChange} />);
    const stars = document.querySelectorAll('.ui-star');
    fireEvent.click(stars[0]);
    expect(onChange).not.toHaveBeenCalled();
  });
});
