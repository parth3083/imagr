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
