import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
  resetPassword,
  sendResetEmailToken,
} from '../services/auth.js';
import { ONE_DAY } from '../constants/index.js';

export const registerUserController = async (req, res, next) => {
  try {
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
    const session = await loginUser(req.body);
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
    await logoutUser(req.cookies.sessionId);
    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');
    res.status(200).json({
      status: 'success',
      message: 'User logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const refreshSessionController = async (req, res, next) => {
  try {
    const session = await refreshUsersSession(req.cookies);
    res.status(200).json({
      status: 'success',
      message: 'Session refreshed successfully',
      data: { accessToken: session.accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const sendResetEmailController = async (req, res) => {
  await sendResetEmailToken(req.body.email);
  res.json({
    message: 'Reset password email has been successfully sent.',
    status: 200,
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password has been successfully reset.',
    status: 200,
    data: {},
  });
};
