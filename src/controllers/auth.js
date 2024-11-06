import { registerUser, loginUser, logoutUser, refreshUsersSession } from '../services/auth.js';
import { ONE_DAY } from '../constants/index.js';

// Контролер для реєстрації користувача
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

// Контролер для логіна користувача
export const loginUserController = async (req, res, next) => {
  try {
    const session = await loginUser(req.body);

    // Встановлюємо refreshToken у cookie
    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });
    res.cookie('sessionId', session._id, {
      httpOnly: true,
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

// Контролер для виходу користувача
export const logoutUserController = async (req, res, next) => {
  try {
    const sessionId = req.cookies.sessionId;
    if (sessionId) {
      await logoutUser(sessionId);
    }

    // Очищуємо куки з токенами
    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');

    res.status(204).send(); // No Content
  } catch (error) {
    next(error);
  }
};

// Контролер для оновлення сесії (отримання нового accessToken)
export const refreshUserSessionController = async (req, res, next) => {
  try {
    const session = await refreshUsersSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

    // Оновлюємо cookies з новими значеннями
    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });
    res.cookie('sessionId', session._id, {
      httpOnly: true,
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
