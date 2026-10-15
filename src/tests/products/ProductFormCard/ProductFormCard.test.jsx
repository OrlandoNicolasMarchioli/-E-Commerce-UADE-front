import { render, screen, fireEvent } from '@testing-library/react';
import ProductFormCard from '../../../components/products/ProductFormCard/ProductFormCard';

const categories = [{ value: 'electronics', label: 'Electronics' }];

describe('ProductFormCard', () => {
  it('renders name input', () => {
    render(<ProductFormCard categories={categories} />);
    expect(screen.getByPlaceholderText('e.g. Wireless Headphones')).toBeInTheDocument();
  });

  it('renders category select', () => {
    render(<ProductFormCard categories={categories} />);
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('populates fields with initialValues', () => {
    render(<ProductFormCard initialValues={{ name: 'Headphones' }} categories={categories} />);
    expect(screen.getByDisplayValue('Headphones')).toBeInTheDocument();
  });

  it('renders save and cancel buttons', () => {
    render(<ProductFormCard categories={categories} onCancel={vi.fn()} />);
    expect(screen.getByText('Save product')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(<ProductFormCard categories={categories} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });
});
