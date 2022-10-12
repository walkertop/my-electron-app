# my-electron-app
electron-app



## 关键对象
app 
window
process
document
## 通信
单向通信
双向通信
同步（sync)通信
异步（async)通信
安全通信
不安全通信



Process Sandboxing进程沙盒化导致影响渲染器进程之间的通信。
### 渲染器进程之间的通信
没有直接的方法可以使用 `ipcMain` 和 `ipcRenderer` 模块在 `Electron` 中的渲染器进程之间发送消息。 为此，您有两种选择：

- 将主进程作为渲染器之间的消息代理。 这需要将消息从一个渲染器发送到主进程，然后主进程将消息转发到另一个渲染器。
- 从主进程将一个 `MessagePort` 传递到两个渲染器。 这将允许在初始设置后渲染器之间直接进行通信。

渲染器进程因为沙盒化的环境，没有 Node.jsh 环境，所以只能透过 IPC 委派任务给主进程的方式执行需要权限的任务。（比如文案系统交互，对系统进行更改，或者生成子进程）。

为了让渲染进程能与主进程通信，附属于沙盒化的渲染进程的 preload 脚本中仍可使用一部分以 Polyfill 形式实现的 Node.js API。 有一个与 Node 中类似的 require 函数提供了出来，但只能载入 Electron 和 Node 内置模块的一个子集：

- electron (仅限渲染器进程模块)
- 事件
- timers
- url

此外，以下 Node.js 基础对象也填充到了 preload 脚本的全局上下文中：

- Buffer
- process
- clearImmediate
- setImmediate