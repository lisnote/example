import KoaRouter from '@koa/router';
import { register, login, updatePassword } from '../controller/userController';
import {
  userRequired,
  userAlreadyExists,
  securePassword,
  verifyLogin,
} from '../middleware/userMiddleware';
import { createRequiredValidator } from '../middleware/utils';
import { auth } from '../middleware/authMIddleware';

const router = new KoaRouter({ prefix: '/user' });

router.post(
  '/register',
  userRequired,
  userAlreadyExists,
  securePassword,
  register
);
router.post('/login', userRequired, verifyLogin, login);
router.post(
  '/updatePassword',
  auth,
  createRequiredValidator('password'),
  securePassword,
  updatePassword
);

export default router;
