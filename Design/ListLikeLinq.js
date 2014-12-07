function ListLikeLinq(_obj) {
    if ((!(_obj === null)) && (!(_obj === undefined)) && typeof (_obj) === "object") {
        for (var i = 0, length = Object.keys(_obj) ; i < length; i++) {
            this[0] = _obj[Object.keys(_obj)]//执行非严格校验, 这个并不是一个很重要的设计问题, {x:1,y:2} 和 [1,2] 都会变成一个ListLikeLinq[0] == 1,ListLikeLinq[1] == 2, 即忽略了所有的key变为当前索引
        }
        return this;
    }
    throw "invalid input value";
}