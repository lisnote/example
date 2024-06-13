import { Context, Next } from 'koa';
import errorBody from '../constants/errorBody';
import { createRequiredValidator } from './utils';
import { getUserInfo } from '../service/userService';
import { compareSync, hashSync } from 'bcryptjs';

export const userRequired = createRequiredValidator('username', 'password');

export async function userAlreadyExists(ctx: Context, next: Next) {
  const { username } = ctx.request.body as Record<string, string>;
  await getUserInfo({ username })
    .then(async (value) => {
      if (value) {
        ctx.app.emit('error', ctx, errorBody.USER_ALREADY_EXISTS);
        return;
      }
      await next();
    })
    .catch(() => ctx.app.emit('error', ctx, errorBody.USER_REGISTER_EXCEPTION));
}

export async function securePassword(ctx: Context, next: Next) {
  const body = ctx.request.body as Record<string, string>;
  body.password = hashSync(body.password);
  await next();
}

export async function verifyLogin(ctx: Context, next: Next) {
  const { username, password } = ctx.request.body as Record<string, string>;
  await getUserInfo({ username })
    .then(async (value) => {
      if (!value) return ctx.app.emit('error', ctx, errorBody.USER_NOT_EXISTS);
      const isPasswordCorrect = compareSync(password, value.password);
      if (!isPasswordCorrect) {
        return ctx.app.emit('error', ctx, errorBody.USER_INVALID_PASSWORD);
      }
      await next();
    })
    .catch(() => ctx.app.emit('error', ctx, errorBody.USER_REGISTER_EXCEPTION));
}
