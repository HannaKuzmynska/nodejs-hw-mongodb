import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

// Реєстрація нового користувача
export const registerUser = async (payload) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) throw createHttpError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  return await User.create({ ...payload, password: hashedPassword });
};

// Логін користувача і створення сесії
export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) throw createHttpError(404, 'User not found');

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) throw createHttpError(401, 'Unauthorized');

  // Генеруємо accessToken і refreshToken
  const accessToken = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

  // Видаляємо попередні сесії, якщо вони існують
  await Session.deleteMany({ userId: user._id });

  // Створюємо нову сесію
  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });

  return session;
};

// Логаут користувача, видалення сесії
export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};

// Оновлення сесії користувача
export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await Session.findOne({ _id: sessionId, refreshToken });
  if (!session) throw createHttpError(401, 'Session not found');

  const isSessionTokenExpired = new Date() > session.refreshTokenValidUntil;
  if (isSessionTokenExpired) throw createHttpError(401, 'Session token expired');

  // Генеруємо нові токени
  const newAccessToken = jwt.sign({ userId: session.userId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const newRefreshToken = jwt.sign({ userId: session.userId }, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

  // Видалення старої сесії і створення нової
  await Session.deleteOne({ _id: sessionId, refreshToken });

  const newSession = await Session.create({
    userId: session.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });

  return newSession;
};


