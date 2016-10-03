function BotCall(){

    var botId;
    var peerConnection;

    this.setBotId = function(_botId){
        botId = _botId;
        return this;
    }

    this.getBotId = function(){
        return botId;
    }

    this.getPeerConnection = function(){
        return peerConnection;
    }

    this.createPeerConnection = function(){
        peerConnection = new RTCPeerConnection(null);
        peerConnection.onicecandidate = handleIceCandidate.bind(this);
        peerConnection.onaddstream = handleRemoteStreamAdded.bind(this);
        peerConnection.onremovestream = handleRemoteStreamRemoved.bind(this);

        return this;
    }

    /*************************************************************************
     *                  ICE Candidate Handlers
     ************************************************************************/

    function handleIceCandidate(event){
        console.log("Handling");
        if(event.candidate){
            console.info("Sending ice candidate");
            this.getSocket().emit('ice-candidate', {
                id: event.candidate.sdpMid,
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                candidate: event.candidate.candidate
            });
        }else{
            console.info("End of candidates");
        }
    }

    function handleRemoteStreamAdded(event){
        console.info("User is sending video to us!");
        this.getRemoteVideo().src = window.URL.createObjectURL(event.stream);
        this.setRemoteStream(event.stream);
    }

    function handleRemoteStreamRemoved(event){
        console.warn("remoteStream removed ",event);
    }

     /*************************************************************************
      *            PeerConnection.createOfffer Handlers
      ************************************************************************/
    function emitSessionDescription(sessionDescription){
        console.info("Emitting session description", sessionDescription)
        this.getPeerConnection().setLocalDescription(sessionDescription);
        this.getSocket().emit('bot-created-offer',sessionDescription);
    }

    function handleCreateOfferError(event){
        console.warn('Failed while creating offer: ', event);
    }

    /*************************************************************************
     *                  Socket.IO Events
     ************************************************************************/
    /**
    *   Handles "server-room-created-successfully" event from server,
    *   fired when "bot-hello" creates successfully a new room
    */
    this.handleRoomCreated = function(){
        console.info("Server said hello");
    }

    /**
    *   Handles "server-cant-create-room" event from server,
    *   fired when "bot-hello" fails while creating a new room
    */
    this.handleRoomNotCreated = function(err){
        console.info("Server said fuck you (respectfully)",err);
    }

    /**
    *   Handles "user-joined" event from server,
    *   fired when some user connects  our room
    */
    this.handleUserJoined = function(){
        console.info("There's an user between us");

        try{
            this.createPeerConnection();
            var peerConnection = this.getPeerConnection();
            peerConnection.addStream( this.getLocalStream() );
            peerConnection.createOffer( emitSessionDescription.bind(this),
                                        handleCreateOfferError );

        }catch(e){
            console.warn("Failed to create peerConnection!",e)
        }

    }

    /**
    *   Handles "user-answered-offer" event from server,
    *   fired when user answers bot's offer
    */
    this.handleUserAnswered = function(answer){
        console.log("answered")
        var description = new RTCSessionDescription(answer);
        this.getPeerConnection().setRemoteDescription(description);
    }

    /**
    *   Handles "ice-candidate" event from server
    */
    this.handleIceCandidate = function(iceCandidate){
        console.info("got candidate");

        var candidate = new RTCIceCandidate({
            sdpMLineIndex: iceCandidate.label,
            candidate: iceCandidate.candidate
        })

        this.getPeerConnection().addIceCandidate(candidate, () => {
            console.log("Add peer");
        }, (e) => {
            console.warn("Failed to add peer",e)
        });

    }
}

BotCall.prototype = new Call();

/**
* Bind socket.io events
*/
BotCall.prototype.startListening = function(){
    var socket = this.__proto__.getSocket();

    /*
        If we don't bind "this" to our handlers, our method will understand that
        it's context is "Socket" instead of "BotCall"
    */
    socket.on('server-room-created-successfully', this.handleRoomCreated.bind(this));
    socket.on('server-cant-create-room', this.handleRoomNotCreated.bind(this));
    socket.on('user-joined', this.handleUserJoined.bind(this));
    socket.on('user-answered-offer', this.handleUserAnswered.bind(this));
    socket.on('ice-candidate', this.handleIceCandidate.bind(this));
    socket.on('move', (direction) => {
        console.log("Need to move",direction);
        //maybe should send sync?
        ipcRenderer.send('move', direction);
    });
}

/**
* Tells server that this is a bot client
*/
BotCall.prototype.startCommunicating = function() {
    this.__proto__.getSocket().emit('bot-hello',this.getBotId());
}
