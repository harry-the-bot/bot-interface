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
                var socket = io(config.serverAddress);
                resolve([socket,config,loadingScreen,botInterface,errorScreen]);
            });
        });

    }


    botInterface.css('display','none');
    loadingScreen.css('display', 'none')

    setTimeout( () => {
        loadingScreen.fadeIn('slow', () => {
            getConfig()
                .then(bootstrap)
                .then(startHarry)
        });

    }, 500);

})
