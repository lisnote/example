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
