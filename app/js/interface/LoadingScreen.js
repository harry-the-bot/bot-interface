function createLoadingScreen(object){

    object.up = (amount) => {

        var content = object.find('.progress-bar-content')
        var width = parseInt(content.css('width'));

        var newWidth = (width + amount);
        newWidth = newWidth > 100 ? 100 : newWidth;

        return new Promise( (resolve,reject) => {
            content.animate({
                'width': newWidth + "%"
            },500, resolve);
        })

    }

    object.reset = () => {

        var content = object.find('.progress-bar-content')

        content.css('width','0px');

    }

    return object;
}
