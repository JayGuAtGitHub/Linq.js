function Linq(obj) {
    if (Array.isArray(obj)) {
        return Linq.CreateExpression(obj,"array");
    }
    
}



Linq.CreateExpression = function (source, sourceType, expression) {
    return new Linq.Expression({ source: source, sourceType: sourceType }, expression);
}

Linq.Expression = function (baseExpression,operate) {
    if (baseExpression === undefined) {
        return this;
    }
    var _result = new Linq.Expression();
    _result.source = baseExpression.source;
    _result.sourceType = baseExpression.sourceType;
    var _baseOperators = baseExpression.operates;
    if(Array.isArray(_baseOperators)){
        for (var i = 0, length = Object.keys(_baseOperators).length; i < length; i++) {
            _result.operates[_baseOperators[i]] = [];
            for (var j = 0, jLength = _baseOperators[i].length; j < jLength; j++) {
                _result.operates[_baseOperators[i]].push(_baseOperators[i][i]);
            }
        }
    }
    else {
        _result.operates = {};
    }
    if (operate !== undefined) {
        if (Array.isArray(_result.operates[operate.Operater]) === false) {
            _result.operates[operate.Operater] = [];
        }
        _result.operates[operate.Operater].push(operate.Value);
    }
    return _result;
}

Linq.Expression.prototype.Where = function (predicate) {
    return new Linq.Expression(this, { Operater: "Where", Value: predicate });
}

Linq.Expression.prototype.ElementAt = function(){
    alert(1);
}

var x = new Linq([]);
var y = x.Where(function () { alert(1) });
var z = y.Where(function () { alert(2) });

