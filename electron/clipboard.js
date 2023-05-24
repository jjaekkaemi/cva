const clipboard = require("./copy.js");
const { globalShortcut } = require("electron");
const {  addData, getData } = require("./database.js")
const Store = require("electron-store");
const store = new Store();
let win = null;
let db = null;

clipboard
    .on("text-changed", () => {
        let currentText = clipboard.readText().replaceAll(/\'/g, "''").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
        addData(db, 0, currentText, new Date());
        console.log(currentText);
    })
    .once("text-changed", () => {
        console.log("TRIGGERED ONLY ONCE");
    })
    .on("image-changed", async () => {
        
        const currentIMage = clipboard.readImage();
        addData(db, 1, currentIMage.toDataURL(), new Date());
    })
    .startWatching();

async function clipboardinit(w, d) {
    win = w;
    db = d;
    let clipboardopen = store.get("clipboardopen");
    if (clipboardopen) {
        globalShortcut.register(
            store.get("clipboardopen"),
            await clipboardCallback
        );
    } else {
        store.set("clipboardopen", "Shift+V");
        globalShortcut.register("Shift+V", await clipboardCallback);
    }
    return store.get("clipboardopen")
}
async function clipboardCallback() {
    win.webContents.send("open-clipboard", await getData(db));
    win.show()
    
    win.setAlwaysOnTop(true)
    win.setFocusable(false)
}
function clipboardUpdate(newshortcut) {
    console.log(newshortcut)
    globalShortcut.unregisterAll();

    if (store.get("clipboardopen")) {
        store.delete('clipboardopen');
    }
    globalShortcut.register(newshortcut, clipboardCallback);
    store.set("clipboardopen", newshortcut);

    win.webContents.send("update-shortcut", store.get("clipboardopen"))

}
module.exports = { clipboard, clipboardUpdate, clipboardinit };
