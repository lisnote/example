import Koa, { Context } from 'koa';
import KoaRouter from '@koa/router';
import bodyParser from 'koa-bodyparser';
import userRouter from '../router/userRouter';
import { ErrorBody } from '../constants/errorBody';
import errorCodeToHttpStatusMap from '../constants/errorCodeToHttpStatusMap';

const app = new Koa();
const router = new KoaRouter();
router.get('/', (ctx) => (ctx.body = 'koa test'));
router.get(/.*/, (ctx) => (ctx.body = '404'));

app.use(bodyParser()).use(userRouter.routes()).use(router.routes());
app.on('error', (ctx: Context, body: ErrorBody[keyof ErrorBody]) => {
  ctx.status = errorCodeToHttpStatusMap[body.message];
  ctx.body = {
    code: body.code,
    message: body.message.toLowerCase().replace(/_/g, ' '),
  };
});

export default app;
