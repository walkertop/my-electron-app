console.log(window.myAPI)

const setButton = document.getElementById('btn')
const titleInput = document.getElementById('title')
setButton.addEventListener('click', () => {
    const title = titleInput.value
    // window.electronAPI.setTitle(title)
    setButton.style.backgroundColor = 'pink'

});


/** 关键对象
 * app 程序生命周期
 * window
 * process
 * document
*/