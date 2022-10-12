const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
    win.webContents.openDevTools()


    win.loadFile('index.html')
    // win.loadURL('https://baidu.com')
  }

  app.whenReady().then(() => {
    createWindow()
    ipcMain.on('set-title', handleSetTitle)

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })


  function handleSetTitle (event, title) {
    debugger
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
  }