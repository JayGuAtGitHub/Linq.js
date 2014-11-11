window.Linq.QueryableObject = function (obj) {
    return new _QueryableObject(obj);
}

function _QueryableObject(_obj) {

    if ((!(_obj === null)) || (!(_obj === undefined)) || typeof (_obj) === "object") {
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
_QueryableObject.prototype = {
    constructor: _QueryableObject
}

//Private functions

_QueryableObject.prototype.toArray = function () {
    var _result = [];
    for (var i = 0 ; i < Object.keys(this).length ; i++) {
        _result.push(this[Object.keys(this)[i]]);
    }
    return _result;
}

_QueryableObject.prototype.toObject = function () {
    var _result = {};
    for (var i = 0 ; i < Object.keys(this).length ; i++) {
        _result[Object.keys(this)[i]] = (this[Object.keys(this)[i]]);
    }
    return _result;
}

//Linq functions

_QueryableObject.prototype.Aggregate = function (arg1, arg2, arg3) {
    if (arg3) {
        var _result = arg3(arg1);

        for (var i = 0 ; i < Object.keys(this).length ; i++) {
            _result = arg2(_result, arg3(this[Object.keys(this)[i]]));
        }

        return _result;
    }
    if (arg2) {
        var _result = arg1;

        for (var i = 0 ; i < Object.keys(this).length ; i++) {
            _result = arg2(_result, this[Object.keys(this)[i]]);
        }

        return _result;
    }
    if (arg1) {
        if (Object.keys(this).length < 2) {
            return this;
        }
        var _result = this[Object.keys(this)[0]];

        for (var i = 1 ; i < Object.keys(this).length ; i++) {
            _result = arg1(_result, this[Object.keys(this)[i]]);
        }

        return _result;
    }
}

_QueryableObject.prototype.All = function (arg1) {
    if (arg1) {
        for (var i = 0 ; i < Object.keys(this).length ; i++) {
            if (arg1(this[Object.keys(this)[i]])) {
                return false;
            }
        }
        return true;
    }
}

_QueryableObject.prototype.Any = function (arg1) {
    if (arg1) {
        for (var i = 0 ; i < Object.keys(this).length ; i++) {
            if (arg1(this[Object.keys(this)[i]]) === false) {
                return false;
            }
        }
        return true;
    }
    if (Object.keys(this).length > 0) {
        return true;
    }
    return false;
}

_QueryableObject.prototype.Average = function (arg1) {
    var _result = 0;
    if (arg1) {
        for (var i = 0 ; i < Object.keys(this).length ; i++) {
            _result = _result + arg1(this[Object.keys(this)[i]]);
        }
        return _result / Object.keys(this).length;
    }
    for (var i = 0 ; i < Object.keys(this).length ; i++) {
        _result = _result + (this[Object.keys(this)[i]]);
    }
    return _result / Object.keys(this).length;
}

_QueryableObject.prototype.Concat = function (_second) {
    if (_second) {
        var _result = this.toArray();
        _second.toArray().forEach(function (_secondElement) { _result.push(_secondElement); });
        return new _QueryableObject(_second);
    }
    return new _QueryableObject(this);
}

_QueryableObject.prototype.Contain = function (value,comparer) {
    if (comparer) {
        for (var i = 0 ; i < Object.keys(this).length ; i++) {
            if (comparer(this[Object.keys(this)[i]],value) === true) {
                return true;
            }
        }
    }
    for (var i = 0 ; i < Object.keys(this).length ; i++) {
        if (this[Object.keys(this)[i]] === value) {
            return true;
        }
    }
}

_QueryableObject.prototype.Count = function(predicate) {
    return Object.keys( predicate ? this.Where(predicate) : this).length;
}

_QueryableObject.prototype.Distinct = function () {
    var _thisArray = this.toArray().sort();
    if (_thisArray.length < 2) {
        return this;
    }
    var _result = [_last];
    for (var i = 1 ; i < _thisArray.length ; i++) {
        if (_result[_result.length - 1] != _thisArray[i]) {
            _result.push(_thisArray[i]);
        }
    }
    return new _QueryableObject(_result);
}

_QueryableObject.prototype.DefaultIfEmpty = function (defaultValue) {
    if (this.Count() === 0) {
        return defaultValue != undefined && defaultValue != null ? defaultValue : null;
    }
    return this;
}

_QueryableObject.prototype.ElementAt = function (index) {
    return this[Object.keys(this)[index]];
}

_QueryableObject.prototype.ElementAtOrDefault = function(index) {
    if (index < this.Count() && index>= 0) {
        return this[Object.keys(this)[index]];
    }
    return null;
}

_QueryableObject.prototype.Except = function (_second,comparer) {
    var _firstArray = this.toArray(), _result = [];
    if (comparer) {
        _firstArray.forEach(function (_firstElelement) {
            if (!_second.Contain(_firstElelement, comparer)) {
                _result.push(_firstElelement);
            }
        });
    }
    else {
        _firstArray.forEach(function (_firstElelement) {
            if (!_second.Contain(_firstElelement)) {
                _result.push(_firstElelement);
            }
        });
    }
    return _result.length ? null : new _QueryableObject(_result);
}

_QueryableObject.prototype.First = function (predicate) {
    if (predicate) {
        return this.Where(predicate).ElementAt(0);
    }
    return this.ElementAt(0);
}

_QueryableObject.prototype.FirstOrDefault = function (predicate) {
    if (predicate) {
        return this.Where(predicate).ElementAtOrDefault(0);
    }
    return this.ElementAtOrDefault(0);
}

_QueryableObject.prototype.GroupBy = function () {

}

_QueryableObject.prototype.Intersect = function (_second, comparer) {
    if (comparer) {
        var _firstArray = this.Distinct().toArray(), _secondArray = this.Distinct(), _result;
        _firstArray.forEach(function (_fistElement) {
            if (_secondArray.Contain(_fistElement, comparer)) {
                _result.push(_fistElement);
            }
        });
        return new _QueryableObject(_result);
    }
    if (_second) {
        var _firstArray = this.Distinct().toArray(), _secondArray = this.Distinct(), _result;
        _firstArray.forEach(function (_fistElement) {
            if (_secondArray.Contain(_fistElement)) {
                _result.push(_fistElement);
            }
        });
        return new _QueryableObject(_result);
    }
}

_QueryableObject.prototype.Where = function (arg1) {
    if (arg1) {
        var _this = {};
        for (var i = 0 ; i < Object.keys(this).length ; i++) {
            if (arg1(this[Object.keys(this)[i]]) === true) {
                _this[Object.keys(this)[i]] = this[Object.keys(this)[i]];
            }
        }
        return new _QueryableObject(_this);
    }
}