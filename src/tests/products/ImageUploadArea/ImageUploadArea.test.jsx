import { render, screen } from '@testing-library/react';
import ImageUploadArea from '../../../components/products/ImageUploadArea/ImageUploadArea';

describe('ImageUploadArea', () => {
  it('renders upload instructions', () => {
    render(<ImageUploadArea />);
    expect(screen.getByText('Click or drag to upload images')).toBeInTheDocument();
  });

  it('renders uploaded images', () => {
    const images = [{ url: 'img1.jpg' }, { url: 'img2.jpg' }];
    render(<ImageUploadArea images={images} />);
    const imgs = screen.getAllByRole('img');
    expect(imgs).toHaveLength(2);
  });

  it('renders remove buttons for uploaded images', () => {
    const images = [{ url: 'img1.jpg' }];
    render(<ImageUploadArea images={images} onRemove={vi.fn()} />);
    expect(screen.getByLabelText('Remove image')).toBeInTheDocument();
  });
});
