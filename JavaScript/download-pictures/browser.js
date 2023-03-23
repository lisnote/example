let pics = [
  "https://steamuserimages-a.akamaihd.net/ugc/853856987591209532/598CC1EC74F56DC2D2E18D3197D3B36C4DC11DA2/",
  "https://steamuserimages-a.akamaihd.net/ugc/853856987591210086/C94718DB3CDE5F6BFF84C464068EB58C206887CD/",
  "https://steamuserimages-a.akamaihd.net/ugc/853856987591210341/5B920A47B316236206D49A211F0F5842C4DAF8E2/",
  "https://steamuserimages-a.akamaihd.net/ugc/853856987591210480/7EFB45326F7960B99A9C428B0D07B063BCF121E7/",
  "https://steamuserimages-a.akamaihd.net/ugc/853856987591210619/D69199DADA16A631388E361DE9FD53EB4ECACA9C/",
];
let success = [];
let fail = [];
let body = document.body;
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
      let dataUrl = URL.createObjectURL(blob);
      let el = document.createElement("a");
      el.href = dataUrl;
      el.download = filePath + extName;
      body.appendChild(el);
      el.click();
      success.push(url);
    })
    .catch(() => fail.push(url));
}

await pics.reduce(async (pre, item, index, arr) => {
  await pre;
  console.log(`下载进度: ${((index / arr.length) * 100).toFixed(2)}%`);
  return download(item, `${index}`);
}, undefined);
console.log(`下载总数: ${pics.length}
  成功: ${success.length}
  失败: ${fail.length}`);
