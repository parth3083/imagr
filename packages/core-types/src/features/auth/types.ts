import type { Static } from 'elysia';

import {
  SignInModel,
  SignUpModel,
  SignInResponse,
  SignUpResponse,
  SignInInvalidate,
  SignUpInvalidate,
  SignOutResponse,
  SignOutInvalidate,
  GetSessionResponse,
  GetSessionInvalidate,
  ForgotPasswordModel,
  ForgotPasswordResponse,
  ForgotPasswordInvalidate,
  ResetPasswordModel,
  ResetPasswordResponse,
  ResetPasswordInvalidate,
} from './model';

export type SignInType = Static<typeof SignInModel>;
export type SignUpType = Static<typeof SignUpModel>;
export type SignInResponseType = Static<typeof SignInResponse>;
export type SignUpResponseType = Static<typeof SignUpResponse>;
export type SignInInvalidateType = Static<typeof SignInInvalidate>;
export type SignUpInvalidateType = Static<typeof SignUpInvalidate>;
export type SignOutResponseType = Static<typeof SignOutResponse>;
export type SignOutInvalidateType = Static<typeof SignOutInvalidate>;
export type GetSessionResponseType = Static<typeof GetSessionResponse>;
export type GetSessionInvalidateType = Static<typeof GetSessionInvalidate>;
export type ForgotPasswordType = Static<typeof ForgotPasswordModel>;
export type ForgotPasswordResponseType = Static<typeof ForgotPasswordResponse>;
export type ForgotPasswordInvalidateType = Static<typeof ForgotPasswordInvalidate>;
export type ResetPasswordType = Static<typeof ResetPasswordModel>;
export type ResetPasswordResponseType = Static<typeof ResetPasswordResponse>;
export type ResetPasswordInvalidateType = Static<typeof ResetPasswordInvalidate>;
