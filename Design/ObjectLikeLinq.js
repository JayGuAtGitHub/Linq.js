function ObjectLikeLinq(_obj) {
    if ((!(_obj === null)) && (!(_obj === undefined)) && typeof (_obj) === "object") {
        for (var i = 0, length = Object.keys(_obj) ; i < length; i++) {
            this[Object.keys(_obj)] = _obj[Object.keys(_obj)]
        }
        return this;
    }
    throw "invalid input value";
}