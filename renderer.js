console.log(window.myAPI)

const setButton = document.getElementById('btn')
const titleInput = document.getElementById('title')
const fileBtn = document.getElementById('fileBtn')
const filePathElement = document.getElementById('filePath')
const counter = document.getElementById('counter')

setButton.addEventListener('click', () => {
    const title = titleInput.value
    window.electronAPI.setTitle(title)
    setButton.style.backgroundColor = 'pink'
});

fileBtn.addEventListener('click', async () => {
  const filePath = await window.electronAPI.openFile()
  filePathElement.innerText = filePath
})

window.electronAPI.onUpdateCounter((_event, value) => {
    const oldValue = Number(counter.innerText)
    const newValue = oldValue + value
    counter.innerText = newValue
})

// window.electronMessagePort.postmessage('ping')

