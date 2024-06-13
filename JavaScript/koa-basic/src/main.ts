import app from './app';
import { APP_PORT } from './config';

app.listen(APP_PORT, () =>
  console.log(`server is running on http://localhost:${APP_PORT}`)
);
