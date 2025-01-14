import { jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginPage } from '../Login'
import { signIn } from 'next-auth/react'

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}))

// Test LoginPage and Spotify Login Button (with Spotify Login Text)
describe('LoginPage', () => {
  it('renders login page and button correctly', () => {
    render(<LoginPage />)

    expect(screen.getByRole('button', { name: /continue with spotify/i })).toBeInTheDocument()
  })

  it('calls signIn with "spotify" when clicked', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    await user.click(screen.getByRole('button', { name: /continue with spotify/i }))
    expect(signIn).toHaveBeenCalledWith('spotify')
  })
}) 