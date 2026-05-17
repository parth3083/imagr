import { t } from 'elysia';

export const SignInModel = t.Object({
  email: t.String({ format: 'email', error: 'Valid email is required' }),
  password: t.String({ minLength: 1, error: 'Password is required' }),
});

export const SignUpModel = t.Object({
  email: t.String({ format: 'email', error: 'Valid email is required' }),
  password: t.String({
    minLength: 8,
    error: 'Password must be at least 8 characters',
  }),
  confirmPassword: t.String({
    minLength: 1,
    error: 'Please confirm your password',
  }),
  name: t.String(),
});

export const SignInResponse = t.Object({
  message: t.Literal('User logged in successfully'),
});

export const SignUpResponse = t.Object({
  message: t.Literal('User created successfully'),
});

export const SignInInvalidate = t.Object({
  message: t.Literal('Invalid credentials'),
});

export const SignUpInvalidate = t.Object({
  message: t.Literal('Error in creating the user.'),
});

export const SignOutResponse = t.Object({
  message: t.Literal('User signed out successfully'),
});

export const SignOutInvalidate = t.Object({
  message: t.Literal('Failed to sign out user'),
});

export const GetSessionResponse = t.Object({
  user: t.Any(),
  session: t.Any(),
});

export const GetSessionInvalidate = t.Object({
  message: t.Literal('Not authenticated'),
});

export const ForgotPasswordModel = t.Object({
  email: t.String({ format: 'email', error: 'Valid email is required' }),
});

export const ForgotPasswordResponse = t.Object({
  message: t.Literal('Password reset email sent'),
});

export const ForgotPasswordInvalidate = t.Object({
  message: t.String(),
});

export const ResetPasswordModel = t.Object({
  token: t.String({ minLength: 1 }),
  newPassword: t.String({ minLength: 8, error: 'Password must be at least 8 characters' }),
});

export const ResetPasswordResponse = t.Object({
  message: t.Literal('Password reset successfully'),
});

export const ResetPasswordInvalidate = t.Object({
  message: t.String(),
});
