const { Menu, Tray } = require("electron");
const { listText } = require("./database.js");
let tray = null;
let db = null;
function initTrayIconMenu(w, d, app, location) {
    db = d;
    tray = new Tray(location);
    const myMenu = Menu.buildFromTemplate([
        {
            label: "1번",
            type: "normal",
            checked: true,
            click: () => {
                console.log("1번클릭!");
                w.show();
            },
        },
        {
            label: "종료",
            type: "normal",
            click: () => {
                console.log("2번클릭!");
                w.close();
            },
        },
    ]);
    tray.setToolTip("cva");
    tray.setContextMenu(myMenu);
    tray.on("double-click", async () => {
        console.log("double click!!");
        w.setFocusable(true)
        w.webContents.send("close-clipboard", await listText(db));
        w.show();
    });
}

module.exports = { initTrayIconMenu };
