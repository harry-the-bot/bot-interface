function createErrorScreen(object, loadingScreen, botInterface){

    function hideBotInterface(){
        return new Promise( (resolve,reject) => {
            botInterface.fadeOut('slow',resolve);
        });
    }

    function hideLoadingScreen(){
        return new Promise( (resolve,reject) => {
            loadingScreen.fadeOut('slow',resolve);
        });
    }

    function hideAll(){
        return new Promise( (resolve, reject) => {
            Promise.all([
                hideBotInterface(),
                hideLoadingScreen()
            ]).then(resolve);
        });
    }

    object.show = function(error,cause,buttons){
        var titleElement = object.find('.error-name span');
        var causeElement = object.find('.error-cause span');
        titleElement.text(error);
        causeElement.html(cause);
        object.find('button').remove();
        buttons.forEach( (button) => {
            var element = $('<button>');

            element.addClass(button.type);
            element.html(button.text);
            element.on('click',button.action);

            element.appendTo(object.find('.button-holder'));
        })

        hideAll().then( () => {
            object.fadeIn('slow', () => {
            })
        })

    }


    return object;

}
