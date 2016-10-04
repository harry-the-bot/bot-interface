const {app, BrowserWindow, ipcMain} = require('electron')
const BotControls = require('./src/BotControls');
/*
const arduinoInterface = require('./src/Arduino');

console.log(arduinoInterface);

arduinoInterface.setPortName("COM3");
arduinoInterface.addListener( function(data) {
    console.log("ARDUINO SAID -> " + data);
})
arduinoInterface.start();*/

const botControls = new BotControls(ipcMain,null);

// Avoid garbage collector to close our window. Bad, baad garbage collector ò.ó
let win;

function createWindow () {

  win = new BrowserWindow({width: 800, height: 600})
  win.loadURL(`file://${__dirname}/index.html`)

  // Close click, alt + f4 or program call
  win.on('closed', () => {
    win = null
  })
}

// Electron is ready
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('move', (event, direction)=> {
    console.log("Asking arduino to move",direction);
    //botControls.move(direction.direction,direction.speed);

});
