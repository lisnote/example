import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'temp.sqlite',
});
sequelize
  .authenticate()
  .then(() => console.log('connection successful'))
  .catch(() => console.log('connection failed'));
export default sequelize;