import { render, screen, fireEvent } from '@testing-library/react';
import QuantityStepper from '../../../components/primitives/QuantityStepper/QuantityStepper';

describe('QuantityStepper', () => {
  it('renders default value', () => {
    render(<QuantityStepper />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('increments value on + click', () => {
    render(<QuantityStepper defaultValue={1} />);
    fireEvent.click(screen.getByLabelText('Increase'));
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('decrements value on - click', () => {
    render(<QuantityStepper defaultValue={3} />);
    fireEvent.click(screen.getByLabelText('Decrease'));
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('does not go below min', () => {
    render(<QuantityStepper defaultValue={1} min={1} />);
    fireEvent.click(screen.getByLabelText('Decrease'));
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('does not go above max', () => {
    render(<QuantityStepper defaultValue={5} max={5} />);
    fireEvent.click(screen.getByLabelText('Increase'));
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls onChange with new value', () => {
    const onChange = vi.fn();
    render(<QuantityStepper defaultValue={1} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Increase'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('works in controlled mode', () => {
    const onChange = vi.fn();
    render(<QuantityStepper value={3} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Increase'));
    expect(onChange).toHaveBeenCalledWith(4);
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
