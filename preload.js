const { contextBridge, ipcRenderer } = require('electron')
/**
 * exposeInMainWorld 暴露API
 */

// 未开启上下文隔离（webcontent isolation)，暴露 API的方式
// window.testAPI = {
//   console.log("testAPI")
// }

// 开启上下文隔离（webcontent isolation)，暴露 API的方式
contextBridge.exposeInMainWorld('myAPI', {
  desktop: true,
})

contextBridge.exposeInMainWorld('electronAPI',{
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  onUpdateCounter: (callback) => ipcRenderer.on('update-counter', callback)
})

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

// 注册 listener
window.addEventListener('test', () => {
  const testTarget = () => {
    const element = document.getElementById("content")
    element.style.backgroundColor = 'pink'
  }
})