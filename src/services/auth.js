import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY, TEMPLATES_DIR, SMTP } from '../constants/index.js';
import { sendEmail } from '../utils/sendMail.js';
import { env } from '../utils/env.js';

export const registerUser = async (payload) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) throw createHttpError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  return await User.create({ ...payload, password: hashedPassword });
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) throw createHttpError(404, 'User not found');

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) throw createHttpError(401, 'Unauthorized');

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  await Session.deleteMany({ userId: user._id });

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });

  return session;
};

export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await Session.findOne({ _id: sessionId, refreshToken });
  if (!session) throw createHttpError(401, 'Session not found');

  const isSessionTokenExpired = new Date() > session.refreshTokenValidUntil;
  if (isSessionTokenExpired) throw createHttpError(401, 'Session token expired');

  const newAccessToken = randomBytes(30).toString('base64');
  const newRefreshToken = randomBytes(30).toString('base64');

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

export const sendResetEmailToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    { expiresIn: '5m' }
  );

  const resetPasswordTemplatePath = path.join(TEMPLATES_DIR, 'reset-password-email.html');
  const templateSource = (await fs.readFile(resetPasswordTemplatePath)).toString();
  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: env(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch {
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await User.findOne({ email: entries.email, _id: entries.sub });
  if (!user) throw createHttpError(404, 'User not found');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  await User.updateOne({ _id: user._id }, { password: encryptedPassword });
};
