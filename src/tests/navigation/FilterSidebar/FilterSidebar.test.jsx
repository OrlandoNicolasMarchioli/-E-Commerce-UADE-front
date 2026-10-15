import { render, screen, fireEvent } from '@testing-library/react';
import FilterSidebar from '../../../components/navigation/FilterSidebar/FilterSidebar';

describe('FilterSidebar', () => {
  it('renders filter section headings', () => {
    render(<FilterSidebar />);
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Stock')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
  });

  it('renders type checkboxes', () => {
    render(<FilterSidebar />);
    expect(screen.getByLabelText('Physical')).toBeInTheDocument();
    expect(screen.getByLabelText('Service')).toBeInTheDocument();
  });

  it('calls onChange when a checkbox is toggled', () => {
    const onChange = vi.fn();
    render(<FilterSidebar onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Physical'));
    expect(onChange).toHaveBeenCalled();
  });

  it('renders Apply button', () => {
    render(<FilterSidebar />);
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });
});
