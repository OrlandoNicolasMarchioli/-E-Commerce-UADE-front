import { render, screen, fireEvent } from '@testing-library/react';
import CategoryFormPanel from '../../../components/admin/CategoryFormPanel/CategoryFormPanel';

describe('CategoryFormPanel', () => {
  it('renders name input', () => {
    render(<CategoryFormPanel />);
    expect(screen.getByPlaceholderText('e.g. Electronics')).toBeInTheDocument();
  });

  it('populates fields with initialValues', () => {
    render(<CategoryFormPanel initialValues={{ name: 'Electronics', icon: '💻' }} />);
    expect(screen.getByDisplayValue('Electronics')).toBeInTheDocument();
  });

  it('calls onSubmit with form data', () => {
    const onSubmit = vi.fn();
    render(<CategoryFormPanel onSubmit={onSubmit} />);
    fireEvent.change(screen.getByPlaceholderText('e.g. Electronics'), { target: { value: 'Books' } });
    fireEvent.click(screen.getByText('Save category'));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: 'Books' }));
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(<CategoryFormPanel onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });
});
