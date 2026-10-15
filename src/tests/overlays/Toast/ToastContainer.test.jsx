import { render, screen, act } from '@testing-library/react';
import ToastContainer, { useToast } from '../../../components/overlays/Toast/ToastContainer';

const ToastHarness = ({ onReady }) => {
  const toast = useToast();
  onReady?.(toast);
  return <ToastContainer toasts={toast.toasts} onDismiss={toast.dismiss} />;
};

describe('ToastContainer', () => {
  it('renders a toast when show is called', () => {
    let toastApi;
    render(<ToastHarness onReady={(api) => { toastApi = api; }} />);
    act(() => { toastApi.show({ variant: 'success', title: 'Saved!', description: 'Your changes were saved.' }); });
    expect(screen.getByText('Saved!')).toBeInTheDocument();
  });

  it('renders multiple toasts', () => {
    let toastApi;
    render(<ToastHarness onReady={(api) => { toastApi = api; }} />);
    act(() => {
      toastApi.show({ variant: 'success', title: 'First' });
      toastApi.show({ variant: 'error', title: 'Second' });
    });
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
});
