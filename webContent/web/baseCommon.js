function getBasePath(){
    let protocol = window.location.protocol;
    let host = window.location.host;
    return protocol + "//" + host + "/" + cookiePath;
}

let basePath = getBasePath();
let platformPath = basePath + "/platform";
let baseImagesPath = basePath + "/images";
let jqueryPath = platformPath + "/jquery";
let basejsPath = platformPath + "/base";
let expressionjsPath = platformPath + "/expression";
let pagePath = basePath + "/web";
let cssPath = basePath + "/css";
let imagesPath = basePath + "/images";
let pluginsPath = platformPath + "/plugins";
let componentsPath = pluginsPath + "/components";
let uploadifyPath = componentsPath +"/accessory";


function loadCSS(url, callback) {
    // 创建一个新的 <link> 元素
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;

    // 设置 onload 事件处理器
    link.onload = function() {
        if (typeof callback === 'function') {
            callback(); // 样式表加载完成后执行回调函数
        }
    };

    // 设置 onerror 事件处理器
    link.onerror = function() {
        console.error('Failed to load stylesheet at ' + url);
    };

    // 获取 <head> 元素，并将 <link> 元素添加到 <head> 中
    let head = document.getElementsByTagName('head')[0];
    head.appendChild(link);
}
function loadScript(url, callback) {
    // 创建一个新的 <script> 元素
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // 设置 onload 事件处理器
    script.onload = function() {
        if (typeof callback === 'function') {
            callback(); // 脚本加载完成后执行回调函数
        }
    };

    // 设置 onerror 事件处理器
    script.onerror = function() {
        console.error('Failed to load script at ' + url);
    };

    // 将 <script> 元素添加到 <head> 中
    let head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
}
function loadMultipleScripts(scripts, callback) {
    var loadedScriptCount = 0;
    var totalScriptCount = scripts.length;

    // 加载单个脚本并记录加载状态
    function loadScriptWithTracking(url) {
        loadScript(url, function() {
            loadedScriptCount++;
            console.log('Loaded: ' + url);
            if (loadedScriptCount === totalScriptCount && callback) {
                callback();
            }
        });
    }

    // 遍历所有脚本 URL 并加载它们
    for (let i = 0; i < totalScriptCount; i++) {
        loadScriptWithTracking(scripts[i]);
    }
}

function loadMultipleCsss(cssFiles, callback) {
    var loadedCssCount = 0;
    var totalCssCount = cssFiles.length;

    function loadCssWithTracking(url) {
        loadCSS(url, function() {
            loadedCssCount++;
            console.log('Loaded: ' + url);
            if (loadedCssCount === totalCssCount && callback) {
                callback();
            }
        });
    }

    for (let i = 0; i < totalCssCount; i++) {
        loadCssWithTracking(cssFiles[i]);
    }
}

let loadBaseFiles = function (callback){
    let scriptFileArray = [
        jqueryPath + "/jquery.min.js?t=" + projectVersion,
        jqueryPath + "/bootstrap.min.js?t=" + projectVersion,
        basejsPath + "/json.js?t=" + projectVersion,
        basejsPath + "/common.js?t=" + projectVersion,
        basejsPath + "/hashtable.js?t=" + projectVersion,
        jqueryPath + "/myDatepicker.js?t=" + projectVersion,
        expressionjsPath + "/functionList.js?t=" + projectVersion,
        expressionjsPath + "/expressionRunner.js?t=" + projectVersion,
        expressionjsPath + "/expCommon.js?t=" + projectVersion,
        expressionjsPath + "/expMath.js?t=" + projectVersion,
        basejsPath + "/static.js?t=" + projectVersion,
        jqueryPath + "/jquery.jqGrid.min.js?t=" + projectVersion,
    ];
    let cssFileArray = [
        jqueryPath + "/bootstrap.min.css?t=" + projectVersion,
        jqueryPath + "/bootstrap-theme.min.css?t=" + projectVersion,
        cssPath + "/common.css?t=" + projectVersion,
    ];
    loadMultipleScripts(scriptFileArray, callback);
    loadMultipleCsss(cssFileArray);
}