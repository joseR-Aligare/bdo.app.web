const { app, BrowserWindow, Menu } = require('electron');
const path = require('path')
const log = require('electron-log');
const { autoUpdater } = require("electron-updater");


autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');
process.env.APPDATA = app.getPath('appData');

let mainWindow;

function sendStatusToWindow(text) {
  log.info(text);
  console.log(text);
  mainWindow.webContents.send('message', text);
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})

autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})

autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (ev, info) => {
  sendStatusToWindow('Update downloaded');

  setTimeout(function () {
    autoUpdater.quitAndInstall();
  }, 5000)
})

async function createWindow() {
  const template = [
    {
      label: "Menú",
      submenu: [
        { label: "Recargar", click: () => mainWindow.reload(), accelerator: "CommandOrControl+r" },
        { label: "devTools", role: "toggleDevTools", accelerator: "CommandOrControl+t" },
        { label: "Salir", role: "quit", accelerator: "CommandOrControl+q" },
      ]
    }
  ];

  const mainMenu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(mainMenu);

  mainWindow = new BrowserWindow({
    // width: 1920,
    // height: 1080,
    fullscreen: false,
    fullscreenable: true,
    center: true,
    resizable: true,
    frame: true,
    minimizable: true,
    maximizable: true,
    closable: true,
    alwaysOnTop: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      webSecurity: false, // quitamos problemas de cors
      // enableRemoteModule: true,
      backgroundThrottling: false
    }
  });

  if (process.platform !== 'darwin') mainWindow.setMenuBarVisibility(true);

  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || '3000';
    console.log(`Running in ${process.env.NODE_ENV} mode...`);
    mainWindow.loadURL(`http://localhost:${port}`);
  } else {
    console.log(`Running in ${process.env.NODE_ENV} mode...`);
    const { startExpress } = require('./express-starter')
    let port = Number(process.env.PORT) || 3000

    while (true) {
      try {
        const result = await startExpress(port)
        if (result) {
          mainWindow.loadURL(`http://localhost:${port}`)
          break
        }
      } catch (err) {
        console.log(err.message)
        port++
      }
    }

  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('ready', function () {
  console.log('Buscar actualizaciones');
  autoUpdater.checkForUpdatesAndNotify();
});

app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
