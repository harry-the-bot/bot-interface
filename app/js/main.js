$(document).ready( ($) => {

    var loadingScreen = createLoadingScreen($('#loader'));
    var botInterface = $('#interface');
    var errorScreen = createErrorScreen($('#load-error'),loadingScreen,botInterface);


    function getConfig(){
        return new Promise( (resolve,reject) => {
            resolve({
                botId: 1,
                serverAddress: 'http://localhost:8082'
            })
        });
    }

    function loadSocketIO(serverAddress){
        return new Promise ( (resolve,reject) => {
            var script = document.createElement('script');
            var url = urlJoin(serverAddress,'/socket.io/socket.io.js');
            $.getScript(url)
                .done( () => {
                    resolve();
                });
        });
    }

    function bootstrap(config){
        return new Promise( (resolve,reject) => {
            loadSocketIO(config.serverAddress).then( () => {
                loadingScreen.up(10);
                var botSocket = io(config.serverAddress);

                resolve([config,botSocket]);

            });
        });

    }

    function handleConnectionSuccess(resolve,reject){
        loadingScreen.up(100).then( () => {
            setTimeout( () => {
                loadingScreen.fadeOut('slow', () => {
                    botInterface.fadeIn('slow',() => {
                        resolve([botSocket,
                                 config,
                                 loadingScreen,
                                 botInterface,
                                 errorScreen
                             ]);
                    });
                });
            },500)
        });

    }

    function handleConnectionError(resolve,reject,params){
        //Button event
        function tryAgain(e){
            alert("try!");
            e.preventDefault();
            errorScreen.fadeOut('slow', () => {
                loadingScreen.fadeIn('slow');
                setTimeout(() => {
                    connect(params,false);
                },1000)
            });
        }

        var errorTitle = "Não foi possível criar um link de conversação!";
        var errorCause = "Verifique se um robô com este ID já não está conectado ao servidor";
        var buttonArray = [
            {
                text: "Tentar novamente",
                type: "good",
                action: tryAgain
            }
        ]
        errorScreen.show(errorTitle,errorCause,buttonArray);
    }

    function connect(params,isFirstAttempt){

        isFirstAttempt = typeof isFirstAttempt === 'undefined' ? true : isFirstAttempt;

        var config = params[0];
        var botSocket = params[1];

        return new Promise( (resolve, reject) => {
            var success = handleConnectionSuccess.bind(this,resolve,reject);
            var failure = handleConnectionError.bind(this,resolve,reject,params);

            //Connection attempt
            botSocket.emit('bot-hello',config.botId);

            //Register events just once
            if(!isFirstAttempt)
                return;

            //Bot connected successfully and got a room
            botSocket.on('server-room-created-successfully', success);

            //There's already some bot using this id
            botSocket.on('server-cant-create-room', failure)
        })


    }
    botInterface.css('display','none');
    loadingScreen.css('display', 'none')

    setTimeout( () => {
        loadingScreen.fadeIn('slow', () => {
            getConfig()
                .then(bootstrap)
                .then(connect)
                .then(startHarry)
        });

    }, 500);

})
