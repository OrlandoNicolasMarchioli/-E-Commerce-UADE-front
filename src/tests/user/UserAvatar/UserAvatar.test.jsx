import { render, screen } from '@testing-library/react';
import UserAvatar from '../../../components/user/UserAvatar/UserAvatar';

describe('UserAvatar', () => {
  it('renders initials from firstName and lastName', () => {
    render(<UserAvatar user={{ firstName: 'Alice', lastName: 'Smith' }} />);
    expect(screen.getByText('AS')).toBeInTheDocument();
  });

  it('renders ? when user is null', () => {
    render(<UserAvatar user={null} />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('applies size class', () => {
    render(<UserAvatar user={{ firstName: 'Alice', lastName: 'Smith' }} size="lg" />);
    const avatar = document.querySelector('.ui-avatar--lg');
    expect(avatar).toBeInTheDocument();
  });

  it('uses custom color when provided', () => {
    render(<UserAvatar user={{ firstName: 'Alice', lastName: 'Smith' }} color="#ff0000" />);
    const avatar = document.querySelector('[style*="#ff0000"]');
    expect(avatar).toBeInTheDocument();
  });
});
