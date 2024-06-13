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

export async function updateUser(userInfo: {
  id: number;
  username?: string;
  password?: string;
}) {
  const { id, ...user } = userInfo;
  const result = await users.update(user, { where: { id } });
  return Boolean(result[0]);
}
