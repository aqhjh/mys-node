
const config = require('./config.json');
const fs = require('fs');

var routePathMap = {
}
function routeMap (path, callback) {
    var patharr = path.split('/').slice(1);
    var pathMap = routePathMap;
    if (patharr && patharr.length > 0 && patharr[0] !== '') {
        for (let i = 0; i < patharr.length; i++) {
            if (patharr[i].indexOf(':') !== -1) {
                pathMap = pathMap['_globalRegPath'] = {
                    value: `/${patharr[i].slice(1)}/`,
                    isEnd: false
                };
            } else if (patharr[0] === config.static){
                pathMap.isEnd = true;
                pathMap.value = callback;
                break;
            } else {
                pathMap = pathMap[patharr[i]] = {
                    value: '',
                    isEnd: false
                };
            }
            if (i === (patharr.length - 1)) {
                pathMap.isEnd = true;
                pathMap.value = callback;
            }
        }
    } else {
        pathMap['index'] = {
            isEnd: true,
            value: callback
        };
    }
}
function matchRouter (path, req, res) {
    var patharr = path.split('/').slice(1);
    var callback = [];
    var tempPath = routePathMap;
    var regStr = null;
    if (patharr && patharr.length > 0 && patharr[0] !== '') {
        for (let i = 0; i < patharr.length; i++) {
            tempPath = routePathMap[patharr[i]];
            debugger;
            if (!tempPath) {
                reg = new RegExp(tempPath._globalRegPath.value);
                if (reg.test(patharr)) {
                    tempPath = tempPath._globalRegPath;
                } else {
                    break;
                }
            }
            if (tempPath.isEnd) {
                callback.push(tempPath.value);
            }
        }
    } else if (patharr[0] === config.static) {
        callback.push(tempPath['static'].value);
    } else {
        callback.push(tempPath['index'].value);
    }
    if (callback.length > 0) {
        for (var i = 0; i < callback.length; i++) {
            callback[i](req, res);
        }
    }
}

function parseQuery (url) {
    let query = {};
    const queryPath = url.split('?')[1];
    const arr = queryPath.split('&');
    let tempArr = null;
    for (let i = 0; i < arr.length; i++) {
        tempArr = arr.split('&');
        query[tempArr[0]] = tempArr[1];
    }
    return query;

}

exports.router = {
    register: (path, callback) => {
        routeMap(path, callback);
    },
    use: (req, res) => {
        matchRouter(req.url, req, res);
    },
    setView: (static) => {
        config.static = static;
        fs.writeFileSync('./config.json', config);
    }
};
