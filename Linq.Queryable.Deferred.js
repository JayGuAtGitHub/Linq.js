Linq = function (obj) {
    return new Linq(obj);
}

function _Linq(obj) {

    if ((!(obj === null)) && (!(obj === undefined)) && typeof (obj) === "object") {
        for (var i = 0, length = Object.keys(obj).length ; i < length ; i++) {
            this[i] = obj[i];
        }
        return this;
    }
    throw "crash at init, unknown input value";
}

_Linq.prototype = {
    constructor: _Linq
}