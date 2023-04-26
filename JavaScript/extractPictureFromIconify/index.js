const { icons } = require("@iconify/json/json/el.json");
const sharp = require("sharp");
const fs = require("fs/promises");
const { Buffer } = require("node:buffer");

Object.entries(icons).forEach(async ([name, { body }]) => {
  await fs.mkdir("el-icons").catch(() => {});
  await fs.mkdir("blue-icons").catch(() => {});
  await fs.mkdir("gray-icons").catch(() => {});
  fs.writeFile(
    `./el-icons/${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">${body}</svg>`
  );
  sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">${body}</svg>`.replaceAll(
        "currentColor",
        "#909399"
      )
    )
  )
    .resize(200)
    .toFile(`./gray-icons/${name}.png`);
  sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">${body}</svg>`.replaceAll(
        "currentColor",
        "#409EFF"
      )
    )
  )
    .resize(200)
    .toFile(`./blue-icons/${name}.png`);
});
console.log(Object.keys(icons).length);
