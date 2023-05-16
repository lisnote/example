import express from "express";
import fs from "fs";

const app = express();

const port = 8080;
app.use(
  "/",
  express.static("static"),
  express.raw({ limit: (1 << 30) * 10, type: "*/*" })
);
// 允许上传最大为10G的任意类型文件
let fileName = "avatar.jpg";
let text = "";
app.use("/upload/:fileName", (req, res, next) => {
  fileName = req.params.fileName;
  fs.writeFileSync("static/" + fileName, req.body);
  res.end();
  next();
  let fileList = fs.readdirSync("static");
  fileList
    .filter((name) => name !== "index.html" && name !== fileName)
    .forEach((name) => {
      fs.unlinkSync("static/" + name);
    });
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

app.listen(port, () =>
  console.log(`[server]: Server is running at http://localhost:${port}`)
);
