function DictionaryLikeLinq(_obj) {
    if ((!(_obj === null)) && (!(_obj === undefined)) && typeof (_obj) === "object") {

        if (arr.constructor == Array) {
            for (var i = 0, length = Object.keys(_obj) ; i < length; i++) {
                this[0] = _obj[Object.keys(_obj)]//如果是数组, 那么变为一个数组
            }
            return this;
        }
        //如果是一个Object变为一个数组字典即[{Key:,Value},{Key:,Value}]
        for (var i = 0, length = Object.keys(_obj) ; i < length; i++) {
            this[0] = {Key:[Object.keys(_obj)],Value:_obj[Object.keys(_obj)]}//如果是数组, 那么变为一个数组
        }
        return this;
    }
    throw "invalid input value";
}