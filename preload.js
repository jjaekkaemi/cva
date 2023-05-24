const { contextBridge, ipcRenderer, BrowserWindow } = require("electron");

contextBridge.exposeInMainWorld(
    "api", {
    send: (channel, data) => {
        let validChannels = ["exit", "hide", "click-clipboard", "get-clipboard", "remove-clipboard", "change-key", "save-clipboard", "next-clicked", "pre-clicked"]; // IPC채널들 추가
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        let validChannels = ["fromMain", "close-clipboard", "open-clipboard", "open-main"]; // IPC채널들 추가
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
}
);