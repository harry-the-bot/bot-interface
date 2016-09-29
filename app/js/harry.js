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
    turnBotVideoOn(botSocket,botVideo);
}

function createP2PEvents(socket){
    socket.on('user-joined', () => {
        console.log("User joined!");
    });

    socket.on('user-description', (description) => {
        console.log('got user description',description)
        peerConnection.setRemoteDescription(new RTCSessionDescription(description));
    })

    socket.on('ice-candidate', (candidate) => {
        console.log('got ice candidate',candidate);
        var newCandidate = new RTCIceCandidate({
            sdpMLineIndex: message.label,
            candidate: message.candidate
        });
        peerConnection.addIceCandidate(newCandidate);
    })
}

function turnBotVideoOn(socket,videoObject){

    //$('[selector]')[0] returns the same as document.getElementById(...)
    var obj = videoObject instanceof $ ? videoObject[0] : videoObject;

    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    }).then( (stream) => {
        obj.src = window.URL.createObjectURL(stream);
        botVideoStream = stream;

        peerConnection = createPeerConnection();

        peerConnection.addStream(botVideoStream);
        waitForNewConnection(socket);
        createP2PEvents(socket);
    })
}

function waitForNewConnection(socket){

    var localSetter = setLocal.bind(this,socket);
    peerConnection.createOffer(localSetter, (event) => {
        console.log('createOffer() error: ', event);
    });
}

function setLocal(socket, sessionDescription){
    console.log("Created offer");

    peerConnection.setLocalDescription(sessionDescription);
    socket.emit('bot-description',sessionDescription);
    //emitMessage(sessionDescription);
}

function emitMessage(message){
    botSocket.emit('bot-message',message);
}
/********************* PEER CONNECTION *********************************/
function createPeerConnection(){
    try {
        var pc = new RTCPeerConnection(null);
        pc.onicecandidate = handleIceCandidate;
        pc.onaddstream = handleRemoteStreamAdded;
        pc.onremovestream = handleRemoteStreamRemoved;

        return pc;
    } catch (e) {
        console.log('Failed to create PeerConnection, exception: ' + e.message);
        return false;
    }
}

function handleIceCandidate(event){
    console.log('icecandidate event: ', event);
    if (event.candidate) {
        botSocket.emit('ice-candidate',{
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate
        });
    } else {
        console.log('End of candidates.');
    }
}

function handleRemoteStreamAdded(event) {
    console.log('Remote stream added.');
    userVideo.src = window.URL.createObjectURL(event.stream);
    userVideo = event.stream;
}

function handleRemoteStreamRemoved(event) {
  console.log('Remote stream removed. Event: ', event);
}

/********************* PEER CONNECTION *********************************/
