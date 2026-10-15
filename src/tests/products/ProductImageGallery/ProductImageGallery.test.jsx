import { render, screen, fireEvent } from '@testing-library/react';
import ProductImageGallery from '../../../components/products/ProductImageGallery/ProductImageGallery';

const images = [
  { url: 'img1.jpg' },
  { url: 'img2.jpg' },
  { url: 'img3.jpg' },
];

describe('ProductImageGallery', () => {
  it('renders main image', () => {
    render(<ProductImageGallery images={images} />);
    const mainImgs = screen.getAllByRole('img');
    expect(mainImgs.length).toBeGreaterThan(0);
  });

  it('renders thumbnails for multiple images', () => {
    render(<ProductImageGallery images={images} />);
    const thumbs = screen.getAllByRole('button', { name: /Thumbnail/ });
    expect(thumbs).toHaveLength(images.length);
  });

  it('changes active thumbnail when clicked', () => {
    render(<ProductImageGallery images={images} />);
    const thumb2 = screen.getByLabelText('Thumbnail 2');
    fireEvent.click(thumb2);
    expect(thumb2).toHaveClass('ui-gallery-thumb--active');
  });

  it('renders placeholder when no images', () => {
    render(<ProductImageGallery images={[]} />);
    expect(screen.getByText(/Main image/)).toBeInTheDocument();
  });
});
