const { contextBridge, ipcRenderer, BrowserWindow } = require("electron");

contextBridge.exposeInMainWorld(
    "api", {
    send: (channel, data) => {
        let validChannels = ["exit", "hide", "click-clipboard"]; // IPC채널들 추가
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        let validChannels = ["fromMain", "close-clipboard", "open-clipboard"]; // IPC채널들 추가
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
}
);