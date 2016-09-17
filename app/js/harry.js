var botSocket = null;
var config = null;
var botInterface = null;
var loadingScreen = null;
var userVideo = null;
var botVideo = null;

function startHarry(params){
    botSocket = params[0];
    config = params[1];
    loadingScreen = params[2];
    botInterface = params[3];
    errorScreen = params[4];

    //Connection attempt
    botSocket.emit('bot-hello',config.botId);

    //Bot connected successfully and got a room
    botSocket.on('server-room-created-successfully', () => {
        loadingScreen.up(100).then( () => {
            setTimeout( () => {
                loadingScreen.fadeOut('slow', () => {
                    botInterface.fadeIn('slow',() => {
                        manageRoom();
                    });
                });
            },500)
        });

    })


    //There's already some bot using this id
    botSocket.on('server-cant-create-room', () => {
        function tryAgain(e){

            e.preventDefault();
            errorScreen.fadeOut('slow', () => {
                loadingScreen.fadeIn('slow');
                setTimeout(() => {
                    startHarry(params);
                },1000)
            });
        }

        errorScreen.show("Não foi possível criar um link de conversação!",
                         "Verifique se um robô com este ID já não está conectado ao servidor",
                         [
                             {
                                 text: "Tentar novamente",
                                 type: "good",
                                 action: (e) => tryAgain
                             }
                        ]);
    })
}

function manageRoom(){
    userVideo = $('#videos #user-cam');
    botVideo = $('#videos #bot-cam');

    
}
