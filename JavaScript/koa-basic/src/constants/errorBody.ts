import errorCode, { ErrorCode } from './errorCode';

export type ErrorBody = Record<
  keyof ErrorCode,
  { code: ErrorCode[keyof ErrorCode]; message: keyof ErrorBody}
>;

const errorBody = Object.fromEntries(
  (Object.keys(errorCode) as [keyof ErrorCode])
    .filter((k) => isNaN(Number(k)))
    .map((k) => [k, { code: errorCode[k], message: errorCode[errorCode[k]] }])
) as ErrorBody;

export default errorBody;
