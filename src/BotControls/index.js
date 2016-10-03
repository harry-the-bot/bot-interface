function BotControls(ipcMain,arduinoInterface){

    this.getIpcMain = function(){
        return ipcMain;
    }

    this.getArduinoInterface = function(){
        return arduinoInterface;
    }

}

BotControls.prototype.move = function(direction,speed){

    this.getArduinoInterface().send('M'+direction.toUpperCase()+";")

}

module.exports = BotControls;
