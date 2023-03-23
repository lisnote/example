let pics = require("./linkList");
const fs = require("fs/promises");

fs.mkdir("./temp", { recursive: true }).then(() => {
  pics.reduce(async (pre, item, index, arr) => {
    await pre;
    console.log(`下载进度: ${((index / arr.length) * 100).toFixed(2)}%`);
    return download(item, `./temp/${index}`);
  }, undefined);
});

let success = [];
let fail = [];
async function download(url, filePath) {
  return fetch(url)
    .then(async (res) => {
      const blob = await res.blob();
      let extName;
      if (blob.type.includes("image/")) {
        extName = blob.type.replace("image/", ".");
      } else {
        extName = ".jpeg";
      }
      let steam = blob.stream();
      fs.writeFile(filePath + extName, steam).then(() => {
        success.push(url);
      });
    })
    .catch(() => fail.push(url));
}
