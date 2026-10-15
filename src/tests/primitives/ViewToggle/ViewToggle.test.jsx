import { render, screen, fireEvent } from '@testing-library/react';
import ViewToggle from '../../../components/primitives/ViewToggle/ViewToggle';

describe('ViewToggle', () => {
  it('renders grid and list buttons', () => {
    render(<ViewToggle />);
    expect(screen.getByLabelText('Grid view')).toBeInTheDocument();
    expect(screen.getByLabelText('List view')).toBeInTheDocument();
  });

  it('marks grid as active by default', () => {
    render(<ViewToggle value="grid" />);
    const gridBtn = screen.getByLabelText('Grid view');
    expect(gridBtn).toHaveClass('ui-view-btn--active');
  });

  it('calls onChange with view key when button is clicked', () => {
    const onChange = vi.fn();
    render(<ViewToggle value="grid" onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('List view'));
    expect(onChange).toHaveBeenCalledWith('list');
  });
});
