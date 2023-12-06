import express from "express";
import fs from "fs";

const app = express();

const port = 8080;
app.use(
  "/",
  express.static("static"),
  // 允许上传最大为1G的任意类型文件
  express.raw({ limit: 1 << 30, type: "*/*" })
);
let fileName = "";
let text = "";
fs.mkdirSync("static/upload", { recursive: true });
app.use("/upload/:fileName", (req, res, next) => {
  fileName = req.params.fileName;
  fs.readdirSync("static/upload/").forEach((name) => {
    fs.unlinkSync("static/upload/" + name);
  });
  fs.writeFileSync("static/upload/" + fileName, req.body);
  res.end();
  next();
});
app.use("/postText", (req, res, next) => {
  text = req.body.toString();
  res.end();
  next();
});
app.use("/fetchData", (req, res, next) => {
  res.send({ text, fileName });
  next();
});

app.listen(8080,'0.0.0.0', () =>
  console.log(`[server]: Server is running at http://0.0.0.0:${port}`)
);
