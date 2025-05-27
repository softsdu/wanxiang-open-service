function getBasePath(){
    let protocol = window.location.protocol;
    let host = window.location.host;
    return protocol + "//" + host + "/" + cookiePath;
}

let basePath = getBasePath();