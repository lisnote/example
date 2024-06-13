import { Context, Next } from 'koa';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { getUserInfo } from '../service/userService';
import errorBody from '../constants/errorBody';

type AuthPayload = {
  id: number;
  updatedAt: string;
  iat: number;
  exp: number;
};

export async function auth(ctx: Context, next: Next) {
  const { authorization } = ctx.headers;
  let valid = false;
  try {
    const payload = verify(authorization!.slice(7), JWT_SECRET) as AuthPayload;
    const info = await getUserInfo({ id: payload.id });
    if (info!.updatedAt.toISOString() !== payload.updatedAt) throw Error();
    ctx.state.user = info;
    valid = true;
  } catch {
    ctx.app.emit('error', ctx, errorBody.INVALID_TOKEN);
  } finally {
    if (valid) await next();
  }
}
