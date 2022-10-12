const {app, BrowserWindow, ipcMain} = require('electron')
const {Menu, dialog} = require('electron')

const path = require('path')

function createWindow () {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  setupMenu(mainWindow)
  setupDevTools(mainWindow)
  mainWindow.loadFile('index.html')
}

const setupMenu = (window) => {
  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
      {
        click: () => window.webContents.send('update-counter', 1),
        label: 'Increment',
      },
      {
        click: () => window.webContents.send('update-counter', -1),
        label: 'Decrement',
      }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)
}

app.whenReady().then(() => {

  registerIPCLister()
  registerHandler()
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

const registerHandler = () => {
  ipcMain.handle('dialog:openFile', handleFileOpen)
}

const registerIPCLister = () => {
  ipcMain.on('counter-value', (_event, value) => {
    console.log(value) // 将打印到 Node 控制台
  })
}

const setupDevTools = (window) => {
  window.webContents.openDevTools()
}

// private method
async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}