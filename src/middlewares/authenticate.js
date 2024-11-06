import createHttpError from 'http-errors';
import { Session } from '../models/session.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(createHttpError(401, 'Authorization header required'));

  const token = authHeader.split(' ')[1];
  const session = await Session.findOne({ accessToken: token });
  if (!session) return next(createHttpError(401, 'Session not found or expired'));

  const isAccessTokenExpired = new Date() > session.accessTokenValidUntil;
  if (isAccessTokenExpired) return next(createHttpError(401, 'Access token expired'));

  req.user = session.userId;
  next();
};
