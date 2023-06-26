const fs = require('fs'),
  path = require('path');
function walkSync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath, { withFileTypes: true }).forEach(function (
    dirent,
  ) {
    const filePath = path.join(currentDirPath, dirent.name);
    if (dirent.isFile()) {
      callback(filePath, dirent);
    } else if (dirent.isDirectory()) {
      walkSync(filePath, callback);
    }
  });
}
walkSync('src', function (filePath, stat) {
  const extra = stat.name.split('.').pop();
  if (['ts', 'vue', 'js'].includes(extra)) {
    fs.appendFileSync('temp.md', `文件路径: ${filePath}`);
    fs.appendFileSync(
      'temp.md',
      `\n\`\`\`${extra}\n${fs.readFileSync(filePath)}\n\`\`\`\n`,
    );
  }
});
