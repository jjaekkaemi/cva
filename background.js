const { app, BrowserWindow, ipcMain, clipboard, dialog, nativeImage } = require("electron");
const { createDatabase,  changeIsAddData, getData, deleteData } = require("./electron/database.js");
const { clipboardinit, clipboardUpdate } = require("./electron/clipboard.js")
const { initTrayIconMenu } = require("./electron/tray.js");
const path = require('path')
const fs = require('fs');
const robot = require('robotjs')
const Store = require("electron-store");
const store = new Store();
let win, db;
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
    db = createDatabase(path.join(app.getPath("userData"), "./database.db"));
    let shortcut = await clipboardinit(win, db)
    initTrayIconMenu(win, db, app, path.join(__dirname, "logo.ico"), shortcut);
    setTimeout(async () => {win.webContents.send("open-main", await getData(db))}, 500)
    win.on("hide", () => {
        // console.log("hide start")
    });
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
ipcMain.on("get-clipboard", async (event, data) => {
    console.log(`Received [${data}] from renderer browser`);
    win.webContents.send("return-clipboard", await getData(db));
});
ipcMain.on("click-clipboard", (event, data) => {
    console.log(`Received [${data}] from renderer browser`);
    changeIsAddData(false)
    if(data.type==0){
        clipboard.writeText(data.data)
    }
    else{
        clipboard.writeImage(nativeImage.createFromDataURL(data.data))
    }
    robot.keyTap('v', process.platform === 'darwin' ? 'command' : 'control')

});
ipcMain.on("save-clipboard", (event, data) => {
    console.log(`Received [${data.data}] from renderer browser`);
    let savedata = null
    let defaultpath = null
    let filter = {name: null, extensions: null}
    if(data.type==0){
        savedata = data.data
        defaultpath = '../assets/sample.txt'
        filter.name = 'Text Files'
        filter.extensions = ['txt']

    }
    else{
        let newImage = nativeImage.createFromDataURL(data.data)
        filter.name = 'Images'
        filter.extensions = ['jpg', 'png']
        if(data.data.split(",")[0].indexOf("png")!= -1){
            savedata = newImage.toPNG(1.0)
            defaultpath = '../assets/sample.png'
            
        }
        else{
            savedata = newImage.toJPEG(100)
            defaultpath = '../assets/sample.jpg'
        }

    }
         dialog.showSaveDialog({
        title: 'Select the File Path to save',
        defaultPath: path.join(__dirname, defaultpath),
        // defaultPath: path.join(__dirname, '../assets/'),
        buttonLabel: 'Save',
        // Restricting the user to only Text Files.
        filters: [
            filter, ],
        properties: []
    }).then(file => {
        // Stating whether dialog operation was cancelled or not.
        console.log(file.canceled);
        if (!file.canceled) {
            console.log(file.filePath.toString());
              
            // Creating and Writing to the sample.txt file
            fs.writeFile(file.filePath.toString(), 
                        savedata, function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        }
    }).catch(err => {
        console.log(err)
    });
       
});
ipcMain.on("remove-clipboard", (event, data) => {
    console.log(`Received [${data}] from renderer browser`);
    deleteData(db, data)

});

ipcMain.on("change-key", (event, data) => {
    console.log(`Received [${data}] from renderer browser`);
    clipboardUpdate(data)
});

ipcMain.on("get-shortcut", (event, data) => {
    console.log(`Received [${data}] from renderer browser`);
    let shortcut = store.get("clipboardopen")
    if(shortcut) win.webContents.send("return-shortcut", shortcut)
    else win.webContents.send("return-shortcut", "")
});