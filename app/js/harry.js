var botSocket = null;
var config = null;
var botInterface = null;
var loadingScreen = null;
var userVideo = null;
var botVideo = null;
var botVideoStream = null;
var peerConnection = null;

var pcConfig = {
  'iceServers': [{
    'url': 'stun:stun.l.google.com:19302'
  }]
};

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
    enumerateDevices();


}

function enumerateDevices(stream) {
    MediaStreamTrack.getSources(function (data) {
        for (var i = 0; i < data.length; i++) {
            var label;
            if (data[i].kind === "audio") {
                label = data[i].label.length > 0 ? data[i].label : "Audio Device";
                $("#audio-devices").append($("<option>", { value: data[i].id }).text(label));
            }
        }
    });
}

function askForAudioInput(){
    return new Promise( (resolve,reject) => {
        $('#config').fadeIn('fast');
        $('#selected-audio').on('click', (e) => {
            e.preventDefault();
            $('#config').fadeOut('fast');
            var ddlAudio = $("#audio-devices").get(0);
            var selected = ddlAudio.options[ddlAudio.selectedIndex].value;
            resolve(selected);
        })
    })
}

function go(){
    var pcConfig = {
      'iceServers': [{
        'url': 'stun:stun.l.google.com:19302'
      }]
    };
    requestTurn("https://computeengineondemand.appspot.com/turn?username=qaasd34234&key=asdjkagbdasghdwy34r3",pcConfig)
        .then( (config) => {

            var call = new BotCall(config);
            call.setSocket(botSocket);
            call.setRemoteVideo(document.getElementById('user-cam'));
            call.setLocalVideo(document.getElementById('bot-cam'));
            call.setBotId(1);
            var prepareSucceed = botVideoIsEnabled.bind(this,call);
            askForAudioInput()
                .then( (audioDevice) => {

                    console.log("Audio device is " + audioDevice)
                    call.prepare(audioDevice)
                        .then( prepareSucceed , () => {
                            console.log("nop");
                        });
                })

        });


}
function botVideoIsEnabled(call){
    console.info("Video is enabled");
    call.startListening();
    call.startCommunicating();
}

function requestTurn(turnURL, pcConfig) {
    return new Promise( (resolve,reject) => {

        var turnExists = false;
        for (var i in pcConfig.iceServers) {
            if (pcConfig.iceServers[i].url.substr(0, 5) === 'turn:') {
                turnExists = true;
                break;
            }
        }

        if (!turnExists) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var turnServer = JSON.parse(xhr.responseText);
                    console.log('Got TURN server: ', turnServer);
                    pcConfig.iceServers.push({
                        'url': 'turn:' + turnServer.username + '@' + turnServer.turn,
                        'credential': turnServer.password
                    });
                }
                resolve(pcConfig);
            };

            xhr.open('GET', turnURL, true);
            xhr.send();
        }
    })//Promise
}
