var botSocket = null;
var config = null;
var botInterface = null;
var loadingScreen = null;
function startHarry(params){
    botSocket = params[0];
    config = params[1];
    loadingScreen = params[2];
    botInterface = params[3];

    botSocket.emit('bot-hello',config.botId);
    botSocket.on('server-room-created-successfully', () => {
        loadingScreen.up(100).then( () => {
            setTimeout( () => {
                loadingScreen.fadeOut('slow', () => {
                    botInterface.fadeIn('slow');
                });
            },500)
        });

    })
}

function manageRoom(){

}
