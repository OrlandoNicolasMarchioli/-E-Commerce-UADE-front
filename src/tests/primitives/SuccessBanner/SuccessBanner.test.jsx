import { render, screen } from '@testing-library/react';
import SuccessBanner from '../../../components/primitives/SuccessBanner/SuccessBanner';

describe('SuccessBanner', () => {
  it('renders the message', () => {
    render(<SuccessBanner message="Changes saved successfully." />);
    expect(screen.getByText('Changes saved successfully.')).toBeInTheDocument();
  });

  it('has role status for accessibility', () => {
    render(<SuccessBanner message="Done" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
