function urlJoin(url,path){
    if(url[url.length -1] === '/')
        url = url.substring(0,url.length-2);

    if(path[0] === '/')
        path = path.substring(1,path.length);

    return url + "/" + path;
}
