import { render, screen, fireEvent } from '@testing-library/react';
import ReviewEditForm from '../../../components/reviews/ReviewEditForm/ReviewEditForm';

describe('ReviewEditForm', () => {
  it('renders textarea', () => {
    render(<ReviewEditForm />);
    expect(screen.getByPlaceholderText(/Share your experience/)).toBeInTheDocument();
  });

  it('populates textarea with initialComment', () => {
    render(<ReviewEditForm initialComment="Great product!" />);
    expect(screen.getByDisplayValue('Great product!')).toBeInTheDocument();
  });

  it('save button is disabled when rating is 0', () => {
    render(<ReviewEditForm initialRating={0} />);
    expect(screen.getByText('Save review')).toBeDisabled();
  });

  it('calls onSave with rating and comment', () => {
    const onSave = vi.fn();
    render(<ReviewEditForm initialRating={4} initialComment="Nice!" onSave={onSave} />);
    fireEvent.click(screen.getByText('Save review'));
    expect(onSave).toHaveBeenCalledWith({ rating: 4, comment: 'Nice!' });
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(<ReviewEditForm onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });
});
