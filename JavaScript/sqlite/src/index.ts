// index.ts
import { verbose } from 'sqlite3';

const sqlite3 = verbose();

// 这个代码会自动在当前目录创建一个名为 `temp.sqlite` 的空文件作为数据库, 如果该文件已经存在则读取该文件作为数据库
const db = new sqlite3.Database('./lisnote.sqlite');
db.serialize(() => {
  // 创建一个名为 dishes 的表
  db.run(`
    CREATE TABLE
    IF NOT EXISTS dishes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            token TEXT NOT NULL,
            name TEXT NOT NULL,
            cookware TEXT CHECK ( cookware IN ( 0, 1, 2, 3 ) ) NOT NULL,
            ingredients TEXT NOT NULL,
            features TEXT NOT NULL,
            missingFeatures TEXT DEFAULT '[]',
            price REAL,
            cookingTime REAL,
            unlock TEXT,
            description TEXT
    );`);

  // 创建一个向 dishes 表插入数据的 statement 对象, 并在执行语句后关闭 statement
  const stmt = db.prepare(`
  INSERT INTO dishes ( token, name, cookware, ingredients, features )
  VALUES
    ( ?, ?, ?, ?, ? );`);
  for (let i = 0; i < 3; i++) {
    stmt.run('假装有token', '不知名名菜', 1, '["油饼"]', '["菜"]');
  }
  stmt.finalize();

  // 修改 id 为 1 的行数据
  db.run(`
    UPDATE dishes 
    SET "name" = 'lisnote',
    "cookware" = '1',
    "features" = '["重油"]' 
    WHERE id = 1`);

  // 删除 id 为 3 且 token 为 假装有token 的行
  db.run(`DELETE FROM dishes WHERE id = 2 AND token = '假装有token'`);

  // 查询dishes表中的[0,0+10)条数据
  db.all('SELECT * from dishes LIMIT 0,10', (err, data) => {
    console.log(data);
  });
});

db.close();
