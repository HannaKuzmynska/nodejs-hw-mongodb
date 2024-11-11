import { registerUser, loginUser, logoutUser, refreshUsersSession } from '../services/auth.js';
import { ONE_DAY } from '../constants/index.js';
import createHttpError from 'http-errors';
export const registerUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw createHttpError(400, 'Email and password are required');
    }

    const user = await registerUser(req.body);
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
export const loginUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createHttpError(400, 'Email and password are required');
    }

    const session = await loginUser(req.body);
    if (!session) {
      throw createHttpError(401, 'Invalid email or password');
    }

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      expires: new Date(Date.now() + ONE_DAY),
    });

    res.cookie('sessionId', session._id, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      expires: new Date(Date.now() + ONE_DAY),
    });

    res.status(200).json({
      status: 'success',
      message: 'User logged in successfully',
      data: { accessToken: session.accessToken },
    });
  } catch (error) {
    next(error);
  }
};
export const logoutUserController = async (req, res, next) => {
  try {
    const sessionId = req.cookies.sessionId;

    if (sessionId) {
      await logoutUser(sessionId);
    }

    res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.clearCookie('sessionId', { httpOnly: true, secure: true, sameSite: 'Strict' });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const refreshUserSessionController = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;

    if (!sessionId || !refreshToken) {
      throw createHttpError(401, 'Missing session or refresh token');
    }

    const session = await refreshUsersSession({ sessionId, refreshToken });

    if (!session) {
      throw createHttpError(401, 'Invalid session or refresh token');
    }

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      expires: new Date(Date.now() + ONE_DAY),
    });

    res.cookie('sessionId', session._id, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      expires: new Date(Date.now() + ONE_DAY),
    });

    res.status(200).json({
      status: 'success',
      message: 'Session refreshed successfully',
      data: { accessToken: session.accessToken },
    });
  } catch (error) {
    next(error);
  }
};
