const { app, BrowserWindow } = require('electron');
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { webSecurity: false },
  });
  win.webContents.openDevTools();

  win.loadFile('index.html');
};
app.whenReady().then(() => {
  createWindow({ webPreferences: { webSecurity: false } });
});
