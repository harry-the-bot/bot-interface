var botSocket = null;
var config = null;
var botInterface = null;
var loadingScreen = null;
var userVideo = null;
var botVideo = null;
var botVideoStream = null;
var peerConnection = null;

function startHarry(params){
    config = params[0];
    botSocket = params[1];
    loadingScreen = params[2];
    botInterface = params[3];
    errorScreen = params[4];
    userVideo = createVideo($('#videos #user-cam'));
    botVideo = createVideo($('#videos #bot-cam'));

    loadingScreen.up(100).then( () => {
        setTimeout( () => {
            loadingScreen.fadeOut('slow', () => {
                botInterface.fadeIn('slow',() => {
                    go();
                });
            });
        },500)
    });



}


function go(){
    var call = new BotCall();
    call.setSocket(botSocket);
    call.setRemoteVideo(document.getElementById('user-cam'));
    call.setLocalVideo(document.getElementById('bot-cam'));
    call.setBotId(1);
    var prepareSucceed = botVideoIsEnabled.bind(this,call);
    call.prepare()
        .then( prepareSucceed , () => {
            console.log("nop");
        });
}
function botVideoIsEnabled(call){
    console.info("Video is enabled");
    call.startListening();
    call.startCommunicating();
}
