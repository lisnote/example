import { Context } from 'koa';
import { createUser, getUserInfo, updateUser } from '../service/userService';
import errorBody from '../constants/errorBody';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export async function register(ctx: Context) {
  const { username, password } = ctx.request.body as Record<string, string>;
  await createUser(username, password)
    .then((value) => {
      ctx.body = {
        code: 0,
        message: 'register successfully',
        result: { id: value.id, username },
      };
    })
    .catch(() => ctx.app.emit('error', ctx, errorBody.USER_REGISTER_EXCEPTION));
}

export async function login(ctx: Context) {
  const { username } = ctx.request.body as Record<string, string>;
  await getUserInfo({ username })
    .then((userInfo) => {
      const { id, updatedAt } = userInfo!;
      const token = sign({ id, updatedAt }, JWT_SECRET, {
        expiresIn: '1d',
      });
      ctx.body = {
        code: 0,
        message: 'login successfully',
        result: { id, username, token },
      };
    })
    .catch(() => ctx.app.emit('error', errorBody.USER_LOGIN_EXCEPTION));
}

export async function updatePassword(ctx: Context) {
  const id = ctx.state.user.id;
  const { password } = ctx.request.body as Record<string, string>;
  await updateUser({ id, password })
    .then((result) => {
      if (result) {
        ctx.body = {
          code: 0,
          message: 'update password successfully',
        };
      } else throw Error();
    })
    .catch(() =>
      ctx.app.emit('error', errorBody.USER_UPDATE_PASSWORD_EXCEPTION)
    );
}
