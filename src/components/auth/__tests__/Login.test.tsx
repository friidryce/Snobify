import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from '../Login';
import { signIn } from '@/lib/auth-client';

// Mock better-auth
jest.mock('@/lib/auth-client', () => ({
  signIn: {
    social: jest.fn()
  },
  signOut: jest.fn(),
  signUp: jest.fn(),
  useSession: jest.fn(() => ({ data: null, isPending: false }))
}));

describe('LoginPage', () => {
  it('renders the Spotify login button', () => {
    render(<LoginPage />);
    
    const loginButton = screen.getByRole('button', { name: /continue with spotify/i });
    expect(loginButton).toBeInTheDocument();
  });

  it('calls signIn.social when the Spotify button is clicked', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    const loginButton = screen.getByRole('button', { name: /continue with spotify/i });
    await user.click(loginButton);
    
    expect(signIn.social).toHaveBeenCalledWith({ provider: 'spotify' });
  });
});