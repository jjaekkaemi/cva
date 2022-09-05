'use strict';

const BrowserWindow = require("electron").remote();

function close() {
    var window = BrowserWindow.getCurrentWindow();
    window.close();
}