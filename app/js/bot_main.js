'use strict';

window.onload = () => {
    var call = new BotCall();
    var userSocket = io("http://192.168.0.101:8091");

    call.setSocket(userSocket);
    call.setRemoteVideo(document.getElementById('bot-video'));
    call.setLocalVideo(document.getElementById('user-video'));
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
