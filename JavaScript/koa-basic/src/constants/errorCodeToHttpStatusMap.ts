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
