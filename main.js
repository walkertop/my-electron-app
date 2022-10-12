const {app, BrowserWindow, ipcMain, MessageChannelMain} = require('electron')
const {Menu, dialog} = require('electron')
const path = require('path')

function createWindow () {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      // contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  setupMenu(mainWindow)
  setupDevTools(mainWindow)
  mainWindow.loadFile('index.html')

  const secondaryWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      // contextIsolation: false,
      preload: 'preloadSecondary.js'
    }
  })

  setupMsgChannel(mainWindow, secondaryWindow)
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

const setupMsgChannel = (window1, window2) => {
  const { port1, port2 } = new MessageChannelMain()
  window1.once('ready-to-show', () => {
    window1.webContents.postMessage('port', null, [port1])
  })

  window2.once('ready-to-show', () => {
    window2.webContents.postMessage('port', null, [port2])
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