// index.ts
import { verbose } from "sqlite3";
import express from "express";

// 初始化
const sqlite3 = verbose();
const db = new sqlite3.Database("./temp.sqlite");
const basePath = encodeURI('/东方夜雀工具箱/backend')
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
const app = express();
app.listen(9931, () => console.info("http://localhost:9931"));

// 查询表长度和页数
let count = 0;
let maxPage = 0;
const pageLength = 10;
async function updateCount() {
  return new Promise((resolve, rejects) => {
    db.get("SELECT COUNT(*) as count FROM dishes;", (err, data: any) => {
      if (err) {
        rejects();
      } else {
        count = data.count;
        maxPage = Math.ceil(count / pageLength);
        resolve({ count, maxPage });
      }
    });
  });
}
updateCount();

// 插入数据
const stmt = db.prepare(`
INSERT INTO dishes ( token, name, cookware, ingredients, features, missingFeatures, price, cookingTime, unlock, description )
VALUES
  ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );`);
app.post(`${basePath}/insert`, express.json({ limit: 1 << 20 }), (req, res, next) => {
  const {
    token,
    name,
    cookware,
    ingredients,
    features,
    missingFeatures,
    price,
    cookingTime,
    unlock,
    description,
  } = req.body;
  stmt.run(
    Object.values({
      token,
      name,
      cookware,
      ingredients: JSON.stringify(ingredients),
      features: JSON.stringify(features),
      missingFeatures: JSON.stringify(missingFeatures),
      price,
      cookingTime,
      unlock,
      description,
    }),
    async (err) => {
      if (err) {
        res.send({ statusMessage: err.message });
      } else {
        res.send({ statusMessage: "success" });
        await updateCount();
      }
      next();
    }
  );
});

// 查询
console.log(`${basePath}/select/:page`)
app.use(`${basePath}/select/:page`, (req, res, next) => {
  let page = +req.params.page;
  if (page < 1) {
    page = 1;
  } else if (page > maxPage) {
    page = maxPage;
  }
  db.all(
    `SELECT *,rowid from dishes LIMIT ${(page - 1) * pageLength},${pageLength}`,
    (err, data) => {
      if (err) {
        res.send({
          statusMessage: err.message,
        });
      } else {
        res.send({
          statusMessage: "success",
          count,
          data,
        });
      }
      next();
    }
  );
});
