var botSocket = null;
var config = null;
var botInterface = null;
var loadingScreen = null;
var userVideo = null;
var botVideo = null;
var botVideoStream = null;

function startHarry(params){
    botSocket = params[0];
    config = params[1];
    loadingScreen = params[2];
    botInterface = params[3];
    errorScreen = params[4];
    userVideo = createVideo($('#videos #user-cam'));
    botVideo = createVideo($('#videos #bot-cam'));

    turnBotVideoOn(botVideo);

}

function turnBotVideoOn(videoObject){

    //$('[selector]')[0] returns the same as document.getElementById(...)
    var obj = videoObject instanceof $ ? videoObject[0] : videoObject;

    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    }).then( (stream) => {
        console.log("Got stream",videoObject);
        obj.src = window.URL.createObjectURL(stream);
        botVideoStream = stream;
    })
}
