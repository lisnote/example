import express from "express";

const app = express();

const port = 8080;
app.use("/", express.static("static"));
// 允许上传最大为1M的任意类型文件
app.use(
  "/upload",
  express.raw({ limit: 1048576, type: "*/*" }),
  (req, res, next) => {
    console.log("file", req.body.length, req.body);
    res.end();
    next();
  }
);

app.listen(port, () =>
  console.log(`[server]: Server is running at http://localhost:${port}`)
);
