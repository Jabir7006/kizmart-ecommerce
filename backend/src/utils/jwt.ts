import jwt, { type SignOptions, type VerifyOptions } from 'jsonwebtoken';
import type { IUser } from '../models/user.model.js';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../constants/env.js';

export type refreshTokenPayload = {
  userId: IUser['_id'];
};

export type accessTokenPayload = {
  userId: IUser['_id'];
  role: IUser['role'];
};

type signOptionsAndSecret = SignOptions & {
  secret: string;
};

export const accessTokenSignOptions: signOptionsAndSecret = {
  secret: ACCESS_TOKEN_SECRET,
  expiresIn: '15m',
};

export const refreshTokenSignOptions: signOptionsAndSecret = {
  secret: REFRESH_TOKEN_SECRET,
  expiresIn: '30d',
};

export const signToken = (
  payload: accessTokenPayload | refreshTokenPayload,
  options?: signOptionsAndSecret,
) => {
  const { secret, ...rest } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, { ...rest });
};

export const verifyToken = (
  token: string,
  options?: VerifyOptions & {
    secret: string;
  },
) => {
  const { secret = ACCESS_TOKEN_SECRET, ...verifyOpts } = options || {};

  const decoded = jwt.verify(token, secret, { ...verifyOpts });

  return decoded;
};
