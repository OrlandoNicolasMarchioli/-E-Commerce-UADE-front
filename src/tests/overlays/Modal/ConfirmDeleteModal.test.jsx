import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmDeleteModal from '../../../components/overlays/Modal/ConfirmDeleteModal';

describe('ConfirmDeleteModal', () => {
  it('renders product name in confirmation message', () => {
    render(<ConfirmDeleteModal productName="Headphones" />);
    expect(screen.getByText(/"Headphones"/)).toBeInTheDocument();
  });

  it('calls onConfirm when Delete button is clicked', () => {
    const onConfirm = vi.fn();
    render(<ConfirmDeleteModal productName="Headphones" onConfirm={onConfirm} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(<ConfirmDeleteModal productName="Headphones" onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });
});
