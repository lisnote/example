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
