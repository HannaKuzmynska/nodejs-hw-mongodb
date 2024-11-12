import createHttpError from 'http-errors';
import { Session } from '../models/session.js';

export const authenticate = async (req, res, next) => {
  try {
    // Перевіряємо наявність куків
    const sessionId = req.cookies.sessionId;
    const refreshToken = req.cookies.refreshToken;

    if (!sessionId || !refreshToken) {
      return next(createHttpError(401, 'Authorization required'));
    }

    // Знаходимо сесію за sessionId
    const session = await Session.findOne({ _id: sessionId, refreshToken });

    if (!session) {
      return next(createHttpError(401, 'Session not found or expired'));
    }

    // Перевіряємо, чи не протермінований accessToken
    const isAccessTokenExpired = new Date() > session.accessTokenValidUntil;

    if (isAccessTokenExpired) {
      return next(createHttpError(401, 'Access token expired'));
    }

    req.user = session.userId;
    next();
  } catch (error) {
    next(createHttpError(500, 'Server error during authentication'));
  }
};
