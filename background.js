const { app, BrowserWindow, ipcMain, clipboard, dialog, nativeImage, screen, powerMonitor   } = require("electron");
const { createDatabase,  changeIsAddData, getData, deleteData, deleteExpiredData, initialize, getNextData, getPreviousData, getCliboardData } = require("./electron/database.js");
const { clipboardinit, clipboardUpdate } = require("./electron/clipboard.js")
const { initTrayIconMenu, getClipbaordPeriod } = require("./electron/tray.js");
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

    // db = createDatabase("database.db");
    // await clipboardinit(win, db)
    // initTrayIconMenu(win, db, app, path.join(process.resourcesPath, "logo.png"));
    
    
    console.log(getCliboardData())
    let shortcut = await clipboardinit(win, db)
    
    initTrayIconMenu(win, db, app, path.join(__dirname, "logo.ico"), shortcut);
    // setTimeout(async () => {win.webContents.send("open-main", getCliboardData())}, 500)

    
    deleteExpiredData(db, getClipbaordPeriod())
    startBackgroundTask();
    win.webContents.send("open-main", getCliboardData())
    // // 앱이 준비되면 offscreen 윈도우를 생성합니다.
    // globalOffscreenWindow.create();

    // // offscreen 윈도우가 활성화되면 메인 윈도우를 숨깁니다.
    // globalOffscreenWindow.on('focus', () => {
    //     if (mainWindow) {
    //         mainWindow.hide();
    //     }
    // });
//     win.webContents.on('did-finish-load', () => {
//     win.webContents.executeJavaScript(`
//       const style = document.createElement('style');
//       style.innerHTML = '* { cursor: inherit !important; }';
//       document.head.appendChild(style);
//     `);
//   });
    win.hide()

}
async function getInit(){
    await initialize()
    console.log(getCliboardData())
}
// 앱이 준비되었을 때 실행될 함수
function startBackgroundTask() {
  // 하루의 밀리초 단위 시간
  const oneDay = 24 * 60 * 60 * 1000;

  // 첫 실행을 오늘 자정으로 설정
  const now = new Date();
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const initialDelay = nextMidnight.getTime() - now.getTime();

  // 하루마다 특정 함수 실행
  setInterval(() => {
    deleteExpiredData(clipbaord_period)
  }, oneDay, initialDelay);
}
app.setLoginItemSettings({
    openAtLogin: true,
});
app.on("ready", async () => { 
    db = createDatabase(path.join(app.getPath("userData"), "./database.db"));
    await initialize()
    await createWindow() 
});


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
    win.webContents.send("return-clipboard", getCliboardData());
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
ipcMain.on("remove-clipboard", async (event, data) => {
    console.log(`Received [${data}] from renderer browser`);
    await deleteData(db, data)
    win.webContents.send("receive-data", getCliboardData());
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
ipcMain.on("next-clicked", async (event, data) => {
    console.log(`Received [${data}] from renderer browser`);
    await getNextData(db)
    win.webContents.send("receive-data", getCliboardData());
    
});
ipcMain.on("pre-clicked", async (event, data) => {
    console.log(`Received [${data}] from renderer browser`);
    await getPreviousData(db)
    win.webContents.send("receive-data", getCliboardData());
});
// ok db 10개씩 가져오기 next pre 버튼 으로 data 가져오기, 10개 메인에서 가져오는 거는 됐으니까 clipboard에서 가져오기 pre, next도 반영 그리고 삭제 했을 때 땡겨지기, 뒤로 가져오기
// ok 날짜 표시 하는데 같은 날까지 묶어서 
// ok 붙여넣기 할 때 칸 띄워지는거 수정하기
// 리스트안에 버튼있어서 삭제, 저장
// 도움말
// ok 스크롤 내려도 toolbar 유지
// 첫시작하면 도움말  화면