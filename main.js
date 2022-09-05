const { app, BrowserWindow, ipcMain, clipboard } = require("electron");
const { createDatabase } = require("./database.js");
const { clipboardinit } = require("./clipboard.js")
const { initTrayIconMenu } = require("./tray.js");
const path = require('path')
const robot = require('robotjs')
let win;

async function createWindow() {

    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: false, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: app.getAppPath() + "/preload.js" // use a preload script
        }
    });
    win.webContents.openDevTools()  //랜더러에서 console창 보여주기
    win.loadFile(app.getAppPath() + "/index.html");

    // let db = createDatabase("database.db");
    // await clipboardinit(win, db)
    // initTrayIconMenu(win, db, app, path.join(process.resourcesPath, "logo.png"));
    let db = createDatabase(path.join(app.getPath("userData"), "./database.db"));
    await clipboardinit(win, db)
    initTrayIconMenu(win, db, app, path.join(__dirname, "logo.ico"));
}
app.setLoginItemSettings({
    openAtLogin: true,
});
app.on("ready", createWindow);


ipcMain.on("exit", (event, data) => {
    console.log(`Received [${data}] from renderer browser`);
    win.webContents.send("fromMain", ' here is main! ');
    win.close()
});

ipcMain.on("hide", (event, data) => {
    console.log(`Received [${data}] from renderer browser`);
    win.webContents.send("fromMain", ' here is main! ');
    win.hide()
});

ipcMain.on("click-clipboard", (event, data) => {
    console.log(`Received [${data}] from renderer browser`);
    clipboard.writeText(data)
    robot.keyTap('v', process.platform === 'darwin' ? 'command' : 'control')

});