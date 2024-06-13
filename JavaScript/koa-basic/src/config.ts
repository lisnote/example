import dotenv from 'dotenv-flow';

const config = dotenv.config<Record<'APP_PORT' | 'JWT_SECRET', string>>();
if (config.error) throw config.error;

export const { APP_PORT, JWT_SECRET } = config.parsed!;
