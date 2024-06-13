---
date: 2024-04-10 00:00:00
---

[koa 项目实战笔记](https://www.bilibili.com/video/BV13A411w79h)

# 初始化

```bash
pnpm init
tsc --init
git init
```

# 搭建项目

1. 安装 koa 框架

   ```bash
   pnpm i koa
   pnpm i @types/koa nodemon ts-node
   ```

2. 编写最基础的 app

   ```typescript
   import Koa from 'koa';

   const app = new Koa();

   app.use((ctx, next) => {
     ctx.body = 'hello world!';
     next();
   });
   app.listen(3000, () =>
     console.log('server is running on http://localhost:3000')
   );
   ```

3. 修改 package.json 的 script 属性

   ```json
   {
     "scripts": {
       "dev": "nodemon src/mian.ts -w src/**/*"
     }
   }
   ```

4. 命令行启动程序

   ```bash
   pnpm dev
   ```

# 环境分离

1. 安装 dotenv-flow

   ```bash
   pnpm i dotenv-flow
   ```

2. 创建 .env

   ```
   APP_PORT=56829
   ```

3. 创建 config.ts

   ```Typescript
   import dotenv from 'dotenv-flow';

   const config = dotenv.config<{ APP_PORT: string }>();
   if (config.error) throw config.error;

   export const { APP_PORT } = config.parsed!;
   ```

4. 修改 mian.ts

   ```typescript
   import Koa from 'koa';
   import { APP_PORT } from './config';

   const app = new Koa();

   app.use((ctx, next) => {
     ctx.body = 'hello world!';
     next();
   });

   app.listen(APP_PORT, () =>
     console.log(`server is running on http://localhost:${APP_PORT}`)
   );
   ```

# 添加路由

1. 安装路由

   ```bash
   pnpm i @koa/router
   pnpm i -D @types/koa__router
   ```

2. 编写 src/router/userRouter.ts

   ```typescript
   import KoaRouter from '@koa/router';

   const router = new KoaRouter({ prefix: '/user' });

   router.get('/', (ctx) => (ctx.body = 'hello user'));

   export default router;
   ```

3. 修改 src/main.ts

   ```typescript
   import Koa from 'koa';
   import KoaRouter from '@koa/router';
   import userRouter from './router/userRouter';
   import { APP_PORT } from './config';

   const app = new Koa();
   const router = new KoaRouter();
   router.get('/', (ctx) => (ctx.body = 'koa test'));
   router.get(/.*/, (ctx) => (ctx.body = '404'));

   app.use(userRouter.routes()).use(router.routes());

   app.listen(APP_PORT, () =>
     console.log(`server is running on http://localhost:${APP_PORT}`)
   );
   ```

# 目录结构优化

1. 拆分 http 服务和 app 业务

   src/app/index.ts

   ```typescript
   import Koa from 'koa';
   import KoaRouter from '@koa/router';
   import userRouter from '../router/userRouter';

   const app = new Koa();
   const router = new KoaRouter();
   router.get('/', (ctx) => (ctx.body = 'koa test'));
   router.get(/.*/, (ctx) => (ctx.body = '404'));

   app.use(userRouter.routes()).use(router.routes());

   export default app;
   ```

   src/main.ts

   ```typescript
   import app from './app';
   import { APP_PORT } from './config';

   app.listen(APP_PORT, () =>
     console.log(`server is running on http://localhost:${APP_PORT}`)
   );
   ```

2. 拆分路由和控制器

   src/controller/userController.ts

   ```typescript
   import { Context } from 'koa';

   export async function register(ctx: Context) {
     ctx.body = '用户注册成功';
   }

   export async function login(ctx: Context) {
     ctx.body = '登录成功';
   }
   ```

   src/router/userRouter.ts

   ```typescript
   import KoaRouter from '@koa/router';
   import { register, login } from '../controller/userController';

   const router = new KoaRouter({ prefix: '/user' });

   router.post('/register', register);
   router.post('/login', login);

   export default router;
   ```

# body 解析

1. 安装 koa-bodyparser

   ```bash
   pnpm i koa-bodyparser
   pnpm i -D @types/koa-bodyparser
   ```

2. 使用 koa-bodyparser 中间件

   src/app/index.ts

   ```typescript
   import Koa from 'koa';
   import KoaRouter from '@koa/router';
   import bodyParser from 'koa-bodyparser';
   import userRouter from '../router/userRouter';

   const app = new Koa();
   const router = new KoaRouter();
   router.get('/', (ctx) => (ctx.body = 'koa test'));
   router.get(/.*/, (ctx) => (ctx.body = '404'));

   app.use(bodyParser()).use(userRouter.routes()).use(router.routes());

   export default app;
   ```

3. 增加 service 层

   src/service/UserService.ts

   ```typescript
   export async function createUser(username: string, password: string) {
     // todo: 写入数据库
     return '创建用户成功';
   }
   ```

4. 读取 body

   src/controller/userController.ts

   ```typescript
   import { Context } from 'koa';
   import { createUser } from '../service/userService';

   export async function register(ctx: Context) {
     const { username, password } = ctx.request.body as Record<string, string>;
     const res = await createUser(username, password);
     ctx.body = '用户注册成功';
   }

   export async function login(ctx: Context) {
     ctx.body = '登录成功';
   }
   ```

# sequelize 集成

1. 安装依赖

   ```bash
   pnpm i sequelize sqlite3
   ```

2. 连接数据库

   src/database/seq

   ```typescript
   import { Sequelize } from 'sequelize';

   const sequelize = new Sequelize({
     dialect: 'sqlite',
     storage: 'temp.sqlite',
   });
   sequelize
     .authenticate()
     .then(() => console.log('建立连接成功'))
     .catch(() => console.log('建立连接失败'));
   export default sequelize;
   ```

# 创建 user

1. 定义 User 模型

   src/model/userModel.ts

   ```typescript
   import { DataTypes } from 'sequelize';
   import sequelize from '../database/sequelize';

   const users = sequelize.define('user', {
     username: {
       type: DataTypes.STRING,
       allowNull: false,
       unique: true,
     },
     password: {
       type: DataTypes.STRING,
       allowNull: false,
     },
   });
   users.sync();

   export default users;
   export type User = {
     username: string;
     password: string;
     id: number;
     createdAt: Date;
     updatedAt: Date;
   };
   ```

2. 服务调用模型

   src/service/userService.ts

   ```typescript
   import User from '../model/userModel';
   export async function createUser(username: string, password: string) {
     const res = await User.create({ username, password });
     return res.dataValues;
   }
   ```

3. 控制层返回结果

   ```typescript
   import { Context } from 'koa';
   import { createUser } from '../service/userService';

   export async function register(ctx: Context) {
     const { username, password } = ctx.request.body as Record<string, string>;
     const res = await createUser(username, password);
     ctx.body = {
       code: 0,
       message: 'register successfully',
       result: { id: res.id, username },
     };
   }

   export async function login(ctx: Context) {
     ctx.body = '登录成功';
   }
   ```

# 优化异常处理

1. 设定响应代码

   src/constants/errorCode.ts

   ```typescript
   enum errorCode {
     // 1xxxx: 后端异常
     // 2xxxx: 前端异常
     // 3xxxx: user服务异常
     USER_REGISTER_EXCEPTION = 30001,
   }

   export default errorCode;
   export type ErrorCode = typeof errorCode;
   ```

2. 设定响应代码对应的 http 状态码

   src/constants/errorCodeToHttpStatusMap.ts

   ```typescript
   import { ErrorCode } from './errorCode';

   const errorCodeToHttpStatusMap: Record<keyof ErrorCode, number> = {
     USER_REGISTER_EXCEPTION: 500,
   };

   export default errorCodeToHttpStatusMap;
   ```

3. 设定异常时的响应体

   src/constants/errorBody.ts

   ```typescript
   import errorCode, { ErrorCode } from './errorCode';

   export type ErrorBody = Record<
     keyof ErrorCode,
     { code: ErrorCode[keyof ErrorCode]; message: keyof ErrorBody }
   >;

   const errorBody = Object.fromEntries(
     (Object.keys(errorCode) as [keyof ErrorCode])
       .filter((k) => isNaN(Number(k)))
       .map((k) => [
         k,
         { code: errorCode[k], message: errorCode[errorCode[k]] },
       ])
   ) as ErrorBody;

   export default errorBody;
   ```

4. 判断并抛出异常

   src/controller/userController.ts

   ```typescript
   import { Context } from 'koa';
   import { createUser } from '../service/userService';
   import errorBody from '../constants/errorBody';

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
       .catch(() =>
         ctx.app.emit('error', ctx, errorBody.USER_REGISTER_EXCEPTION)
       );
   }

   export async function login(ctx: Context) {
     ctx.body = '登录成功';
   }
   ```

5. 监听异常并响应

   src/app/index.ts

   ```typescript
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
   ```

# 异常完善

1. 补充错误码

   /src/constants/errorCode.ts

   ```typescript
   enum errorCode {
     // 1xxxx: 后端异常
     // 2xxxx: 前端异常
     MISSING_REQUIRED_PARAMETER = 20001,
     // 3xxxx: user服务异常
     USER_REGISTER_EXCEPTION = 30001,
     USER_ALREADY_EXISTS,
   }

   export default errorCode;
   export type ErrorCode = typeof errorCode;
   ```

2. 补充状态码

   src/constants/errorCodeToHttpStatusMap.ts

   ```typescript
   enum errorCode {
     // 1xxxx: 后端异常
     // 2xxxx: 前端异常
     MISSING_REQUIRED_PARAMETER = 20001,
     // 3xxxx: user服务异常
     USER_REGISTER_EXCEPTION = 30001,
     USER_ALREADY_EXISTS,
   }

   export default errorCode;
   export type ErrorCode = typeof errorCode;
   ```

3. 增加查询用户服务

   /src/service/userService.ts

   ```typescript
   import users, { User } from '../model/userModel';
   export async function createUser(username: string, password: string) {
     const res = await users.create({ username, password });
     return res.dataValues;
   }

   export async function getUserInfo(where: {
     id?: number;
     username?: string;
   }): Promise<User | void> {
     const res = await users.findOne({ where });
     return res?.dataValues;
   }
   ```

4. 必要参数校验中间件创建函数

   src/middleware/utils.ts

   ```typescript
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
   ```

5. 创建检查异常的中间件

   1. 参数检查中间件
   2. 判断用户已存在中间件

   src/middleware/userMiddleware.ts

   ```typescript
   import { Context, Next } from 'koa';
   import errorBody from '../constants/errorBody';
   import { createRequiredValidator } from './utils';
   import { getUserInfo } from '../service/userService';

   export const registerRequired = userRequired('username', 'password');

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
       .catch(() =>
         ctx.app.emit('error', ctx, errorBody.USER_REGISTER_EXCEPTION)
       );
   }
   ```

6. 路由添加中间件

   /src/router/user.ts

   ```typescript
   import KoaRouter from '@koa/router';
   import { register, login } from '../controller/userController';
   import {
     userRequired,
     userAlreadyExists,
   } from '../middleware/userMiddleware';

   const router = new KoaRouter({ prefix: '/user' });

   router.post('/register', userRequired, userAlreadyExists, register);
   router.post('/login', login);

   export default router;
   ```

# 密码加密

1. 依赖安装

   ```bash
   pnpm i bcryptjs
   pnpm i -D @types/bcryptjs
   ```

2. 加密中间件

   src/middleware/userMiddleware.ts

   ```typescript
   import { hashSync } from 'bcryptjs';
   // ...
   export async function securePassword(ctx: Context, next: Next) {
     const body = ctx.request.body as Record<string, string>;
     body.password = hashSync(body.password);
     await next();
   }
   ```

3. 添加路由

   src/router/userRouter.ts

   ```typescript
   import {
     userRequired,
     userAlreadyExists,
     securePassword,
   } from '../middleware/userMiddleware';
   // ...
   router.post(
     '/register',
     userRequired,
     userAlreadyExists,
     securePassword,
     register
   );
   ```

# 登录功能

1. 错误码补充

   /src/contants/errorCode.ts

   ```typescript
   enum errorCode {
     // 1xxxx: 后端异常
     // 2xxxx: 前端异常
     MISSING_REQUIRED_PARAMETER = 20001,
     // 3xxxx: user服务异常
     USER_REGISTER_EXCEPTION = 30001,
     USER_ALREADY_EXISTS,
     USER_NOT_EXISTS,
     USER_LOGIN_EXCEPTION,
     USER_INVALID_PASSWORD,
   }

   export default errorCode;
   export type ErrorCode = typeof errorCode;
   ```

2. http 状态码补充

   /src/contants/errorCodeToHttpStatusMap.ts

   ```typescript
   import { ErrorCode } from './errorCode';

   const errorCodeToHttpStatusMap: Record<keyof ErrorCode, number> = {
     MISSING_REQUIRED_PARAMETER: 422,
     USER_REGISTER_EXCEPTION: 500,
     USER_ALREADY_EXISTS: 409,
     USER_NOT_EXISTS: 404,
     USER_LOGIN_EXCEPTION: 500,
     USER_INVALID_PASSWORD: 403,
   };

   export default errorCodeToHttpStatusMap;
   ```

3. 校验登录中间件

   src/middleware/userMiddleware.ts

   ```typescript
   import { compareSync, hashSync } from 'bcryptjs';
   // ...

   export async function verifyLogin(ctx: Context, next: Next) {
     const { username, password } = ctx.request.body as Record<string, string>;
     await getUserInfo({ username })
       .then(async (value) => {
         if (!value)
           return ctx.app.emit('error', ctx, errorBody.USER_NOT_EXISTS);
         const isPasswordCorrect = compareSync(password, value.password);
         if (!isPasswordCorrect) {
           return ctx.app.emit('error', ctx, errorBody.USER_INVALID_PASSWORD);
         }
         await next();
       })
       .catch(() =>
         ctx.app.emit('error', ctx, errorBody.USER_REGISTER_EXCEPTION)
       );
   }
   ```

4. 登录控制器

   src/controller/userController.ts

   ```typescript
   import { createUser, getUserInfo } from '../service/userService';
   // ...
   export async function login(ctx: Context) {
     const { username } = ctx.request.body as Record<string, string>;
     await getUserInfo({ username })
       .then(({ id }) => {
         ctx.body = {
           code: 0,
           message: 'login successfully',
           result: { id, username },
         };
       })
       .catch(() => ctx.app.emit('error', errorBody.USER_LOGIN_EXCEPTION));
   }
   ```

5. 添加路由

   src/router/userRouter.ts

   ```typescript
   import {
     userRequired,
     userAlreadyExists,
     securePassword,
     verifyLogin,
   } from '../middleware/userMiddleware';
   // ...
   router.post('/login', userRequired, verifyLogin, login);
   ```

# jwt 用户认证

1. 安装依赖

   ```bash
   pnpm i -D @types/jsonwebtoken
   pnpm i jsonwebtoken
   ```

2. 配置 jwt 密码

   .env

   ```
   APP_PORT=56829
   JWT_SECRET=!Xhec^21Llv^8oD
   ```

3. 导出 jwt 密码

   src/config.ts

   ```typescript
   import dotenv from 'dotenv-flow';

   const config = dotenv.config<Record<'APP_PORT' | 'JWT_SECRET', string>>();
   if (config.error) throw config.error;

   export const { APP_PORT, JWT_SECRET } = config.parsed!;
   ```

4. 登录时提供 token

   src/controller/userController.ts

   ```typescript
   import { sign } from 'jsonwebtoken';
   import { JWT_SECRET } from '../config';
   // ...
   export async function login(ctx: Context) {
     const { username } = ctx.request.body as Record<string, string>;
     await getUserInfo({ username })
       .then((userInfo) => {
         const { id, updatedAt } = userInfo;
         const token = jwt.sign({ id, updatedAt }, JWT_SECRET, {
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
   ```

5. 错误码补充

   src/constants/errorCode.ts

   ```typescript
   enum errorCode {
     // 1xxxx: 后端异常
     INVALID_TOKEN = 10001,
     // 2xxxx: 前端异常
     MISSING_REQUIRED_PARAMETER = 20001,
     // 3xxxx: user服务异常
     USER_REGISTER_EXCEPTION = 30001,
     USER_ALREADY_EXISTS,
     USER_NOT_EXISTS,
     USER_LOGIN_EXCEPTION,
     USER_INVALID_PASSWORD,
   }

   export default errorCode;
   export type ErrorCode = typeof errorCode;
   ```

6. http 状态码补充

   src/constants/errorCodeToHttpStatusMap.ts

   ```typescript
   import { ErrorCode } from './errorCode';

   const errorCodeToHttpStatusMap: Record<keyof ErrorCode, number> = {
     INVALID_TOKEN: 401,
     MISSING_REQUIRED_PARAMETER: 422,
     USER_REGISTER_EXCEPTION: 500,
     USER_ALREADY_EXISTS: 409,
     USER_NOT_EXISTS: 404,
     USER_LOGIN_EXCEPTION: 500,
     USER_INVALID_PASSWORD: 403,
   };

   export default errorCodeToHttpStatusMap;
   ```

7. auth 中间件

   src/middleware/authMiddleware.ts

   ```typescript
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
       const payload = verify(
         authorization!.slice(7),
         JWT_SECRET
       ) as AuthPayload;
       const info = await getUserInfo({ id: payload.id });
       if (info!.createdAt.toISOString() !== payload.updatedAt) throw Error();
       ctx.state.user = payload;
       valid = true;
     } catch {
       ctx.app.emit('error', ctx, errorBody.INVALID_TOKEN);
     } finally {
       if (valid) await next();
     }
   }
   ```

# 修改密码

1. 错误码补充

   src/constants/errorCode.ts

   ```typescript
   enum errorCode {
     // 1xxxx: 后端异常
     INVALID_TOKEN = 10001,
     // 2xxxx: 前端异常
     MISSING_REQUIRED_PARAMETER = 20001,
     // 3xxxx: user服务异常
     USER_REGISTER_EXCEPTION = 30001,
     USER_ALREADY_EXISTS,
     USER_NOT_EXISTS,
     USER_LOGIN_EXCEPTION,
     USER_INVALID_PASSWORD,
     USER_UPDATE_PASSWORD_EXCEPTION,
   }

   export default errorCode;
   export type ErrorCode = typeof errorCode;
   ```

2. 状态码补充

   src/constants/errorCodeToHttpStatusMap.ts

   ```typescript
   import { ErrorCode } from './errorCode';

   const errorCodeToHttpStatusMap: Record<keyof ErrorCode, number> = {
     INVALID_TOKEN: 401,
     MISSING_REQUIRED_PARAMETER: 422,
     USER_REGISTER_EXCEPTION: 500,
     USER_ALREADY_EXISTS: 409,
     USER_NOT_EXISTS: 404,
     USER_LOGIN_EXCEPTION: 500,
     USER_INVALID_PASSWORD: 403,
     USER_UPDATE_PASSWORD_EXCEPTION: 500,
   };

   export default errorCodeToHttpStatusMap;
   ```

3. 更新用户数据服务

   src/service/userService.ts

   ```typescript
   export async function updateUser(userInfo: {
     id: number;
     username?: string;
     password?: string;
   }) {
     const { id, ...user } = userInfo;
     const result = await users.update(user, { where: { id } });
     return Boolean(result[0]);
   }
   ```

4. 更新密码控制器

   src/controller/userController.ts

   ```typescript
   import { createUser, getUserInfo, updateUser } from '../service/userService';
   // ...
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
   ```

5. 增加路由

   src/router/userService.ts

   ```typescript
   import { createRequiredValidator } from '../middleware/utils';
   import { auth } from '../middleware/authMIddleware';
   // ...
   router.post(
     '/updatePassword',
     auth,
     createRequiredValidator('password'),
     securePassword,
     updatePassword
   );
   ```
