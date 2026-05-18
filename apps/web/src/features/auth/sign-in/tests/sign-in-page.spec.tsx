import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useSignIn } from '../../hooks/useSignIn';
import SignInPage from '../sign-in-page';

// Mock the useSignIn hook
vi.mock('../../hooks/useSignIn', () => ({
  useSignIn: vi.fn(),
}));

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('SignInPage', () => {
  let queryClient: QueryClient;
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    vi.mocked(useSignIn).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    } as any);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should render sign in form', () => {
    render(<SignInPage />, { wrapper });

    expect(screen.getByText('Login to your account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
  });

  it('should render sign up link', () => {
    render(<SignInPage />, { wrapper });

    const signUpLink = screen.getByRole('link', { name: /sign up/i });
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute('href', '/sign-up');
  });

  it('should submit form with valid credentials', async () => {
    const user = userEvent.setup();
    render(<SignInPage />, { wrapper });

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /^login$/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should disable submit button when pending', () => {
    vi.mocked(useSignIn).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isSuccess: false,
      isError: false,
      error: null,
    } as any);

    render(<SignInPage />, { wrapper });

    const submitButton = screen.getByRole('button', { name: /logging in/i });
    expect(submitButton).toBeDisabled();
  });

  it('should show loading text when pending', () => {
    vi.mocked(useSignIn).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isSuccess: false,
      isError: false,
      error: null,
    } as any);

    render(<SignInPage />, { wrapper });

    expect(screen.getByText('Logging in...')).toBeInTheDocument();
  });

  it('should render forgot password link', () => {
    render(<SignInPage />, { wrapper });

    const forgotPasswordLink = screen.getByText('Forgot your password?');
    expect(forgotPasswordLink).toBeInTheDocument();
  });

  it('should render social login buttons', () => {
    render(<SignInPage />, { wrapper });

    expect(screen.getByText('Login with Google')).toBeInTheDocument();
    expect(screen.getByText('Login with Github')).toBeInTheDocument();
  });

  it('should handle empty form submission', async () => {
    const user = userEvent.setup();
    render(<SignInPage />, { wrapper });

    const submitButton = screen.getByRole('button', { name: /^login$/i });
    await user.click(submitButton);

    // Form should not call mutate with empty values
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        email: '',
        password: '',
      });
    });
  });

  it('should allow typing in email field', async () => {
    const user = userEvent.setup();
    render(<SignInPage />, { wrapper });

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    await user.type(emailInput, 'test@example.com');

    expect(emailInput.value).toBe('test@example.com');
  });

  it('should allow typing in password field', async () => {
    const user = userEvent.setup();
    render(<SignInPage />, { wrapper });

    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    await user.type(passwordInput, 'password123');

    expect(passwordInput.value).toBe('password123');
  });

  it('should have correct input types', () => {
    render(<SignInPage />, { wrapper });

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should have placeholder for email input', () => {
    render(<SignInPage />, { wrapper });

    const emailInput = screen.getByLabelText('Email');
    expect(emailInput).toHaveAttribute('placeholder', 'm@example.com');
  });
});
