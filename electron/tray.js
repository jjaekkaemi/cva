const { Menu, Tray } = require("electron");
const { getData, getCliboardData} = require("./database.js");
const {clipboardUpdate} = require("./clipboard.js")
const Store = require("electron-store");
const store = new Store();
let tray = null;
let db = null;
let clipbaord_period = 30
function getClipbaordPeriod() {
    return clipbaord_period
}
function initTrayIconMenu(w, d, app, location, shortcut) {
    db = d;
    tray = new Tray(location);
    console.log(shortcut)
    clipbaord_period = store.get("clibpard-period");
    if(clipbaord_period){
        clipbaord_period = Number(clipbaord_period)
    }
    else{
        clipbaord_period = 30
        store.set("clibpard-period", "30");
    }
    // returnShrotcut(["Shift+V","Tab+V" ], shortcut)
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "open",
            type: "normal",
            checked: true,
            click: async () => {
                
                // w.webContents.send("open-main", await getData(db));
                w.webContents.send("open-main", getCliboardData())
                w.show();
                w.setAlwaysOnTop(false)
            },
        },
        {
            label: "shortcut",
            submenu:[
                {label: "Shift+V",type:'radio', checked:"Shift+V"===shortcut, click: () => {
                    clipboardUpdate("Shift+V")
                }},
                {label: "Ctrl+Shift+V",type:'radio', checked:"Ctrl+Shift+V"===shortcut, click: () => {
                    clipboardUpdate("Ctrl+Shift+V")
                }},
                
            ],
        },
        {
            label: "period",
            submenu:[
                {label: "30days",type:'radio', checked:clipbaord_period===30, click: () => {
                    if (store.get("clibpard-period")) {
                        store.delete('clibpard-period');
                    }
                    store.set("clibpard-period", "30");
                    clipbaord_period = 30
                }},
                {label: "60days",type:'radio', checked:clipbaord_period===60, click: () => {
                    if (store.get("clibpard-period")) {
                        store.delete('clibpard-period');
                    }
                    store.set("clibpard-period", "60");
                    clipbaord_period = 60
                }},
                
            ],
        },        
        {
            label: "exit",
            type: "normal",
            click: () => {
                w.close();
            },
        },
    ]);
    tray.setToolTip("cva");
    tray.setContextMenu(contextMenu);
    tray.on("double-click", async () => {
        
        // w.webContents.send("open-main", await getData(db));
        // console.log(await getData(db))
        console.log(getCliboardData())
        w.webContents.send("open-main", getCliboardData())
        w.show();
        w.setAlwaysOnTop(false)
    });
}
function returnShrotcut(shortcutmenu, shortcut){
    let submenu = []
    for(var i in shortcutmenu){
        submenu.append({label: i,type:'radio', checked:i===shortcut, click: () => {
                    clipboardUpdate(i)
                }})
    }
    console.log(submenu)
}
module.exports = { initTrayIconMenu, getClipbaordPeriod };