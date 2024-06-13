import { Context, Next } from 'koa';
import errorBody from '../constants/errorBody';

export function createRequiredValidator(...keys: string[]) {
  return async function (ctx: Context, next: Next) {
    const body = (ctx.request.body as Record<string, string>) ?? {};
    for (const key of keys) {
      if (body[key] === undefined || body[key] === '') {
        ctx.app.emit('error', ctx, errorBody.MISSING_REQUIRED_PARAMETER);
        return;
      }
    }
    await next();
  };
}
