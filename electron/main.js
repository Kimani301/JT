// JIMMY TECH - Windows desktop shell. Loads the single-file app from www/index.html.
const { app, BrowserWindow, Menu, shell } = require("electron");
const path = require("path");

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

let win = null;
const isExternal = (u) => /^(https?|tel|sms|mailto):/i.test(u);

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 380,
    minHeight: 600,
    show: false,
    backgroundColor: "#12395c",
    title: "JIMMY TECH",
    icon: path.join(__dirname, "..", "build", "icon.png"),
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false
    }
  });

  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, "..", "www", "index.html"));
  win.once("ready-to-show", () => {
    win.maximize();
    win.show();
  });

  // WhatsApp / phone / SMS links open outside the app; the app window never navigates away.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (isExternal(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  win.webContents.on("will-navigate", (event, url) => {
    if (url !== win.webContents.getURL()) {
      event.preventDefault();
      if (isExternal(url)) shell.openExternal(url);
    }
  });
  win.on("closed", () => { win = null; });
}

app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.whenReady().then(createWindow);
app.on("window-all-closed", () => app.quit());
