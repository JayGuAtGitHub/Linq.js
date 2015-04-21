window.Linq.QueryableObject = function (obj) {
    return new _QueryableObject(obj);
}

function _QueryableObject(_obj) {

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

_QueryableObject.prototype.map = function(call) {
    return this.toArray().map(function(element) {
        call(element);
    });
}

_QueryableObject.prototype.push = function (value) {
    this[this.Count() + 1] = new _QueryableObject(value);
}

_QueryableObject.prototype.keyAt = function (index) {
    return Object.keys(this)[index];
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

_QueryableObject.prototype.Contain = function (value, comparer) {
    if (comparer) {
        for (var i = 0 ; i < Object.keys(this).length ; i++) {
            if (comparer(this[Object.keys(this)[i]], value) === true) {
                return true;
            }
        }
    }
    for (var i = 0 ; i < Object.keys(this).length ; i++) {
        if (this[Object.keys(this)[i]] === value) {
            return true;
        }
    }
    return false;
}

_QueryableObject.prototype.Count = function (predicate) {
    return Object.keys(predicate ? this.Where(predicate) : this).length;
}

_QueryableObject.prototype.Distinct = function () {
    if (this.Count() < 2) {
        return new _QueryableObject(this);
    }
    var _thisArray = this.toArray().sort();
    var _result = [_thisArray[0]];
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

_QueryableObject.prototype.ElementAtOrDefault = function (index) {
    if (index < this.Count() && index >= 0) {
        return this[Object.keys(this)[index]];
    }
    return null;
}

_QueryableObject.prototype.Except = function (_second, comparer) {
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

_QueryableObject.prototype.ExpandBy = function (groupedKey) {

    var returnArray = [];
    for (var i = 0, len = this.Count() ; i < len; i++) {
        var groupByKeys = [],thisObj = this[i];
        Object.keys(thisObj).map(function (key) {
            if (key != groupedKey) {
                groupByKeys.push(key)
            }
        })
        thisObj[groupedKey].map(function (groupedObj) {
            var _obj = {};
            groupByKeys.map(function(key) {
                _obj[key] = thisObj[key];
            });
            Object.keys(groupedObj).map(function(innerGroupedKey) {
                _obj[innerGroupedKey] = groupedObj[innerGroupedKey];
            });
            returnArray.push(_obj);
        })
    }
    return returnArray;
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

_QueryableObject.prototype.GroupBy = function (keys, comparer) {
    function initKeysCursor(obj) {
        var _keysCursorResult = { Keys: {}, Values: [] };
        keys.forEach(function (element) {
            _keysCursorResult.Keys[element] = obj[element];
        });
        return _keysCursorResult;
    }
    var _result = [], orderedThis = window.Linq.QueryableObject(this).OrderBy(keys), _keysCursor = initKeysCursor(orderedThis.First());

    if (comparer) {
        orderedThis.toArray().forEach(function (element, index) {
            if ((function () {
                for (var i in _keysCursor.Keys) {
                    if (comparer(element[i], _keysCursor.Keys[i])) {
                        return false;
            }
            }
                return true;
            })()) {
                _keysCursor.Values.push(element);
            }
            else {
                _result.push(_keysCursor);
                _keysCursor = initKeysCursor(element);
                _keysCursor.Values.push(element);
            }
        });
    }
    else {
        orderedThis.toArray().forEach(function (element, index) {
            if ((function () {
                for (var i in _keysCursor.Keys) {
                    if (element[i] !== _keysCursor.Keys[i]) {
                        return false;
            }
            }
                return true;
            })()) {
                _keysCursor.Values.push(element);
            }
            else {
                _result.push(_keysCursor);
                _keysCursor = initKeysCursor(element);
                _keysCursor.Values.push(element);
            }
        });
    }

    _result.push(_keysCursor);
    return _result;
}

_QueryableObject.prototype.GroupJoin = function (inner, outerKeySelector, innerKeySelector, resultSelector, comparer) {
    var _result = [];
    if (comparer) {
        for (var i = 0, iLength = this.Count() ; i < iLength; i++) {
            var _eachResult = [];
            for (var j = 0, jLength = inner.Count() ; j < jLength; j++) {
                if (comparer(outerKeySelector(this.ElementAt(i)), innerKeySelector(inner.ElementAt(j)))) {
                    _eachResult.push(inner.ElementAt(j));
                }
            }
            _result.push(resultSelector(this.ElementAt(i), new _QueryableObject(_eachResult)));
        }
    }
    else {
        for (var i = 0, iLength = this.Count() ; i < iLength; i++) {
            var _eachResult = [];
            for (var j = 0, jLength = inner.Count() ; j < jLength; j++) {
                if (outerKeySelector(this.ElementAt(i)) === innerKeySelector(inner.ElementAt(j))) {
                    _eachResult.push(inner.ElementAt(j));
                }
            }
            _result.push(resultSelector(this.ElementAt(i), new _QueryableObject(_eachResult)));
        }
    }
    return new _QueryableObject(_result);
}

_QueryableObject.prototype.Intersect = function (source2, comparer) {
    var _source2 = source2.Distinct(), _result = [];
    if (comparer) {
        for (var i = 0, length = _source2.Count() ; i < length; i++) {
            if (this.Contain(_source2.ElementAt(i), comparer)) {
                _result.push(_source2.ElementAt(i));
            }
        }
    }
    else {
        for (var i = 0, length = _source2.Count() ; i < length; i++) {
            if (this.Contain(_source2.ElementAt(i))) {
                _result.push(_source2.ElementAt(i));
            }
        }
    }
    return new _QueryableObject(_result);
}

_QueryableObject.prototype.Join = function (inner, outerKeySelector, innerKeySelector, resultSelector, comparer) {
    var _result = [];
    if (comparer) {
        for (var i = 0, iLength = this.Count() ; i < iLength; i++) {
            for (var j = 0, jLength = inner.Count() ; j < jLength; j++) {
                if (comparer(outerKeySelector(this.ElementAt(i)), innerKeySelector(inner.ElementAt(j)))) {
                    _result.push(resultSelector(this.ElementAt(i), inner.ElementAt(j)));
                }
            }
        }
    }
    else {
        for (var i = 0, iLength = this.Count() ; i < iLength; i++) {
            for (var j = 0, jLength = inner.Count() ; j < jLength; j++) {
                if (outerKeySelector(this.ElementAt(i)) === innerKeySelector(inner.ElementAt(j))) {
                    _result.push(resultSelector(this.ElementAt(i), inner.ElementAt(j)));
                }
            }
        }
    }
    return new _QueryableObject(_result);
}

_QueryableObject.prototype.OrderBy = function (keySelectors, comparer) {
    var _result = window.Linq.QueryableObject(this).toArray();
    if (comparer) {
        _result.sort(function (_this, _next) {
            for (var i = 0 ; i < keySelectors.length ; i++) {
                if (comparer(_this[keySelectors[i]], _next[keySelectors[i]]) > 0) {
                    return true;
                }
            }
        });
    }
    else {
        _result.sort(function (_this, _next) {
            for (var i = 0 ; i < keySelectors.length ; i++) {
                if (_this[keySelectors[i]] > _next[keySelectors[i]]) {
                    return true;
                }
            }
        });
    }
    return new _QueryableObject(_result);
}

_QueryableObject.prototype.OrderByDescending = function (keySelectors, comparer) {
    var _result = window.Linq.QueryableObject(this).toArray();
    if (comparer) {
        _result.sort(function (_this, _next) {
            for (var i = 0 ; i < keySelectors.length ; i++) {
                if (comparer(_this[keySelectors[i]], _next[keySelectors[i]]) < 0) {
                    return true;
                }
            }
        });
    }
    else {
        _result.sort(function (_this, _next) {
            for (var i = 0 ; i < keySelectors.length ; i++) {
                if (_this[keySelectors[i]] < _next[keySelectors[i]]) {
                    return true;
                }
            }
        })
    }
    return new _QueryableObject(_result);
}

_QueryableObject.prototype.Last = function (predicate) {
    if (predicate) {
        return this.Where(predicate).Last();
    }
    return this.ElementAt(this.Count() - 1);
}

_QueryableObject.prototype.LastOrDefault = function (predicate) {
    if (predicate) {
        return this.Where(predicate).Last();
    }
    return this.ElementAtOrDefault(this.Count() - 1);
}

_QueryableObject.prototype.Max = function (selector) {
    var _maxResult;
    if (selector) {
        _maxResult = this.First();
        var _maxCompare = selector(this.First());
        for (var i = 0 ; i < this.Count() ; i++) {
            if (_maxCompare < selector(this.ElementAt(i))) {
                _maxCompare = selector(this.ElementAt(i));
                _maxResult = this.ElementAt(i);
            }
        }
    }
    else {
        _maxResult = this.First();
        for (var i = 0 ; i < this.Count() ; i++) {
            if (_maxResult < this.ElementAt(i)) {
                _maxResult = this.ElementAt(i);
            }
        }
    }
    return _maxResult;
}

_QueryableObject.prototype.Min = function (selector) {
    var _minResult;
    if (selector) {
        _minResult = this.First();
        var _minCompare = selector(this.First());
        for (var i = 0 ; i < this.Count() ; i++) {
            if (_minCompare > selector(this.ElementAt(i))) {
                _minCompare = selector(this.ElementAt(i));
                _minResult = this.ElementAt(i);
            }
        }
    }
    else {
        _minResult = this.First();
        for (var i = 0 ; i < this.Count() ; i++) {
            if (_minResult > this.ElementAt(i)) {
                _minResult = this.ElementAt(i);
            }
        }
    }
    return _minResult;
}

_QueryableObject.prototype.Reverse = function () {
    var _result = {}
    for (var i = this.Count() - 1; i >= 0; i++) {
        _result[Object.keys(this)[i]] = this.ElementAt(i);
    }
    return new _QueryableObject(_result);
}

_QueryableObject.prototype.Select = function (selector) {
    var _result = {};
    for (var i = 0 ; i < this.Count() ; i++) {
        _result[this.keyAt(i)] = selector(this.ElementAt(i), i);
    }
    return new _QueryableObject(_result);
}

_QueryableObject.prototype.SelectMany = function (selector) {
    var _result = [];
    for (var i = 0 ; i < this.Count() ; i++) {
        selector(this.ElementAt(i), i).forEach(function (element) {
            _result.push(element);
        });
    }
    return new _QueryableObject(_result);
}

_QueryableObject.prototype.SequenceEqual = function (comparedObj, comparer) {
    if (this.Count() !== comparedObj.Count()) {
        return false;
    }
    if (comparer) {
        for (var i = 0, length = this.Count() ; i < length; i++) {
            if (comparer(this.ElementAt(i), comparedObj.ElementAt(i)) === false) {
                return false;
            }
        }
        return true;
    }
    for (var i = 0, length = this.Count() ; i < length; i++) {
        if (this.ElementAt(i) != comparedObj.ElementAt(i)) {
            return false;
        }
    }
    return true;
}

_QueryableObject.prototype.Single = function (predicate) {
    if (predicate) {
        return this.Where(predicate).Single();
    }
    if (this.Count() !== 1) {
        throw "Not only 1 exists."
    }
    return this.First();
}

_QueryableObject.prototype.SingleOrDefault = function (predicate) {
    if (predicate) {
        return this.Where(predicate).SingleOrDefault();
    }
    if (this.Count() > 0) {
        throw "More than 1 exists."
    }
    return this.FirstOrDefault();
}

_QueryableObject.prototype.Skip = function (count) {
    if (count >= this.Count()) {
        return null
    }
    var _result = {}
    for (var i = count, length = this.Count() ; i < length; i++) {
        _result[this.keyAt(i)] = this.ElementAt(i)
    }
    return new _QueryableObject(_result);
}

_QueryableObject.prototype.SkipWhile = function (predicate) {
    var _result = {}
    for (var i = 0, length = this.Count() ; i < length; i++) {
        if (predicate(this.ElementAt(i), i) !== true) {
            _result[this.keyAt(i)] = this.ElementAt(i);
        }
    }
    return new _QueryableObject(_result);
}

_QueryableObject.prototype.Sum = function (selector) {
    if (this.Count() === 0) {
        return 0;
    }
    if (selector) {
        var _sum = selector(this.First())
        for (var i = 1, length = this.Count() ; i < length; i++) {
            _sum = _sum + selector(this.ElementAt(i));
        }
        return _sum;
    }
    var _sum = this.First()
    for (var i = 1, length = this.Count() ; i < length; i++) {
        _sum = _sum + this.ElementAt(i);
    }
    return _sum;
}

_QueryableObject.prototype.Take = function (count) {
    var _result = {};
    for (var i = 0, length = count > this.Count() ? this.Count() : count; i < length; i++) {
        _result[this.keyAt(i)] = this.ElementAt(i);
    }
    return new _QueryableObject(_result);
}

_QueryableObject.prototype.TakeWhile = function (predicate) {
    var _result = {}
    for (var i = 0, length = this.Count() ; i < length; i++) {
        if (predicate(this.ElementAt(i), i) === true) {
            _result[this.keyAt(i)] = this.ElementAt(i);
        }
    }
    return new _QueryableObject(_result);
}

_QueryableObject.prototype.Union = function (source2, comparer) {
    var _result = this.Distinct(), _source2 = source2.Distinct();
    if (comparer) {
        for (var i = 0, length = _source2.Count() ; i < length; i++) {
            if (this.Contain(_source2.ElementAt(i), comparer) === false) {
                _result[_result.Count() + 1] = _source2.ElementAt(i);
            }
        }
    }
    else {
        for (var i = 0, length = _source2.Count() ; i < length; i++) {
            if (this.Contain(_source2.ElementAt(i)) === false) {
                _result[_result.Count() + 1] = _source2.ElementAt(i);
            }
        }
    }
    return new _QueryableObject(_result);
}

_QueryableObject.prototype.Where = function (predicate) {
    var _this = {};
    for (var i = 0 ; i < Object.keys(this).length ; i++) {
        if (predicate(this.ElementAt(i),i) === true) {
            _this[this.keyAt(i)] = this.ElementAt(i);
        }
    }
    return new _QueryableObject(_this);
}

_QueryableObject.prototype.Zip = function (source2, resultSelector) {
    var _reuslt = [];
    for (var i = 0, length = (this.Count() > source2.Count() ? this.Count() : source2.Count()) ; i < length ; i++) {
        _reuslt.push(resultSelector(this.ElementAt(i),source2.ElementAt(i)));
    }
    return new _QueryableObject(_reuslt);
}