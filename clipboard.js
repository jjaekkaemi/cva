const clipboard = require("./copy.js");
const { globalShortcut } = require("electron");
const { listText, addText } = require("./database.js")

const Store = require("electron-store");
const store = new Store();
let win = null;
let db = null;
clipboard
    .on("text-changed", () => {
        let currentText = clipboard.readText().replace(/\'/g, "''");
        addText(db, currentText, new Date());
        console.log(currentText);
    })
    .once("text-changed", () => {
        console.log("TRIGGERED ONLY ONCE");
    })
    .on("image-changed", () => {
        let currentIMage = clipboard.readImage();
        console.log(currentIMage);
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
}
async function clipboardCallback() {
    win.webContents.send("open-clipboard", await listText(db));

    win.show()
    win.setAlwaysOnTop(true)
    win.setFocusable(false)

}
function clipboardUpdate(shortcut, newshortcut) {
    globalShortcut.unregisterAll();

    if (store.get("clipboardopen")) {
        store.delete('clipboardopen');
    }
    globalShortcut.register(newshortcut, clipboardCallback);
    store.set("clipboardopen", newshortcut);
}
module.exports = { clipboard, clipboardUpdate, clipboardinit };
