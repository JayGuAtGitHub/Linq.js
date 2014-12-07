function ObjectLikeLinqWithAutoDeep(_obj) {//和ObjectLikeLinq一样, 只不过一旦我发现内部也存在对象或者数组我也会将其转化为Linq类型而不是放在原处
    //BTW, 这个方式就是我目前的设计方式
    if ((!(_obj === null)) && (!(_obj === undefined)) && typeof (_obj) === "object") {
        for (var i = 0 ; i < Object.keys(_obj).length ; i++) {
            if (typeof (_obj[Object.keys(_obj)[i]]) === "object") {
                this[Object.keys(_obj)[i]] = new _QueryableObject(_obj[Object.keys(_obj)[i]]);
            }
            else {
                this[Object.keys(_obj)[i]] = _obj[Object.keys(_obj)[i]];
            }
        }
        return this;
    }
    return _obj;
}