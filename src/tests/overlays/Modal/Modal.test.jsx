import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../../../components/overlays/Modal/Modal';

describe('Modal', () => {
  it('renders title and children', () => {
    render(<Modal title="Test Modal"><p>Modal content</p></Modal>);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('renders cancel and confirm buttons', () => {
    render(<Modal title="Modal" />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn();
    render(<Modal title="Modal" onConfirm={onConfirm} />);
    fireEvent.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(<Modal title="Modal" onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('uses danger variant for confirm button when variant is danger', () => {
    render(<Modal title="Modal" variant="danger" />);
    const confirmBtn = screen.getByText('Confirm');
    expect(confirmBtn).toHaveClass('ui-btn--danger');
  });
});
