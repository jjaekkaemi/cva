const { Menu, Tray } = require("electron");
const { getData, } = require("./database.js");
const {clipboardUpdate} = require("./clipboard.js")
let tray = null;
let db = null;
function initTrayIconMenu(w, d, app, location, shortcut) {
    db = d;
    tray = new Tray(location);
    console.log(shortcut)
    // returnShrotcut(["Shift+V","Tab+V" ], shortcut)
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "open",
            type: "normal",
            checked: true,
            click: async () => {
                w.setFocusable(true)
                w.webContents.send("open-main", await getData(db));
                w.show();
            },
        },
        {
            label: "shortcut",
            submenu:[
                {label: "Shift+V",type:'radio', checked:"Shift+V"===shortcut, click: () => {
                    clipboardUpdate("Shift+V")
                }},
                {label: "Tab+V",type:'radio', checked:"Tab+V"===shortcut, click: () => {
                    clipboardUpdate("Tab+V")
                }}
            ],
            click: async () => {
                w.setFocusable(true)
                w.webContents.send("open-main", await getData(db));
                w.show();
            },
        },
        {
            label: "exit",
            type: "normal",
            click: () => {
                console.log("2번클릭!");
                w.close();
            },
        },
    ]);
    tray.setToolTip("cva");
    tray.setContextMenu(contextMenu);
    tray.on("double-click", async () => {
        w.setFocusable(true)
        w.webContents.send("open-main", await getData(db));
        w.show();
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
module.exports = { initTrayIconMenu };