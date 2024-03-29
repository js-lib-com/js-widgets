__js_debug__ = true;
if (!Function.prototype.bind) {
    Function.prototype.bind = function (thisArg) {
        var _this = this, slice = Array.prototype.slice, args = slice.call(arguments, 1);
        return function () {
            return _this.apply(thisArg, args.concat(slice.call(arguments)));
        };
    };
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (suffix) {
        if (this.length < suffix.length) {
            return false;
        }
        return this.lastIndexOf(suffix) === this.length - suffix.length;
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchItem, fromIndex) {
        var len = this.length;
        if (len === 0) {
            return -1;
        }
        var from = (typeof fromIndex !== 'undefined') ? fromIndex : 0;
        if (from >= len) {
            return -1;
        }
        if (from < 0) {
            from = len - Math.abs(from);
            if (from < 0) {
                from = 0;
            }
        }
        for (var i = from; i < this.length; ++i) {
            if (this[i] === searchItem) {
                return i;
            }
        }
        return -1;
    };
}

if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function (searchItem, fromIndex) {
        var len = this.length;
        if (len === 0) {
            return -1;
        }
        var from = (typeof fromIndex !== 'undefined') ? fromIndex : len;
        if (from >= 0) {
            from = Math.min(from, len - 1);
        }
        else {
            from = len - Math.abs(from);
        }
        for (var i = from; i >= 0; --i) {
            if (this[i] === searchItem) {
                return i;
            }
        }
        return -1;
    };
}

if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function (predicate) {
        // 1. Let O be ? ToObject(this value).
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // 3. If IsCallable(predicate) is false, throw a TypeError exception.
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }

        // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
        var thisArg = arguments[1];

        // 5. Let k be 0.
        var k = 0;

        // 6. Repeat, while k < len
        while (k < len) {
            // a. Let Pk be ! ToString(k).
            // b. Let kValue be ? Get(O, Pk).
            // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
            // d. If testResult is true, return k.
            var kValue = o[k];
            if (predicate.call(thisArg, kValue, k, o)) {
                return k;
            }
            // e. Increase k by 1.
            k++;
        }

        // 7. Return -1.
        return -1;
    };
}

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach (callback, thisArg) {
        var T = undefined, k;

        if (this === null) {
            throw new TypeError("this is null or not defined");
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0; // Hack to convert O.length to a UInt32

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if ({}.toString.call(callback) !== "[object Function]") {
            throw new TypeError(callback + " is not a function");
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (thisArg) {
            T = thisArg;
        }

        // 6. Let k be 0
        k = 0;

        // 7. Repeat, while k < len
        while (k < len) {

            var kValue;

            // a. Let Pk be ToString(k).
            // This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            // This step can be combined with c
            // c. If kPresent is true, then
            if (Object.prototype.hasOwnProperty.call(O, k)) {

                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[k];

                // ii. Call the Call internal method of callback with T as the this value and
                // argument list containing kValue, k, and O.
                callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
        }
        // 8. return undefined
    };
}

if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        // 1. Let O be ? ToObject(this value).
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // 3. If IsCallable(predicate) is false, throw a TypeError exception.
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }

        // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
        var thisArg = arguments[1];

        // 5. Let k be 0.
        var k = 0;

        // 6. Repeat, while k < len
        while (k < len) {
            // a. Let Pk be ! ToString(k).
            // b. Let kValue be ? Get(O, Pk).
            // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
            // d. If testResult is true, return kValue.
            var kValue = o[k];
            if (predicate.call(thisArg, kValue, k, o)) {
                return kValue;
            }
            // e. Increase k by 1.
            k++;
        }

        // 7. Return undefined.
        return undefined;
    };
}

if (!Array.prototype.filter) {
    Array.prototype.filter = function (fun, thisp) {
        if (this === null)
            throw new TypeError();

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun != "function")
            throw new TypeError();

        var res = [];
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, t))
                    res.push(val);
            }
        }

        return res;
    };
}

if (!Array.prototype.map) {
    Array.prototype.map = function (callback, thisArg) {

        var T, A, k;

        if (this === null) {
            throw new TypeError(" this is null or not defined");
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (thisArg) {
            T = thisArg;
        }

        // 6. Let A be a new array created as if by the expression new Array(len) where Array is
        // the standard built-in constructor with that name and len is the value of len.
        A = new Array(len);

        // 7. Let k be 0
        k = 0;

        // 8. Repeat, while k < len
        while (k < len) {

            var kValue, mappedValue;

            // a. Let Pk be ToString(k).
            // This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            // This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[k];

                // ii. Let mappedValue be the result of calling the Call internal method of callback
                // with T as the this value and argument list containing kValue, k, and O.
                mappedValue = callback.call(T, kValue, k, O);

                // iii. Call the DefineOwnProperty internal method of A with arguments
                // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
                // and false.

                // In browsers that support Object.defineProperty, use the following:
                // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable:
                // true });

                // For best browser support, use the following:
                A[k] = mappedValue;
            }
            // d. Increase k by 1.
            k++;
        }

        // 9. return A
        return A;
    };
}
// refrain to use $package operator since is not yet defined
(function () {
    if (typeof js === "undefined") {
        js = {};
    }
    if (typeof js.lang === "undefined") {
        js.lang = {};
    }
})();

js.lang.Operator = {
    _CLASS_NAME_REX : /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*(\.[A-Z][a-zA-Z0-9_]*)+$/,

    _PACKAGE_NAME_REX : /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*$/,

    $assert : function (expression, method, message) {
        if (Boolean(expression)) {
            return;
        }

        switch (arguments.length) {
        case 1:
            message = "Assertion fails";
            break;

        case 2:
            message = "Assertion fails on " + method;
            break;

        case 3:
            message = method + ": " + message;
            break;

        default:
            var args = [ message ];
            for (var i = 3; i < arguments.length; ++i) {
                args.push(arguments[i]);
            }
            message = method + ": " + $format.apply(this, args);
        }
        throw new js.lang.AssertException(message);
    },

    $static : function (code, sync) {
        if (sync === true) {
            try {
                code();
            } catch (er) {
                js.ua.System.error("Static initialization fails. %s", er);
            }
        }
        else {
            js.lang.Operator.$static._initializers.push(code);
        }
    },

    $preload : function (selectors) {
        if (typeof selectors === "function") {
            selectors = "[data-class='" + selectors.prototype.toString() + "']";
        }
        js.lang.Operator.$preload._selectors.push(selectors);
    },

    $package : function (name) {
        var names, scope, i, j;

        if (!name || !js.lang.Operator._PACKAGE_NAME_REX.test(name)) {
            js.ua.System.error("Invalid package name |%s|.", name);
            return;
        }

        names = name.split(".");
        for (i = 0; i < names.length; i++) {
            scope = window;
            for (j = 0; j <= i; j++) {
                if (typeof scope[names[j]] === "undefined") {
                    scope[names[j]] = {
                        __package__ : names.slice(0, j + 1).join(".")
                    };
                }
                scope = scope[names[j]];
            }
        }
    },

    $declare : function (className, staticDeclaration) {
        var names, name, scope, packageName, i;

        if (!className || !js.lang.Operator._CLASS_NAME_REX.test(className)) {
            js.ua.System.error("Invalid class name |%s|.", className);
            return;
        }
        if (typeof staticDeclaration === "undefined") {
            staticDeclaration = true;
        }

        names = className.split(".");
        for (i = 0; i < names.length; i++) {
            if (names[i].charAt(0) === names[i].charAt(0).toUpperCase()) {
                break;
            }
            scope = window;
            for (j = 0; j <= i; j++) {
                if (typeof scope[names[j]] === "undefined") {
                    scope[names[j]] = {
                        __package__ : names.slice(0, j + 1).join(".")
                    };
                }
                scope = scope[names[j]];
            }
        }

        for (; i < names.length; i++) {
            name = names[i];
            if (typeof scope[name] === "undefined") {
                if (staticDeclaration) {
                    scope[name] = {};
                }
                else {
                    scope[name] = function () {
                    };
                }
            }
            scope = scope[name];
        }
    },

    $include : function (className) {
        if (!className || !js.lang.Operator._CLASS_NAME_REX.test(className)) {
            js.ua.System.error("Invalid class name |%s|.", className);
        }
    },

    $extends : function (subClass, superClass) {
        if (typeof subClass === "undefined") {
            js.ua.System.error("Trying to extend undefined subclass.");
            return;
        }
        if (typeof subClass !== "function") {
            js.ua.System.error("Trying to extend invalid subclass %s.", subClass);
            return;
        }
        if (typeof superClass === "undefined") {
            js.ua.System.error("Undefined superclass when trying to extend %s.", subClass);
            return;
        }
        if (typeof superClass !== "function") {
            js.ua.System.error("Invalid superclass %s when trying to extend %s.", superClass, subClass);
            return;
        }

        var subClassPrototype = subClass.prototype;
        function F () {
        }
        F.prototype = superClass.prototype;
        subClass.prototype = new F();
        for ( var p in subClassPrototype) {
            subClass.prototype[p] = subClassPrototype[p];
        }

        if (navigator.userAgent.indexOf("MSIE") !== -1) {
            // IE refuses to list toString and valueOf in above for-each loop
            // so we need to add then manually
            if (subClassPrototype.hasOwnProperty("toString")) {
                subClass.prototype.toString = subClassPrototype.toString;
            }
            if (subClassPrototype.hasOwnProperty("valueOf")) {
                subClass.prototype.valueOf = subClassPrototype.valueOf;
            }
        }

        // there are rumors that constructor property is not reliable; just to be on safe side take care to properly
        // initialize it, in the case of prototype overwrite, but internally uses j(s)-lib specific __ctor__ property
        // NOTE: it is important to use $extends even declared class has no superclass; uses Object
        // if $extends is not used constructor properties are not properly initialized
        subClass.prototype.constructor = subClass;
        subClass.prototype.__ctor__ = subClass;
        subClass.__super__ = superClass;

        // if superclass function has a function named $extends it is called at this moment giving superclass
        // opportunity to execute some logic whenever it is extended
        if (typeof superClass.$extends === "function") {
            superClass.$extends.call(superClass, subClass);
        }

        function getArguments (args) {
            if (args.length === 1 && args[0] && typeof args[0] !== "string" && typeof args[0].length !== "undefined" && typeof args[0].push === "undefined") {
                // if caller supplies its own actual arguments, that is, passes 'arguments' keyword
                // given args contains only one 'array like' item, i.e. it has length property but no built-in method
                // like push; in such case returns caller actual 'arguments'

                // the second test from above if() checks for both undefined and null

                return args[0];
            }
            return args;
        }

        // enhance subclass with $super accessor
        subClass.prototype.$super = function () {
            var caller, methodName, args, ctor, method, value;

            caller = subClass.prototype.$super.caller;
            if (typeof caller.__super__ === "function") {
                // if __super__, the secret link to superclass, is present the caller is a constructor
                caller.__super__.apply(this, getArguments(arguments));
                return;
            }

            // if __super__ is missing the caller should be an instance method
            // and first argument should be the method name
            methodName = arguments[0];
            args = getArguments($args(arguments, 1));

            if (this.hasOwnProperty(methodName)) {
                // special case: allow subclass to declare method in constructor
                ctor = this.__ctor__;
            }
            else {
                // search caller up on prototypes chain
                for (ctor = this.__ctor__; ctor; ctor = ctor.__super__) {
                    if (ctor.prototype.hasOwnProperty(methodName) && ctor.prototype[methodName] === caller) {
                        break;
                    }
                }
            }

            // here ctor variable holds a reference to constructor of caller method, no
            // matter method is declared in constructor or in prototype
            if (!(ctor && ctor.__super__)) {
                js.ua.System.error("Super method |%s| does not override a subclass method.", methodName);
                return;
            }
            method = ctor.__super__.prototype[methodName];
            if (typeof method === "undefined") {
                js.ua.System.error("Super method |%s| not found.", methodName);
                return;
            }
            if (typeof method !== "function") {
                js.ua.System.error("Super method |%s| is not a function.", methodName);
                return;
            }
            method.__super_call__ = true;
            value = method.apply(this, args);
            method.__super_call__ = false;
            return value;
        };
    },

    $implements : function (subClass, superInterface) {
        for ( var methodName in superInterface) {
            if (typeof subClass.prototype[methodName] === "undefined") {
                js.ua.System.error("Missing method |%s| implementation from class |%s|.", methodName, subClass);
            }
        }
    },

    $mixin : function (targetClass, mixin) {
        if (typeof targetClass !== "function") {
            js.ua.System.error("Mixin target is not a class.");
            return;
        }
        if (typeof mixin !== "object") {
            js.ua.System.error("Mixin source is not an object.");
            return;
        }
        var target = targetClass.prototype;
        for ( var p in mixin) {
            if (mixin.hasOwnProperty(p) && typeof target[p] === "undefined") {
                target[p] = mixin[p];
            }
        }
    },

    $args : function (args, startIdx) {
        // function arguments is actually an array like object having callee property
        if (typeof args === "undefined" || args === null || typeof args.callee !== "function") {
            js.ua.System.error("Invalid function call arguments: undefined, null or callee function missing.");
            return;
        }
        if (typeof startIdx === "undefined") {
            startIdx = 0;
        }
        var a = [];
        for (var i = startIdx; i < args.length; i++) {
            a.push(args[i]);
        }
        return a;
    },

    $legacy : function (expression, legacyCode) {
        if (!expression) {
            return;
        }
        try {
            legacyCode();
        } catch (er) {
            js.ua.System.error("Legacy code execution fail. %s", er);
        }
    },

    // Refrain to use the same characters for flags and conversion. Current implementation may confuse them.
    // _FORMAT_PATTERN : /%%|%(?:(\d+)\$)?([-#a-zA-Z]+)?(\d+)?(?:\.(\d+))?([a-zA-Z])/g,

    _FORMAT_PATTERN : /%%|%(?:(\d+)\$)?([-])?(\d+)?(?:\.(\d+))?([sSdeEoxX])/g,

    $format : function (format) {
        if (typeof format === "undefined") {
            return "undefined";
        }
        if (format === null) {
            return "null";
        }

        if (typeof format.callee === "function") {
            // if format is a function actual arguments, concluded by callee, it may be
            // followed by start index, which determine format string position in arguments list
            var args = [];
            var startIdx = arguments.length > 1 ? arguments[1] : 0;
            var endIdx = arguments.length > 2 ? arguments[2] : arguments[0].length;
            for (var i = startIdx; i < endIdx; i++) {
                args.push(arguments[0][i]);
            }
            return this.$format.apply(this, args);
        }

        if (typeof format !== "string" && !(format instanceof String)) {
            return format.toString();
        }

        function string (value, flag, width, precision) {
            if (typeof value === "undefined") {
                return "undefined";
            }
            if (value === null) {
                return "null";
            }
            if (typeof value !== "string" && !(value instanceof String)) {
                if (typeof value === "function") {
                    if (typeof value.prototype !== "undefined" && typeof value.prototype.toString === "function") {
                        value = value.prototype.toString();
                    }
                    else {
                        value = "unknown";
                    }
                }
                else if (value instanceof Array) {
                    value = "Array[" + value.length + "]";
                }
                else if (value instanceof Error && typeof value.message !== "undefined") {
                    value = value.message;
                }
                else if (typeof value.trace === "function") {
                    value = value.trace();
                }
                else {
                    value = typeof value.toString === "function" ? value.toString() : "unknown";
                }
            }
            if (typeof width !== "undefined") {
                var i = value.length;
                if (flag === "-") {
                    for (; i < width; ++i) {
                        value = " " + value;
                    }
                }
                else {
                    for (; i < width; ++i) {
                        value = value + " ";
                    }
                }
            }
            if (typeof precision !== "undefined") {
                value = value.substr(0, precision);
            }
            return value;
        }

        function STRING (value, flag, width, precision) {
            if (value === null) {
                return "null";
            }
            return string(value, flag, width, precision).toUpperCase();
        }

        function integer (value, flag, width, precision, radix, noround) {
            if (value === null) {
                return "0";
            }
            if (typeof value !== "number" && !(value instanceof Number)) {
                js.ua.System.print("Expected number but get " + typeof value + " when trying to format integer value.");
                value = Number(value);
            }
            if (!noround) {
                value = Math.round(value);
            }
            var s = value.toString(radix ? radix : 10);
            for (var i = s.length; i < width; ++i) {
                s = "0" + s;
            }
            return s;
        }

        function real (value, flag, width, precision) {
            return integer(value, flag, width, precision, 10, true);
        }

        function octal (value, flag, width, precision) {
            return integer(value, flag, width, precision, 8);
        }

        function hexadecimal (value, flag, width, precision) {
            return integer(value, flag, width, precision, 16);
        }

        function HEXADECIMAL (value, flag, width, precision) {
            return hexadecimal(value, flag, width, precision).toUpperCase();
        }

        var handlers = {
            s : string,
            S : STRING,
            d : integer,
            e : real,
            E : real,
            o : octal,
            x : hexadecimal,
            X : HEXADECIMAL
        };

        var args = [];
        for (var i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        var ordinaryIndex = 0;
        js.lang.Operator._FORMAT_PATTERN.lastIndex = 0;
        return format.replace(js.lang.Operator._FORMAT_PATTERN, function (match, index, flag, width, precision, conversion, offset, format) {
            if (match === "%%") {
                return "%";
            }

            // there are browsers returning empty string instead of undefined for optional capture
            // example would be FF and IE8
            if (index === "") {
                index = undefined;
            }
            if (flag === "") {
                flag = undefined;
            }
            if (width === "") {
                width = undefined;
            }
            if (precision === "") {
                precision = undefined;
            }

            index = typeof index !== "undefined" ? Number(index) - 1 : ordinaryIndex++;
            if (typeof width !== "undefined") {
                width = Number(width);
            }
            if (typeof precision !== "undefined") {
                precision = Number(precision);
            }
            var handler = handlers[conversion];
            if (typeof handler === "undefined") {
                js.ua.System.print("No handler for conversion of <" + conversion + ">. Use string handler.");
                handler = handlers.s;
            }
            var value = args[index];
            if (typeof value === "undefined") {
                value = null;
            }
            return handler(value, flag, width, precision);
        });
    },

    $name : function (context, name) {
        return this._searchWorker("getByName", arguments);
    },

    $element : function (context, selector) {
        return this._searchWorker("getByCss", arguments);
    },

    $list : function (context, selector) {
        return this._searchWorker("findByCss", arguments);
    },

    _searchWorker : function (functionName, args) {
        // this implementation introduce hard dependency on js.dom package that is a circular dependency
        // for now is acceptable

        if (args.length == 2) {
            return args[0][functionName](args[1]);
        }
        return WinMain.doc[functionName](args[0]);
    },

    $trace : function (sourceName, message) {
        $log("TRACE", sourceName, arguments.length > 2 ? $format(arguments, 1) : message);
    },

    $debug : function (sourceName, message) {
        $log("DEBUG", sourceName, arguments.length > 2 ? $format(arguments, 1) : message);
    },

    $info : function (sourceName, message) {
        $log("INFO", sourceName, arguments.length > 2 ? $format(arguments, 1) : message);
    },

    $warn : function (sourceName, message) {
        $log("WARN", sourceName, arguments.length > 2 ? $format(arguments, 1) : message);
    },

    $error : function (sourceName, message) {
        $log("ERROR", sourceName, arguments.length > 2 ? $format(arguments, 1) : message);
    },

    $fatal : function (sourceName, message) {
        $log("FATAL", sourceName, arguments.length > 2 ? $format(arguments, 1) : message);
    },

    _timestamp : new Date().getTime(),

    $log : function (level, sourceName, message) {
        if (typeof console === "undefined") {
            return;
        }
        var t = new Date().getTime() - js.lang.Operator._timestamp;
        var text = t + " " + level + " " + sourceName;
        if (message instanceof Error) {
            message = typeof message.message !== "undefined" ? message.message : message.toString();
        }
        if (typeof message !== "undefined") {
            text += (' ' + message);
        }
        console.log(text);
    },

    toString : function () {
        return "js.lang.Operator";
    }
};

(function () {
    var i;

    var snippet = "js.lang.Operator.$level.disable = function() {" + //
    "	$level = js.lang.Operator.$level.NOP;" + //
    "};" + //
    "js.lang.Operator.$level.NOP = function() {" + //
    "};" + //
    "(js.lang.Operator.$level.NOP.enable = js.lang.Operator.$level.enable = function() {" + //
    "	$level = js.lang.Operator.$level;" + //
    "})();";

    var levels = [ "assert", "trace", "debug", "info", "warn", "error", "fatal" ];
    for (i = 0; i < levels.length; ++i) {
        eval(snippet.replace(/level/g, levels[i]));
    }

    js.lang.Operator.$static._initializers = [];

    js.lang.Operator.$static.execute = function () {
        var staticBlocks = js.lang.Operator.$static._initializers;
        for (i = 0; i < staticBlocks.length; ++i) {
            try {
                staticBlocks[i]();
            } catch (er) {
                js.ua.System.error("Static block initialization fails. %s", er);
            }
        }
    };

    js.lang.Operator.$preload._selectors = [];

    // invoked from js.ua.Window#_fireDomReady, just before return, after dom-ready event was fired
    js.lang.Operator.$preload.execute = function () {
        var selectors = js.lang.Operator.$preload._selectors, it;
        for (i = 0; i < selectors.length; i++) {
            it = WinMain.doc.findByCss(selectors[i]).it();
            while (it.hasNext()) {
                it.next();
            }
        }
    };
})();

$static = js.lang.Operator.$static;
$preload = js.lang.Operator.$preload;
$package = js.lang.Operator.$package;
$declare = js.lang.Operator.$declare;
$include = js.lang.Operator.$include;
$extends = js.lang.Operator.$extends;
$implements = js.lang.Operator.$implements;
$mixin = js.lang.Operator.$mixin;
$args = js.lang.Operator.$args;
$legacy = js.lang.Operator.$legacy;

$log = js.lang.Operator.$log;

$format = js.lang.Operator.$format;
$name = js.lang.Operator.$name;
$element = js.lang.Operator.$element;
$list = js.lang.Operator.$list;

$f = js.lang.Operator.$format;
$n = js.lang.Operator.$name;
$e = js.lang.Operator.$element;
$l = js.lang.Operator.$list;

// dollar name is used by jQuery; it can be configured to not but is not adviseable
$package("js.ua");

js.ua.Engine = {
    GECKO : false,

    PRESTO : false,

    TRIDENT : false,

    WEBKIT : false,

    MOBILE_WEBKIT : false,

    cssClass : null
};

$static(function () {
    // user agent samples:
    // Internet Explorer: Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; EmbeddedWB 14.52 from:
    // http://www.bsalsa.com/ EmbeddedWB 14.52; .NET CLR 1.1.4322; .NET CLR 2.0.50727)
    // Chrome: Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.19 (KHTML, like Gecko) Chrome/0.3.154.9
    // Safari/525.19
    // Safari: Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.19 (KHTML, like Gecko) Version/3.1.2
    // Safari/525.21
    // Firefox: Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.17) Gecko/20080829 Firefox/2.0.0.17
    // Opera: Opera/9.62 (Windows NT 5.1; U; en) Presto/2.1.1

    // layout engines tests order matters; do not alter it! especially WebKit MUST precede Gecko
    if (navigator.userAgent.indexOf("MSIE") !== -1) { // IE
        js.ua.Engine.TRIDENT = true;
        js.ua.Engine.cssClass = "trident";
    }
    else if (navigator.userAgent.indexOf("WebKit") !== -1) {
        if (navigator.userAgent.indexOf("Mobile") !== -1 || navigator.userAgent.indexOf("Android") !== -1) {
            js.ua.Engine.MOBILE_WEBKIT = true; // mobile devices
            js.ua.Engine.cssClass = "mobile-webkit";
        }
        else {
            js.ua.Engine.WEBKIT = true; // Safari, Chrome
            js.ua.Engine.cssClass = "webkit";
        }
    }
    else if (navigator.userAgent.indexOf("Gecko") !== -1) { // Firefox
        js.ua.Engine.GECKO = true;
        js.ua.Engine.cssClass = "gecko";
    }
    else if (navigator.userAgent.indexOf("Presto") !== -1) { // Opera
        js.ua.Engine.PRESTO = true;
        js.ua.Engine.cssClass = "presto";
    }
}, true);
$package("js.event");

js.event.CustomEvents = function (parent) {
    if (typeof parent !== "undefined") {
        parent._customEvents = this;
    }

    this._events = {};
};

js.event.CustomEvents.prototype = {
    register : function () {
        for (var i = 0, type; i < arguments.length; ++i) {
            type = arguments[i];
            if (!(type in this._events)) {
                this._events[type] = [];
            }
        }
    },

    unregister : function () {
        for (var i = 0, type; i < arguments.length; ++i) {
            type = arguments[i];
            if (!(type in this._events)) {
                continue;
            }
            delete this._events[type];
        }
    },

    addListener : function (type, listener, scope) {
        var handlers = this._events[type];
        if (handlers) {
            handlers.push({
                type : type,
                listener : listener,
                scope : scope
            });
        }
    },

    removeListener : function (type, listener) {
        var handlers = this._events[type];
        if (handlers) {
            var i, handler;
            for (i = handlers.length - 1; i >= 0; i--) {
                handler = handlers[i];
                if (!handler.running && handler.listener === listener) {
                    handlers.splice(i, 1);
                }
            }
        }
        return this;
    },

    removeAllListeners : function (type) {
        var handlers = this._events[type];
        if (handlers) {
            var i, handler;
            for (i = handlers.length - 1; i >= 0; i--) {
                handler = handlers[i];
                if (!handler.running) {
                    handlers.splice(i, 1);
                }
            }
        }
        return this;
    },

    hasType : function (type) {
        return type in this._events;
    },

    hasListener : function (type) {
        var handlers = this._events[type];
        return handlers ? handlers.length !== 0 : false;
    },

    fire : function (type) {
        var handlers = this._events[type];
        if (!handlers) {
            return;
        }

        var results = [];
        var it = new js.lang.Uniterator(handlers), h;
        while (it.hasNext()) {
            h = it.next();
            try {
                h.running = true;
                results.push(h.listener.apply(h.scope, $args(arguments, 1)));
                h.running = false;
            } catch (er) {
                js.ua.System.error(er);
            }
        }
        return results;
    },

    toString : function () {
        return "js.event.CustomEvents";
    }
};
$extends(js.event.CustomEvents, Object);
$package("js.lang");

js.lang.Types = {
    isArray : function (value) {
        return (typeof value === "object" && value instanceof Array) ||
        // function arguments is actually an array like object, it does not
        // implement any Array methods like splice, but having instead callee
        // anyway, we want to treat it as an array not an object
        (typeof value !== "undefined" && value !== null && typeof value.callee === "function");
    },

    isObject : function (value) {
        return value !== null && (typeof value === "object" || typeof value === "function");
    },

    isFunction : function (value) {
        return typeof value === "function";
    },

    isString : function (value) {
        return typeof value === "string" || value instanceof String;
    },

    isNumber : function (value) {
        return typeof value === "number" || value instanceof Number;
    },

    isBoolean : function (value) {
        return typeof value === "boolean" || value instanceof Boolean;
    },

    isPrimitive : function (value) {
        return this.isString(value) || this.isNumber(value) || this.isBoolean(value) || this.isDate(value);
    },

    isDate : function (value) {
        return value instanceof Date;
    },

    isElement : function (value) {
        if (!value) {
            return false;
        }

        // if value is an instance get instance constructor and continue testing for constructor
        // uses library __ctor__ extension instead of standard <constructor> property because of next excerpt from MDN:
        // ... This example shows that it is not always safe to rely on the constructor property of an object.

        if (typeof value !== "function") {
            value = value.__ctor__;
            if (typeof value === "undefined") {
                return false;
            }
        }

        // here value is always constructor
        // next recursive call for testing super constructor stops when __super__ is not defined
        
        if (value === js.dom.Element) {
            return true;
        }
        if (this.isElement(value.__super__)) {
            return true;
        }
        return false;
    },

    isNodeList : function (value) {
        // last condition is for <select> node which has both length and item method
        return value && typeof value.length === "number" && typeof value.item === "function" && typeof value.nodeName === "undefined";
    },

    isStrictObject : function (value) {
        if (this.isArray(value)) {
            return false;
        }
        if (this.isFunction(value)) {
            return false;
        }
        if (this.isBoolean(value)) {
            return false;
        }
        if (this.isNumber(value)) {
            return false;
        }
        if (this.isString(value)) {
            return false;
        }
        return this.isObject(value);
    },

    _TYPE_NAME_PATTERN : /\[object\s+(\w+)\]/,

    getTypeName : function (value) {
        if (value === null) {
            return "Null";
        }
        if (typeof value === "undefined") {
            return "Undefined";
        }
        var typeName = Object.prototype.toString.call(value);
        var type = this._TYPE_NAME_PATTERN.exec(typeName);
        if (type !== null) {
            return type[1];
        }
        $debug("js.lang.Types#getTypeName", "Invalid type name |%s|. Return 'Unknown'.", typeName);
        return "Unknown";
    },

    toString : function () {
        return "js.lang.Types";
    }
};

$legacy(js.ua.Engine.TRIDENT, function () {
    js.lang.Types.isNodeList = function (value) {
        return value && typeof value.length === "number" && typeof value.item !== "undefined" && typeof value.nodeName === "undefined";
    };
});
$package("js.net");

$include("js.lang.Types");

js.net.URL = function () {
    if (!(this instanceof js.net.URL)) {
        var url = js.net.URL.normalize(arguments[0]);
        if (arguments.length > 1) {
            url += js.net.URL.formatQuery(arguments[1]);
        }
        return url;
    }

    if (arguments.length === 1) {
        this._FULL_URL_REX.lastIndex = 0;
        var m = this._FULL_URL_REX.exec(arguments[0]);
        this._init(m);

        this.parameters = this.query ? js.net.URL.parseQuery(this.query) : {};

        this.value = arguments[0];
        return;
    }

    if (arguments.length === 2) {
        this.parameters = arguments[1];
        var query = js.net.URL.formatQuery(this.parameters);
        this.value = arguments[0] + query;

        this._SHORT_URL_REX.lastIndex = 0;
        var m = this._SHORT_URL_REX.exec(arguments[0]);
        m[5] = query.substr(1);
        this._init(m);
    }
};

js.net.URL.getHost = function (url) {
    if (url) {
        var startIndex = url.indexOf("://");
        if (startIndex !== -1) {
            if (url.substring(0, startIndex).toLowerCase() === "file") {
                // if protocol is file host name is empty string
                return "";
            }
            startIndex += 3;
            var endIndex = url.indexOf("/", startIndex);
            if (endIndex === -1) {
                endIndex = url.length;
            }
            return url.substring(startIndex, endIndex);
        }
    }
    return null;
};

js.net.URL.parseQuery = function (query) {
    if (query) {
        var parameters = {};
        var a = query.split("&");
        for ( var i = 0, kv; i < a.length; i++) {
            kv = a[i].split("=");
            parameters[kv[0]] = kv[1];
        }
        return parameters;
    }
    return null;
};

js.net.URL.formatQuery = function (parameters) {
    var a = [], v;
    if (parameters) {
        for ( var p in parameters) {
            v = parameters[p];
            if (v === true) {
                v = 1;
            }
            else if (v === false) {
                v = 0;
            }
            a.push(p + "=" + encodeURIComponent(v));
        }
    }
    return a.length ? ("?" + a.join("&")) : "";
};

js.net.URL.normalize = function (url) {
    var rex = js.net.URL.prototype._SCHEMA_REX;
    rex.lastIndex = 0;
    if (rex.test(url)) {
        return url;
    }

    var ref = WinMain.url; // referrer

    if (url.charAt(0) === "/") {
        return $format("%s://%s:%d/%s", ref.protocol, ref.host, ref.port, url);
    }
    return ref.value.substring(0, ref.value.lastIndexOf("/") + 1) + url;
};

js.net.URL.prototype = {
    _FULL_URL_REX : /^(http|https|ftp|file):\/\/([^:\/]+)?(?::([0-9]{1,5}))?(?:(?:\/?)|(?:\/([^\/?#][^?#]*)))?(?:\?([^?#]*))?(?:#(.+)?)?$/gi,

    _SHORT_URL_REX : /^(http|https|ftp|file):\/\/([^:\/]+)(?::([0-9]{1,5}))?(?:(?:\/?)|(?:\/([^\/?#][^?#]*)))?$/gi,

    _SCHEMA_REX : /^[^:]+:\/\/.+$/gi,

    _init : function (matches) {
        this.protocol = matches[1] ? matches[1] : null;

        this.host = matches[2] ? matches[2] : null;

        this.port = Number(matches[3]) || 80;

        this.path = matches[4] ? matches[4] : null;

        this.query = matches[5] ? matches[5] : null;

        this.ref = matches[6] ? matches[6] : null;
    },

    isCrossDomain : function (url) {
        if (!url) {
            return true;
        }
        url = new js.net.URL(js.net.URL.normalize(url));
        if (this.protocol !== url.protocol) {
            return true;
        }
        if (this.host !== url.host) {
            return true;
        }
        if (this.port !== url.port) {
            return true;
        }
        return false;
    },

    toString : function () {
        return "js.net.URL";
    }
};
$extends(js.net.URL, Object);
$package("js.ua");

$include("js.net.URL");
$include("js.event.CustomEvents");

js.ua.Window = function (nativeWindow, properties) {
    if (typeof properties === "undefined") {
        properties = {};
    }

    this._id = "js-window#" + js.ua.Window._index++;

    this._window = nativeWindow;

    this._parent = properties.parent || null;
    this.url = null;
    if (properties.crossDomain) {
        this.url = new js.net.URL(properties.url);
    }

    this.doc = null;

    this.page = null;

    this._dependentChildWindows = null;

    this._state = js.ua.Window.State.CREATED;
    $debug("js.ua.Window#Window", "Window %s has been created.", this._id);

    if (properties.crossDomain) {
        $debug("js.ua.Window#Window", "Cross domain child window: parent domain |%s| different from child |%s|.", this._parent.url.host, this.url.host);
        return;
    }

    this._events = new js.event.CustomEvents();
    this._events.register("pre-dom-ready", "dom-ready", "load", "pre-unload", "unload", "orientation-change");

    this._addEventListener("DOMContentLoaded", this._domContentLoadedHandler, this);
    this._addEventListener("load", this._loadHandler, this);
    this._addEventListener("beforeunload", this._beforeUnloadHandler, this);
    this._addEventListener("unload", this._unloadHandler, this);
    if (typeof this._window.onorientationchange !== "undefined") {
        this._addEventListener("orientationchange", this._orientationChangeHandler, this);
    }
};

js.ua.Window._index = 0;

js.ua.Window.prototype = {
    _DESTROY_CONFIRM : "Please confirm you want to leave the page.",

    open : function (url, parameters, features) {
        if (parameters) { // if parameters are not undefined or null
            url += js.net.URL.formatQuery(parameters);
        }

        var name, value;
        if (typeof features === "undefined") {
            features = {};
        }
        var defaults = js.ua.Window.Features;
        for (name in defaults) {
            if (typeof features[name] === "undefined" && typeof defaults[name] !== "undefined") {
                features[name] = defaults[name];
            }
        }

        if (features.fullscreen) {
            delete features.top;
            delete features.left;
            delete features.width;
            delete features.height;
        }

        var specs = [];
        for (name in features) {
            value = features[name];
            if (name === "name" || name === "dependent" || typeof value === "undefined") {
                continue;
            }
            if (js.lang.Types.isBoolean(value)) {
                value = value ? "yes" : "no";
            }
            specs.push(name + "=" + value);
        }

        var childWindow, childNativeWindow;
        try {
            childNativeWindow = this._window.open(url, features.name, specs.join(","), false);
            if (childNativeWindow === null) {
                $error("js.ua.Window#open", "Fail to create native window:\r\n" + //
                "\t- url: %s\r\n" + //
                "\t- name: %s\r\n" + //
                "\t- specs: %s", url, features.name, specs.join(","));
                return null;
            }
            childWindow = new js.ua.Window(childNativeWindow, {
                parent : this,
                url : url,
                crossDomain : WinMain.url.isCrossDomain(url)
            });
            if (features.dependent) {
                if (this._dependentChildWindows === null) {
                    this._dependentChildWindows = [];
                }
                this._dependentChildWindows.push(childWindow);
            }
        } catch (er) {
            childWindow = null;
            js.ua.System.error(er);
        }
        return childWindow;
    },

    close : function () {
        $debug("js.ua.Window#close", "Close window |%s|", this._id);
        if (this._window.closed) {
            $debug("js.ua.Window#close", "Attempt to close already closed window |%s|", this._id);
            return;
        }
        this._window.close();
        // unload event is fired when native window closes
    },

    assign : function (url, parameters) {
        if (typeof parameters !== "undefined") {
            url += js.net.URL.formatQuery(parameters);
        }
        this._window.location.assign(url);
    },

    replace : function (url, parameters) {
        if (typeof parameters !== "undefined") {
            url += js.net.URL.formatQuery(parameters);
        }
        this._window.location.replace(url);
    },

    reload : function () {
        this._window.location.reload();
    },

    back : function () {
        this._window.history.back();
    },

    getTitle : function () {
        return document.title || "Untitled";
    },

    getWidth : function () {
        return Number(this._window.innerWidth);
    },

    getHeight : function () {
        return Number(this._window.innerHeight);
    },

    scrollTo : function (child, offset, callback, scope) {
        if (typeof offset === "undefined") {
            offset = 0;
        }

        var fromYOffset = this._window.pageYOffset;
        var toYOffset = child.style.getPageTop() - offset;

        if (fromYOffset === toYOffset) {
            if (callback) {
                callback.call(scope || window);
            }
            return;
        }

        var anim = new js.fx.Anim({
            duration : 500,
            from : this._window.pageYOffset,
            to : child.style.getPageTop() - offset,
            ttf : js.fx.TTF.Logarithmic,
            render : function (top) {
                this._window.scrollTo(0, top);
            }.bind(this)
        });
        if (typeof callback !== "undefined") {
            anim.on("anim-stop", callback, scope || window);
        }
        anim.start();
    },

    _EVENT_STATES : null,

    on : function (type, listener, scope) {
        if (this._EVENT_STATES === null) {
            this._EVENT_STATES = {
                "dom-ready" : js.ua.Window.State.DOM_READY,
                "load" : js.ua.Window.State.LOADED,
                "pre-unload" : js.ua.Window.State.BEFORE_UNLOADED,
                "unload" : js.ua.Window.State.UNLOADED
            };
        }
        if (this._state >= this._EVENT_STATES[type]) {
            // if related native event was already triggered execute listener right now
            listener.call(scope, this);
            return this;
        }
        this._events.addListener(type, listener, scope || js.ua.Window);
        return this;
    },

    un : function (type, listener) {
        this._events.removeListener(type, listener);
        return this;
    },

    getOrientation : function () {
        return (this._window.orientation % 180 === 0) ? js.ua.Orientation.PORTRAIT : js.ua.Orientation.LANDSCAPE;
    },

    _domContentLoadedHandler : function () {
        $trace("js.ua.Window#_domContenLoadedHandler", this._id);
        this._removeEventListener("DOMContentLoaded", js.ua.Window.prototype._domContentLoadedHandler);
        this._fireDomReady();
    },

    _loadHandler : function () {
        // DOM ready and page loaded events are registered to different triggers and I do not found and explicit
        // specification regarding their order; so it seems we are at user agent implementation mercy
        // also we have a potential race condition here if implementation uses different threads of execution for
        // 'DOMContentLoaded' and 'load' triggers
        // for theses reasons is possible this method to be enacted before _fireDomReady() set this._state to DOM_READY

        $trace("js.ua.Window#_loadHandler", this._id);
        this._removeEventListener("load", js.ua.Window.prototype._loadHandler);

        // we need to ensure DOM ready event is fired, even at this lately stage
        // in other words: better later than never
        // anyway, if _fireDomReady was already executes next statement is NOP
        this._fireDomReady();

        $debug("js.ua.Window#_loadHandler", "Fire load event for %s.", this._id);
        this._events.fire("load", this);
        this._state = js.ua.Window.State.LOADED;
    },

    _beforeUnloadHandler : function () {
        if (this._state !== js.ua.Window.State.LOADED) {
            // takes care to fire page load event if unload comes before actual page loading completes
            this._loadHandler();
        }

        $debug("js.ua.Window#_beforeUnloadHandler", "Fire pre-unload event for %s.", this._id);
        this._removeEventListener("beforeunload", js.ua.Window.prototype._beforeUnloadHandler);

        var results = this._events.fire("pre-unload", this);
        var preventUnload = false;
        for (var i = 0; i < results.length; ++i) {
            // event listener should return explicit false boolean in order to prevent unload
            preventUnload |= (results[i] === false);
        }

        this._state = js.ua.Window.State.BEFORE_UNLOADED;
        if (preventUnload) {
            return this._DESTROY_CONFIRM;
        }
    },

    _unloadHandler : function () {
        // there is a strange behavior on creating new window with open
        // on new created window unload event is triggered immediately after window creation
        if (this._state === js.ua.Window.State.CREATED) {
            $debug("js.ua.Window#_unloadHandler", "Ignore strange unload event on window creation.");
            return;
        }

        this._removeEventListener("unload", js.ua.Window.prototype._unloadHandler);

        $debug("js.ua.Window#_unloadHandler", "Fire unload event for %s.", this._id);
        this._events.fire("unload", this);

        if (this._dependentChildWindows !== null) {
            this._dependentChildWindows.forEach(function (childWindow) {
                $debug("js.ua.Window#finalize", "Force child window %s closing on parent finalization.", childWindow._id);
                childWindow.close();
            });
        }
        this._state = js.ua.Window.State.FINALIZED;
    },

    _orientationChangeHandler : function () {
        $debug("js.ua.Window#_orientationChangeHandler", "Fire orientation-change event for %s.", this._id);
        this._events.fire("orientation-change", this.getOrientation());
    },

    _addEventListener : function (type, listener, scope) {
        var target = (type === "DOMContentLoaded") ? this._window.document : this._window;
        target.addEventListener(type, listener.bind(scope), false);
    },

    _removeEventListener : function (type, listener) {
        var target = (type === "DOMContentLoaded") ? this._window.document : this._window;
        target.removeEventListener(type, listener, false);
    },

    _fireDomReady : function () {
        // do not use js.ua.Window.prototype._fireDomReady in order to avoid NOP-ing all window instances
        this._fireDomReady = js.lang.NOP;

        // complete this instance fields initialization, postponed by constructor in order to avoid hard dependencies
        this.url = new js.net.URL(this._window.location.toString());
        this.doc = new js.dom.Document(this._window.document);

        // as early as possible add engine class used to CSS hacking
        var body = this.doc.getByTag("body");
        if (body !== null) {
            body.addCssClass(js.ua.Engine.cssClass);
            js.dom.Node.removeBackRef(body.getNode());
        }
        var isWinMain = (this === WinMain);

        if (isWinMain) {
            $E = function (selectors) {
                if (arguments.length > 1) {
                    selectors = $format(arguments);
                }
                return WinMain.doc.getElement(js.dom.Node.querySelector(window.document, selectors));
            };

            $L = function (selectors) {
                if (arguments.length > 1) {
                    selectors = $format(arguments);
                }
                return WinMain.doc.getEList(js.dom.Node.querySelectorAll(window.document, selectors));
            };

            // run classes static initializers before firing any DOM ready related events
            $static.execute();
        }

        $debug("js.ua.Window#_fireDomReady", "Fire pre-dom-ready event for %s.", this._id);
        this._events.fire("pre-dom-ready", this);

        if (isWinMain) {
            // if user space code does not declare a subclass for page uses base page class, but only if this is WinMain
            if (this === WinMain && this.page === null) {
                $debug("js.ua.Window#_fireDomReady", "No user space page. Uses js.ua.Page instead.");
                this.page = new js.ua.Page();
            }
        }

        $debug("js.ua.Window#_fireDomReady", "Fire dom-ready event for for %s.", this._id);
        this._events.fire("dom-ready", this);

        if (isWinMain) {
            // after all classes are properly initialized preload requested element instances
            $preload.execute();
        }

        this._state = js.ua.Window.State.DOM_READY;
    },

    _stateName : function () {
        if (typeof js.ua.Window.STATE_NAMES === "undefined") {
            js.ua.Window.STATE_NAMES = [ "NONE", "CREATED", "DOM_READY", "LOADED", "BEFORE_UNLOADED", "UNLOADED", "FINALIZED" ];
        }
        return js.ua.Window.STATE_NAMES[this._state];
    },

    toString : function () {
        return "js.ua.Window";
    }
};
$extends(js.ua.Window, Object);

js.ua.Window.State = {
    NONE : 0,

    CREATED : 1,

    DOM_READY : 2,

    LOADED : 3,

    BEFORE_UNLOADED : 4,

    UNLOADED : 5,

    FINALIZED : 6
};

js.ua.Window.Features = {
    top : undefined,

    left : undefined,

    width : undefined,

    height : undefined,

    resizable : false,

    fullscreen : false,

    menubar : true,

    location : true,

    toolbar : true,

    directories : true,

    scrollbars : true,

    status : true,

    dependent : true,

    name : "_blank"
};

$legacy(!document.addEventListener || !document.removeEventListener, function () {
    js.ua.Window.prototype._addEventListener = function (type, listener, scope) {
        var doc = this._window.document;
        var _this = this;

        if (typeof this.__window_load_complete__ === "undefined") {
            this.__window_load_complete__ = false;
        }
        if (typeof this.__dom_ready_fired__ === "undefined") {
            this.__dom_ready_fired__ = false;
        }

        if (type !== "DOMContentLoaded") {
            if (type === "load" && doc.readyState === "complete") {
                $debug("js.ua.Window#_addEventListener", "Trying to register window load event after ready state complete.");
                _this.__window_load_complete__ = true;
                if (_this.__dom_ready_fired__) {
                    window.setTimeout(function () {
                        _this.__window_load_complete__ = false;
                        _this._loadHandler();
                    }, 10);
                }
            }
            else {
                this._window.attachEvent("on" + type, listener.bind(scope));
            }
            return this;
        }

        function fireDomReady () {
            if (!_this.__dom_ready_fired__) {
                _this.__dom_ready_fired__ = true;
                _this._fireDomReady();
                if (_this.__window_load_complete__) {
                    _this.__window_load_complete__ = false;
                    _this._loadHandler();
                }
            }
        }

        var docReadyStateHandler = function () {
            if (doc.readyState === "complete") {
                doc.detachEvent("onreadystatechange", docReadyStateHandler);
                fireDomReady();
            }
        };
        doc.attachEvent("onreadystatechange", docReadyStateHandler);

        if (this._window.top === this._window.self) { // not inside of iframe
            (function doScroll () {
                try {
                    doc.documentElement.doScroll("left");
                } catch (e) {
                    window.setTimeout(doScroll, 10);
                    return;
                }
                fireDomReady();
            })();
        }
        return this;
    };

    js.ua.Window.prototype._removeEventListener = function (type, listener) {
        if (type !== "DOMContentLoaded") {
            this._window.detachEvent(type, listener);
        }
        return this;
    };
});

$legacy(js.ua.Engine.TRIDENT, function () {
    js.ua.Window.__before_unload_handler__ = js.ua.Window.prototype._beforeUnloadHandler;
    js.ua.Window.prototype._beforeUnloadHandler = function () {
        if (this._state === js.ua.Window.State.LOADED) {
            js.ua.Window.__before_unload_handler__.call(this);
        }
    };
});
// refrain to use $package operator since is not yet defined
(function () {
    if (typeof js === "undefined") {
        js = {};
    }
    if (typeof js.ua === "undefined") {
        js.ua = {};
    }
})();

js.ua.System = {
    _ERROR_MESSAGE : "Temporary failure. Please refresh the page.",

    print : function (message) {
        if (typeof console !== "undefined") {
            console.log(message.replace(/<br \/>/g, " "));
        }
    },

    error : function (er) {
        js.ua.System.print(js.ua.System._getErrorMessage(arguments));
        js.ua.System.alert(this._ERROR_MESSAGE);
    },

    alert : function (message) {
        if (arguments.length > 0) {
            if (arguments.length > 1) {
                message = $format(arguments);
            }
            window.setTimeout(function () {
                window.alert(message);
            }, 1);
        }
    },

    toast : function (message) {
        if (arguments.length > 0) {
            if (arguments.length > 1) {
                message = $format(arguments);
            }
            window.setTimeout(function () {
                window.alert(message);
            }, 1);
        }
    },

    prompt : function (message, callback, scope) {
        if (arguments.length > 0) {
            if (arguments.length > 1) {
                message = $format(arguments);
            }
            window.setTimeout(function () {
                var prompt = window.prompt(message);
                if (prompt === null) {
                    // user cancel; convert to undefined
                    prompt = undefined;
                }
                else {
                    // user pressed OK
                    if (prompt.length === 0) {
                        // user OK but no input; convert to null
                        prompt = null;
                    }
                }
                callback.call(scope || window, prompt);
            }, 1);
        }
    },

    confirm : function (message, callback, scope) {
        if (arguments.length > 0) {
            if (arguments.length > 1) {
                message = $format(arguments);
            }
            window.setTimeout(function () {
                callback.call(scope || window, window.confirm(message));
            }, 1);
        }
    },

    _getErrorMessage : function (args) {
        if (args[0] instanceof Error) {
            var er = args[0];
            var s = er.name;
            if (er.message) {
                s += ("\r\n" + er.message);
            }
            return s;
        }
        return $format(args);
    }
};

(function () {
    // Replace global error handler with with a more explicit one, if debugging active.
    if (typeof __js_debug__ !== "undefined") {
        js.ua.System.error = function (er) {
            var s = js.ua.System._getErrorMessage(arguments);
            js.ua.System.print(s);
            js.ua.System.alert(s);
        };
    }
})();
$include = function () {
};

$include("js.lang.Operator");
$include("js.ua.System");
$include("js.ua.Window");

(function () {
    try {
        WinMain = new js.ua.Window(window);
    } catch (er) {
        js.ua.System.error(er);
    }
})();
$package("js.dom");

js.dom.Element = function (ownerDoc, node) {
    var dataCfg, pairs, value, i;

    this._ownerDoc = ownerDoc;

    this._node = node;
    js.dom.Node.setElement(node, this);

    this.style = new js.dom.Style(this);

    this._format = js.format.Factory.getFormat(js.dom.Node.getFormatName(node));
    this._config = {};
    dataCfg = this.getAttr("data-cfg");
    if (dataCfg !== null) {
        pairs = js.util.Strings.parseNameValues(dataCfg);
        for (i = 0; i < pairs.length; i++) {
            value = pairs[i].value;
            if (value === "true") {
                value = true;
            }
            else if (value === "false") {
                value = false;
            }
            else if (!isNaN(value)) {
                value = Number(value);
            }
            this._config[js.util.Strings.toScriptCase(pairs[i].name)] = value;
        }
        this.removeAttr("data-cfg");
    }

    this._domEvents = new js.event.DomEvents(this);

    this._hashCode = js.util.ID();
};

js.dom.Element.prototype = {
    getNode : function () {
        return this._node;
    },

    getOwnerDoc : function () {
        return this._ownerDoc;
    },

    addChild : function () {
        for (var i = 0, a; i < arguments.length; ++i) {
            a = arguments[i];
            if (a) {
                if (a instanceof js.dom.Element) {
                    if (!this._ownerDoc.equals(a._ownerDoc)) {
                        a = this._ownerDoc.importElement(a);
                    }
                    this._node.appendChild(a._node);
                }
            }
        }
        return this;
    },

    addChildFirst : function (children) {
        var firstChild = this.getFirstChild();

        if (children instanceof js.dom.Element) {
            if (firstChild !== null) {
                firstChild.insertBefore(children);
            }
            else {
                this.addChild(children);
            }
            return this;
        }

        if (children instanceof js.dom.EList) {
            var it = children.it();
            if (firstChild !== null) {
                while (it.hasNext()) {
                    firstChild.insertBefore(it.next());
                }
            }
            else {
                while (it.hasNext()) {
                    this.addChild(it.next());
                }
            }
            return this;
        }

        return this;
    },

    replaceChild : function (replacement, existing) {
        if (replacement && existing) {
            if (!replacement._ownerDoc.equals(this._ownerDoc)) {
                replacement = this._ownerDoc.importElement(replacement);
            }
            this._node.replaceChild(replacement._node, existing._node);
        }
        return this;
    },

    insertBefore : function (el) {
        if (el) {
            if (!el._ownerDoc.equals(this._ownerDoc)) {
                el = this._ownerDoc.importElement(el);
            }
            if (this._node.parentNode) {
                this._node.parentNode.insertBefore(el._node, this._node);
            }
        }
        return this;
    },

    clone : function (deep) {
        return this._ownerDoc.getElement(this._node.cloneNode(deep === true));
    },

    replace : function (replacement) {
        if (replacement) {
            if (!replacement._ownerDoc.equals(this._ownerDoc)) {
                replacement = this._ownerDoc.importElement(replacement);
            }
            if (this._node.parentNode) {
                this._node.parentNode.replaceChild(replacement._node, this._node);
            }
        }
    },

    remove : function (clear) {
        if (clear === false) {
            this._node.parentNode.removeChild(this._node);
            return this;
        }
        var tmpNodeRef = this._node;
        tmpNodeRef.parentNode.removeChild(tmpNodeRef);
        this._clean(this._node);
    },

    removeChildren : function () {
        var child, removed;
        while ((child = this._node.firstChild) !== null) {
            removed = false;
            if (child.nodeType === Node.ELEMENT_NODE) {
                var el = js.dom.Node.getElement(child);
                if (el !== null) {
                    el.remove();
                    removed = true;
                }
            }
            if (!removed) {
                this._node.removeChild(child);
            }
            child = this._node.firstChild;
        }
        return this;
    },

    getByIndex : function (index) {
        var children = this._node.children;
        return this._ownerDoc.getElement(children[index]);
    },

    getByClass : function (clazz) {
        var node = js.dom.Node.getElementByClass(this._node, clazz);
        return this._ownerDoc.getElement(node);
    },

    getByXPath : function (xpath) {
        return this._ownerDoc.evaluateXPathNode(this._node, $format(arguments));
    },

    findByXPath : function (xpath) {
        return this._ownerDoc.evaluateXPathNodeList(this._node, $format(arguments));
    },

    getByCss : function (selectors) {
        return this._ownerDoc.getElement(js.dom.Node.querySelector(this._node, $format(arguments)));
    },

    findByCss : function (selectors) {
        return this._ownerDoc.getEList(js.dom.Node.querySelectorAll(this._node, $format(arguments)));
    },

    getByTag : function (tag) {
        return this._ownerDoc.getElement(js.dom.Node.getElementsByTagName(this._node, tag));
    },

    findByTag : function (tag) {
        return this._ownerDoc.getEList(js.dom.Node.getElementsByTagName(this._node, tag));
    },

    getByCssClass : function (cssClass) {
        return this._ownerDoc.getElement(js.dom.Node.getElementsByClassName(this._node, cssClass));
    },

    findByCssClass : function (cssClass) {
        return this._ownerDoc.getEList(js.dom.Node.getElementsByClassName(this._node, cssClass));
    },

    getByName : function (name) {
        return this._ownerDoc.getElement(js.dom.Node.querySelector(this._node, $format("[name='%s'],[data-name='%s']", name, name)));
    },

    findByName : function (name) {
        return this._ownerDoc.getEList(js.dom.Node.querySelectorAll(this._node, $format("[name='%s'],[data-name='%s']", name, name)));
    },

    getParent : function () {
        if (this._node.parentNode === null) {
            return null;
        }
        return this._node.parentNode.nodeType === Node.ELEMENT_NODE ? this._ownerDoc.getElement(this._node.parentNode) : null;
    },

    getParentByTag : function (tag) {
        var el = this;
        while (el.getTag() !== tag) {
            el = el.getParent();
            if (el === null) {
                return null;
            }
        }
        return el;
    },

    getParentByCssClass : function (cssClass) {
        var el = this;
        while (!el.hasCssClass(cssClass)) {
            el = el.getParent();
            if (el === null) {
                return null;
            }
        }
        return el;
    },

    getChildren : function () {
        return this._ownerDoc.getEList(this._node.children);
    },

    getChildrenCount : function () {
        return this._node.childElementCount;
    },

    hasChildren : function () {
        return js.dom.Node.firstElementChild(this._node) !== null;
    },

    getFirstChild : function () {
        return this._ownerDoc.getElement(js.dom.Node.firstElementChild(this._node));
    },

    getLastChild : function () {
        return this._ownerDoc.getElement(js.dom.Node.lastElementChild(this._node));
    },

    getPreviousSibling : function () {
        return this._ownerDoc.getElement(js.dom.Node.previousElementSibling(this._node));
    },

    getNextSibling : function () {
        return this._ownerDoc.getElement(js.dom.Node.nextElementSibling(this._node));
    },

    getTag : function () {
        return this._node.tagName.toLowerCase();
    },

    setAttr : function () {
        if (arguments.length > 2) {
            for (var i = 0, l = arguments.length - 1; i < l;) {
                this.setAttr(arguments[i++], arguments[i++]);
            }
        }
        else if (arguments.length === 2) {
            this._node.setAttribute(arguments[0], arguments[1]);
        }
        return this;
    },

    getAttr : function (name) {
        if (this._node.attributes.length > 0) {
            var attr = this._node.attributes.getNamedItem(name);
            if (attr !== null) {
                return attr.value;
            }
        }
        return null;
    },

    removeAttr : function (name) {
        if (name) {
            this._node.removeAttribute(name);
        }
        return this;
    },

    hasAttr : function (name) {
        if (this._node.attributes.length === 0) {
            return false;
        }
        return this._node.attributes.getNamedItem(name) !== null;
    },

    addText : function (text) {
        if (text) {
            // W3C DOM Document interface mandates string for createTextNode argument
            if (!js.lang.Types.isString(text)) {
                text = text.toString();
            }
            this._node.appendChild(this._ownerDoc._document.createTextNode(text));
        }
        return this;
    },

    setText : function (text) {
        // refrain to use if(!text) {...} since number 0 is included too
        if (!(typeof text !== "undefined" && text !== null && text !== "")) {
            return this.removeText();
        }
        if (!js.lang.Types.isString(text)) {
            text = text.toString();
        }

        // W3C DOM Text node interface requires text escaping and this method relies on user agent for that matter.

        // remove all text nodes but the first
        var textNode = this.removeText(true);
        if (textNode === null) {
            this._node.appendChild(this._ownerDoc._document.createTextNode(text));
        }
        else {
            textNode.nodeValue = text;
        }
        return this;
    },

    getText : function () {
        var text = "";
        var nodelist = this._node.childNodes;
        for (var i = 0; i < nodelist.length; i++) {
            var node = nodelist.item(i);
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.nodeValue;
            }
        }
        return text;
    },

    removeText : function () {
        // skip first text node, that is, remove all text nodes but first
        // this undocumented flag is for library internal use only
        var first = false, firstTextNode = null;
        if (arguments[0] === true) {
            first = true;
        }

        var nodelist = this._node.childNodes;
        for (var i = 0; i < nodelist.length; ++i) {
            var node = nodelist.item(i);
            if (node.nodeType === Node.TEXT_NODE) {
                if (first) {
                    firstTextNode = node;
                }
                else {
                    this._node.removeChild(node);
                    --i;
                }
                first = false;
            }
        }
        // if used internally by library returns first text node found, may be null
        return arguments[0] === true ? firstTextNode : this;
    },

    addCssClass : function (cssClass, enabled) {
        if (cssClass) {
            if (typeof enabled === "undefined") {
                enabled = true;
            }
            if (enabled) {
                this._node.classList.add(cssClass);
            }
            else {
                this._node.classList.remove(cssClass);
            }
        }
        return this;
    },

    removeCssClass : function (cssClass) {
        if (cssClass) {
            this._node.classList.remove(cssClass);
        }
        return this;
    },

    toggleCssClass : function (cssClass) {
        if (cssClass) {
            this._node.classList.toggle(cssClass);
        }
        return this;
    },

    hasCssClass : function (cssClass) {
        if (!cssClass) {
            return false;
        }
        return this._node.classList.contains(cssClass);
    },

    // ------------------------------------------------------------------------
    // j(s)-lib extensions to Baby DOM Element interface

    setValue : function (value) {
        if (typeof value === "undefined") {
            return this;
        }
        if (value === null) {
            return this.removeText();
        }

        if (this._format !== null) {
            value = this._format.format(value);
        }
        return this.setText(value);
    },

    getValue : function () {
        var v = this.getText();
        return this._format !== null ? this._format.parse(v) : v.length > 0 ? v : null;
    },

    setObject : function (value) {
        this._ownerDoc._template.injectElement(this, value);
        return this;
    },

    addHTML : function (html) {
        if (html) {
            var range = this._ownerDoc.getDocument().createRange();
            range.selectNode(this._node);
            var fragment = range.createContextualFragment(html);
            this._node.appendChild(fragment);
        }
        return this;
    },

    setHTML : function (html) {
        // ensure all children are properly clean-up before set new HTML content
        this.removeChildren();
        if (html) {
            this._node.innerHTML = html;
        }
        return this;
    },

    getHTML : function () {
        return this._node.innerHTML;
    },

    focus : function () {
        this._node.focus();
        return this;
    },

    on : function (type, listener, scope, capture) {
        if (js.event.EventsMap.handle(this, arguments)) {
            return this;
        }

        if (typeof this._customEvents !== "undefined" && this._customEvents.hasType(type)) {
            this._customEvents.addListener(type, listener, scope);
            return this;
        }

        if (typeof capture === "undefined") {
            capture = false;
        }
        this._domEvents.addListener(type, listener, scope, capture);
        return this;
    },

    un : function (type, listener) {
        if (typeof this._customEvents !== "undefined" && this._customEvents.hasType(type)) {
            this._customEvents.removeListener(type, listener);
            return this;
        }
        if (typeof capture === "undefined") {
            capture = false;
        }
        this._domEvents.removeListener(type, listener, capture);
        return this;
    },

    setUserData : function (key, data) {
        if (!key) {
            return null;
        }
        if (typeof this._userData === "undefined") {
            this._userData = {};
        }
        var previousData = this._userData[key];
        if (typeof previousData === "undefined") {
            previousData = null;
        }
        if (data === null) {
            delete this._userData[key];
        }
        else {
            this._userData[key] = data;
        }
        return previousData;
    },

    getUserData : function (key) {
        if (typeof key === "undefined") {
            key = "value";
        }
        if (!key) {
            return null;
        }
        if (typeof this._userData === "undefined") {
            return null;
        }
        var data = this._userData[key];
        return typeof data !== "undefined" ? data : null;
    },

    removeUserData : function (key) {
        if (!key) {
            return null;
        }
        if (typeof this._userData === "undefined") {
            return null;
        }
        var data = this._userData[key];
        if (typeof data === "undefined") {
            return null;
        }
        delete this._userData[key];
        return data;
    },

    bind : function (selectors, typeName) {
        js.dom.Node.bind(this._node, selectors, typeName);
        return this;
    },

    getCustomEvents : function () {
        if (typeof this._customEvents === "undefined") {
            this._customEvents = new js.event.CustomEvents(this);
        }
        return this._customEvents;
    },

    show : function (show) {
        if (typeof show === "undefined") {
            show = true;
        }
        return this[(show ? "remove" : "add") + "CssClass"]("hidden");
    },

    hide : function () {
        return this.addCssClass("hidden");
    },

    _clean : function (node, guard) {
        if (typeof guard === "undefined") {
            guard = 0;
        }
        if (guard === 8) {
            return;
        }
        var it = new js.dom.Node.Iterator(node);
        while (it.hasNext()) {
            guard++;
            this._clean(it.next(), guard);
            guard--;
        }

        var el = js.dom.Node.getElement(node);
        if (el !== null) {
            delete el._ownerDoc;
            delete el._node;
            delete el.style;
            if (el._format !== null) {
                delete el._format;
            }
            delete el._domEvents;
            if (typeof el._customEvents !== "undefined") {
                delete el._customEvents;
            }
            if (typeof el._userData !== "undefined") {
                for ( var p in el._userData) {
                    delete el._userData[p];
                }
                delete el._userData;
            }
            js.dom.Node.removeBackRef(node);
        }
    },

    dump : function () {
        var sb = "";
        sb += this._node.tagName;

        var attributes = this._node.attributes;
        for (var i = 0; i < attributes.length; ++i) {
            sb += ' ';
            sb += attributes[i].name;
            sb += '='
            sb += attributes[i].value;
        }

        return sb;
    },

    trace : function () {
        var sb = "";
        var el = this, index;
        while (el !== null) {
            index = el._index();
            if (index != -1) {
                sb = "[" + index + "]" + sb;
            }
            sb = "/" + el.getTag() + sb;
            el = el.getParent();
        }
        return sb;
    },

    _index : function () {
        var parent = this.getParent();
        if (parent === null) {
            return -1;
        }
        var n = parent._node.firstChild;
        var index = 0, twinsCount = 0, indexFound = false;
        while (n !== null) {
            if (n === this._node) {
                indexFound = true;
            }
            if (n.nodeType === Node.ELEMENT_NODE && n.nodeName === this._node.nodeName) {
                ++twinsCount;
                if (!indexFound) {
                    ++index;
                }
            }
            n = n.nextSibling;
        }
        return twinsCount > 1 ? index : -1;
    },

    hashCode : function () {
        return this._hashCode;
    },

    toString : function () {
        return "js.dom.Element";
    }
};
// this $extends call may seem not neccesarylly but without it js.dom.Element.prototype.__ctor__ hidden property is not
// initialized and instance constructor retrieval like e.__ctor__ may be undefined; as a direct concequence
// js.util.Types#isElement can't recognize instances of js.dom.Element
$extends(js.dom.Element, Object);

js.dom.Element.prototype.$E = js.dom.Element.prototype.getByCss;

js.dom.Element.prototype.$L = js.dom.Element.prototype.findByCss;

$legacy(js.ua.Engine.TRIDENT, function () {
    js.dom.Element.prototype.clone = function (deep) {
        var clone = this._node.cloneNode(deep === true);
        this._ieCloneWorkaround(this, clone, 0);
        return this._ownerDoc.getElement(clone);
    };

    js.dom.Element.prototype._ieCloneWorkaround = function (originalElement, cloneNode, guard) {
        if (guard === 8) {
            return;
        }

        // parallel traversal of original source elements and cloned nodes trees
        // uses cloned nodes as loop condition to cope with shallow cloning

        var originalElementsIt = originalElement.getChildren().it();
        var cloneNodesIt = new js.dom.Node.Iterator(cloneNode);
        while (cloneNodesIt.hasNext()) {
            ++guard;
            this._ieCloneWorkaround(originalElementsIt.next(), cloneNodesIt.next(), guard);
            --guard;
        }

        // detach events copied by cloning operation
        originalElement._domEvents.getHandlers().forEach(function (handler) {
            cloneNode.detachEvent("on" + handler.type, handler.domEventListener);
        });

        // IE copy augmented values when cloning so we need to delete back-references manually
        js.dom.Node.removeBackRef(cloneNode);
    };

    js.dom.Element.prototype.addHTML = function (html) {
        if (html) {
            this._node.insertAdjacentHTML("beforeEnd", html);
        }
        return this;
    };

    js.dom.Element.prototype.getChildren = function () {
        var nodeList = this._node.children;
        if (typeof nodeList === "undefined") {
            nodeList = new js.dom.NodeList();
        }
        return this._ownerDoc.getEList(nodeList);
    };
});

$legacy(js.ua.Engine.TRIDENT || js.ua.Engine.MOBILE_WEBKIT, function () {
    js.dom.Element.prototype.addCssClass = function (cssClass, enabled) {
        if (cssClass) {
            if (typeof enabled === "undefined") {
                enabled = true;
            }
            if (!enabled) {
                return this.removeCssClass(cssClass);
            }
            cssClass = js.util.Strings.trim(cssClass);
            if (!this.hasCssClass(cssClass)) {
                if (this._node.className.length === 0) {
                    this._node.className = cssClass;
                }
                else {
                    this._node.className = [ this._node.className, cssClass ].join(" ");
                }
            }
        }
        return this;
    };

    js.dom.Element.prototype.removeCssClass = function (cssClass) {
        if (cssClass) {
            var re = new RegExp("(?:^|\\s+)" + js.util.Strings.escapeRegExp(cssClass) + "(?:\\s+|$)", "g");
            if (re.test(this._node.className)) {
                this._node.className = js.util.Strings.trim(this._node.className.replace(re, " "));
            }
        }
        return this;
    };

    js.dom.Element.prototype.toggleCssClass = function (cssClass) {
        if (cssClass) {
            this[this.hasCssClass(cssClass) ? "removeCssClass" : "addCssClass"](cssClass);
        }
        return this;
    };

    js.dom.Element.prototype.hasCssClass = function (cssClass) {
        if (!cssClass) {
            return false;
        }
        var re = new RegExp("(?:^|\\s+)" + js.util.Strings.escapeRegExp(cssClass) + "(?:\\s+|$)", "g");
        return re.test(this._node.className);
    };
});
$package('js.dom');

js.dom.Anchor = function(ownerDoc, node) {
	this.$super(ownerDoc, node);
	};

js.dom.Anchor.prototype = {
	setHref : function(href) {
		if (href) {
			this.setAttr('href', href);
		}
		return this;
	},

	getHref : function() {
		return this.getAttr('href');
	},

	toString : function() {
		return 'js.dom.Anchor';
	}
};
$extends(js.dom.Anchor, js.dom.Element);
$package('js.dom');

js.dom.Builder = {
	createXML : function(root) {
		return new js.dom.Document(window.document.implementation.createDocument('', root, null));
	},

	parseXML : function(xml) {
		return this._parse(xml, 'text/xml');
	},

	parseHTML : function(html) {
		return this._parse(html, 'application/xhtml+xml');
	},

	_parse : function(source, contentType) {
		var document = new DOMParser().parseFromString(source, contentType);
		if (typeof document === 'undefined') {
			throw new js.dom.DomException('Missing DOM parser support.');
		}
		var root = document.documentElement;
		// it seems there are browsers correctly using root node as parser error signal
		// and others using first child of root node
		// surprinsiglly chrome is in the second category
		if (root.nodeName === 'parsererror' || (root.firstChild && root.firstChild.nodeName === 'parsererror')) {
			throw new js.dom.DomException('Parse error.');
		}
		return new js.dom.Document(document);
	},

	loadXML : function(url, callback, scope) {
		this._load(url, 'text/xml', callback, scope);
	},

	loadHTML : function(url, callback, scope) {
		this._load(url, 'application/xhtml+xml', callback, scope);
	},

	_load : function(url, contentType, callback, scope) {
		if (!url || !js.lang.Types.isFunction(callback)) {
			return;
		}

		var xhr = new js.net.XHR();
		xhr.on('load', callback, scope);
		xhr.open('GET', url);
		xhr.send();
	},

	toString : function() {
		return 'js.dom.Builder';
	}
};

$static(function() {
	js.dom.Builder._pageDomain = js.net.URL.getHost(window.location.toString());
});

$legacy(js.ua.Engine.TRIDENT, function() {
	js.dom.Builder.createXML = function(root) {
		var doc = new ActiveXObject('MSXML2.DOMDocument');
		doc.async = false;
		doc.loadXML('<' + root + '/>');
		return new js.dom.Document(doc);
	};

	js.dom.Builder._parse = function(source, contentType) {
		var doc = new ActiveXObject('MSXML2.DOMDocument');
		doc.async = false;
		doc.loadXML(source);
		if (typeof doc === 'undefined') {
			throw new js.dom.DomException('js.dom.Builder#_parse', 'Missing DOM parser support.');
		}
		if (Number(doc.parseError.errorCode) !== 0) {
			throw new js.dom.DomException('js.dom.Builder#_parse', 'Parse error.');
		}
		return new js.dom.Document(doc);
	};
});
$package("js.dom");

js.dom.ControlInterface = {
	getName : function() {
	},

	setValue : function(value) {
	},

	getValue : function() {
	},

	reset : function() {
	},

	isValid : function() {
	},

	focus : function() {
	},

	isMultiple : function() {
	},

	forEachItem : function(callback, scope) {
	}
};
$package("js.dom");

js.dom.Control = function(ownerDoc, node) {
	this.$super(ownerDoc, node);

	this.__control__ = true;
};

js.dom.Control.prototype = {
	CSS_OPTIONAL : "optional",

	CSS_INVALID : "invalid",

	getName : function() {
		var name = this.getAttr("name");
		if (name === null) {
			name = this.getAttr("data-name");
		}
		else {
			}
		return name;
	},

	setValue : function(value) {
		this.removeCssClass(this.CSS_INVALID);

		if (typeof value === "undefined") {
			return this;
		}

		if (value === null) {
			return this._clean();
		}

		if (!this.isMultiple()) {
			if (this._format !== null) {
				value = this._format.format(value);
			}
			if (!js.lang.Types.isString(value)) {
				value = value.toString();
			}
		}
		else {
			if (value.length === 0) {
				return this._clean();
			}
			// here value is an array
			var array = value;
			value = "";
			for (var i = 0; i < array.length; ++i) {
				if (i > 0) {
					value += ',';
				}
				value += (this._format !== null ? this._format.format(array[i]) : array[i].toString());
			}
		}
		return this._setValue(value);
	},

	getValue : function() {
		var value = this._getValue();
		if (!this.isMultiple()) {
			return this._format !== null ? this._format.parse(value) : value.length > 0 ? value : null;
		}

		// if multiple values supported and this control is empty returns an empty array
		if (!value) {
			return [];
		}

		var values = value.split(",");
		for (var i = 0; i < values.length; ++i) {
			values[i] = values[i].trim();
			if (this._format !== null) {
				values[i] = this._format.parse(values[i]);
			}
		}
		return values;
	},

	reset : function() {
		this.removeCssClass(this.CSS_INVALID);
		this._node.value = this._getDefaultValue();
		return this;
	},

	isValid : function() {
		var valid = function(valid) {
			this.addCssClass(this.CSS_INVALID, !valid);
			return valid;
		}.bind(this);

		// a disabled control is always consider valid to not influence form validity test
		if (!this.isEnabled()) {
			return valid(true);
		}

		var value = this._getValue(), valid;
		if (this.hasCssClass(this.CSS_OPTIONAL) && !value) {
			// an optional and empty control is always valid
			return valid(true);
		}

		// here value can still be empty
		if (this._format !== null) {
			// if have formatter class delegates its test predicate
			return valid(this._format.test(value));
		}

		// if no formatter class a control is valid if its value is not empty
		return valid(Boolean(value));
	},

	focus : function() {
		this.removeCssClass(this.CSS_INVALID);
		return this._focus();
	},

	enable : function(enabled) {
		if (typeof enabled === "undefined") {
			enabled = true;
		}
		this.removeCssClass(this.CSS_INVALID);
		if (enabled) {
			this._node.disabled = false;
		}
		else {
			this._node.disabled = true;
		}
		return this;
	},

	disable : function() {
		this.removeCssClass(this.CSS_INVALID);
		this._node.disabled = true;
		return this;
	},

	isEnabled : function() {
		return !this._node.disabled;
	},

	isMultiple : function() {
		return this._node.hasAttribute("multiple") || this._node.hasAttribute("data-multiple");
	},

	forEachItem : function(callback, scope) {
		if (!this.isMultiple()) {
			callback.call(scope || window, {
				name : this.getName(),
				value : this.getValue()
			});
			return;
		}

		var items = this._getValue().split(",");
		for (var i = 0; i < items.length; ++i) {
			callback.call(scope || window, {
				name : this.getName() + "." + i,
				value : this._format !== null ? this._format.parse(items[i].trim()) : items[i].trim()
			});
		}
	},

	toString : function() {
		return "js.dom.Control";
	},

	// -----------------------------------------------------
	// protected low level methods that should be overridden by user defined controls

	_setValue : function(value) {
		this._node.value = value;
		return this;
	},

	_getValue : function() {
		return this._node.value;
	},

	_getDefaultValue : function() {
		return this._node.defaultValue ? this._node.defaultValue : "";
	},

	_clean : function() {
		this._node.value = "";
		return this;
	},

	_focus : function() {
		this._node.focus();
		return this;
	}
};
$extends(js.dom.Control, js.dom.Element);
$implements(js.dom.Control, js.dom.ControlInterface);
$package("js.dom");

js.dom.Button = function (ownerDoc, node) {
    this.$super(ownerDoc, node);
    };

js.dom.Button.prototype = {
    setValue : function (name) {
        return this.setText(name);
    },

    getValue : function () {
        return this.getText();
    },

    isValid : function () {
        return true;
    },

    isEmpty : function () {
        return false;
    },

    toString : function () {
        return "js.dom.Button";
    }
};
$extends(js.dom.Button, js.dom.Control);
$package('js.dom');

js.dom.Checkbox = function(ownerDoc, node) {
	this.$super(ownerDoc, node);
	};

js.dom.Checkbox.prototype = {
	setValue : function(checked) {
		this._node.checked = checked;
		return this;
	},

	getValue : function() {
		return this._node.checked;
	},

	check : function(checked) {
		if (typeof checked === "undefined") {
			checked = true;
		}
		this._node.checked = checked;
		return this;
	},

	uncheck : function() {
		this._node.checked = false;
		return this;
	},

	checked : function() {
		return this._node.checked;
	},

	isValid : function() {
		return true;
	},

	isEmpty : function() {
		return true;
	},

	toString : function() {
		return 'js.dom.Checkbox';
	}
};
$extends(js.dom.Checkbox, js.dom.Control);
$package("js.dom");

js.dom.ControlsIterable = function(controlsContainer) {
	this._ownerDoc = controlsContainer.getOwnerDoc();

	this._rootNode = controlsContainer.getNode();
};

js.dom.ControlsIterable.prototype = {
	forEach : function(callback, scope) {
		this._scan(this._rootNode, false, callback, scope || window);
	},

	forEachAll : function(callback, scope) {
		this._scan(this._rootNode, true, callback, scope || window);
	},

	_scan : function(node, includeHidden, callback, scope) {
		if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("exclude")) {
			return;
		}

		// in order to avoid creating j(s)-element for every single traversed node this scanner uses native nodes

		// a node is a control if has 'name' or 'data-name' attribute and wrapping element has __control__ property
		// __control__ property is library private and used to flag control instances
		// if includeHidden argument is not true hidden nodes are not accepted as controls

		var isControl = function(node) {
			if (!includeHidden && node.attributes.getNamedItem("type") === "hidden") {
				return null;
			}
			if (!node.hasAttribute("name") && !node.hasAttribute("data-name")) {
				return null;
			}
			var element = this._ownerDoc.getElement(node);
			return element.__control__ ? element : null;
		}.bind(this);

		var nodeList = node.children;
		if (typeof nodeList === "undefined") {
			// IE node.children is undefined if node has no children at all
			return;
		}
		// standard browsers have empty nodes list, in which case for loop is never executed

		for (var i = 0, n, e; i < node.children.length; i++) {
			n = node.children.item(i);
			// if is control invoke callback, otherwise continue branch depth-first scanning
			// next if uses side effect: testing for control also assign element value
			if ((e = isControl(n)) !== null) {
				callback.call(scope, e);
			}
			else {
				this._scan(n, includeHidden, callback, scope);
			}
		}
	},

	toString : function() {
		return "js.dom.ControlsIterable";
	}
};
$extends(js.dom.ControlsIterable, Object);
$package("js.dom");

js.dom.Document = function (document) {
    this._document = document;

    this._template = js.dom.template.Template.getInstance(this);

    this._domEvents = new js.event.DomEvents(this);
};

js.dom.Document.prototype = {
    getDocument : function () {
        return this._document;
    },

    isXML : function () {
        return false;
    },

    createElement : function (tag) {
        if (!tag) {
            return null;
        }
        var node = this._document.createElement(tag);
        if (arguments.length > 2) {
            var attrs = $args(arguments, 1);
            for (var i = 0, l = attrs.length - 1; i < l;) {
                node.setAttribute(attrs[i++], attrs[i++]);
            }
        }
        return this.getElement(node);
    },

    createElementForClass : function (tag, className) {
        if (!tag || !className) {
            return null;
        }

        var node = this._document.createElement(tag);
        js.dom.Node.setElementClassName(node, className);
        return this.getElement(node);
    },

    importElement : function (el) {
        if (!el) {
            return null;
        }
        if (el._ownerDoc.equals(this)) {
            return el;
        }
        return this.getElement(this._importNode(el._node));
    },

    _importNode : function (node) {
        return this._document.importNode(node, true);
    },

    getRoot : function () {
        return this.getElement(this._document.documentElement);
    },

    getById : function (id) {
        var node = this._getNodeById(id);
        return node ? this.getElement(node) : null;
    },

    _getNodeById : function (id) {
        return this._document.getElementById(id);
    },

    getByClass : function (clazz) {
        var node = js.dom.Node.getElementByClass(this._document, clazz);
        return this.getElement(node);
    },

    findByClass : function (clazz) {
        return this.getEList(js.dom.Node.getElementsByClass(this._document, clazz));
    },

    getByTag : function (tag) {
        return this.getElement(js.dom.Node.getElementsByTagName(this._document, tag));
    },

    findByTag : function (tag) {
        return this.getEList(js.dom.Node.getElementsByTagName(this._document, tag));
    },

    getByXPath : function (xpath) {
        return this.evaluateXPathNode(this._document, $format(arguments));
    },

    findByXPath : function (xpath) {
        return this.evaluateXPathNodeList(this._document, $format(arguments));
    },

    getByCss : function (selectors) {
        if (arguments.length > 1) {
            selectors = $format(arguments);
        }
        return this.getElement(js.dom.Node.querySelector(this._document, selectors));
    },

    findByCss : function (selectors) {
        if (arguments.length > 1) {
            selectors = $format(arguments);
        }
        return this.getEList(js.dom.Node.querySelectorAll(this._document, selectors));
    },

    getByCssClass : function (cssClass) {
        return this.getElement(js.dom.Node.getElementsByClassName(this._document, cssClass));
    },

    findByCssClass : function (cssClass) {
        return this.getEList(js.dom.Node.getElementsByClassName(this._document, cssClass));
    },

    getByName : function (name) {
        return this.getElement(js.dom.Node.querySelector(this._document, $format("[name='%s'],[data-name='%s']", name, name)));
    },

    findByName : function (name) {
        return this.getEList(js.dom.Node.querySelectorAll(this._document, $format("[name='%s'],[data-name='%s']", name, name)));
    },

    serialize : function () {
        return new XMLSerializer().serializeToString(this._document);
    },

    // ------------------------------------------------------------------------
    // XPath evaluation utility methods

    XPATH_NODE : 9,

    XPATH_NODESET : 5,

    evaluateXPathNode : function (node, xpath) {
        if (!xpath) {
            return null;
        }
        var node = this._evaluate(node, xpath, this.XPATH_NODE);
        return node ? this.getElement(node) : null;
    },

    evaluateXPathNodeList : function (node, xpath) {
        if (!xpath) {
            return this.getEList(null);
        }
        var xpathResult = this._evaluate(node, xpath, this.XPATH_NODESET);
        return this.getEList(xpathResult);
    },

    _evaluate : function (node, xpath, type) {
        var xpathResult = this._document.evaluate(xpath, node, null, type, null);
        if (type === this.XPATH_NODE) {
            node = xpathResult.singleNodeValue;
            if (node === null) {
                return null;
            }
            return node.nodeType === Node.ELEMENT_NODE ? node : null;
        }

        var elementsArray = [], node = xpathResult.iterateNext();
        // collect only element nodes from result; assert node type is element
        while (node !== null) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                elementsArray.push(node);
            }
            node = xpathResult.iterateNext();
        }
        return new js.dom.NodeList(elementsArray);
    },

    // ------------------------------------------------------------------------
    // j(s)-lib extensions to Baby DOM Document interface

    on : function (type, listener, scope, capture) {
        if (js.event.EventsMap.handle(this, arguments)) {
            return this;
        }

        if (typeof capture === "undefined") {
            capture = false;
        }
        this._domEvents.addListener(type, listener, scope, capture);
        return this;
    },

    un : function (type, listener, capture) {
        if (typeof capture === "undefined") {
            capture = false;
        }
        this._domEvents.removeListener(type, listener, capture);
        return this;
    },

    getElement : function (node) {
        // undocumented feat: if argument is node list extract first node
        if (js.lang.Types.isNodeList(node)) {
            node = node.item(0);
        }
        if (!node) {
            return null;
        }
        var el = js.dom.Node.getElement(node);
        if (el !== null) {
            return el;
        }

        var className = js.dom.Node.getElementClassName(node);
        if (className === null) {
            className = this._getStandardElementClassName(node);
        }
        // forName implements synchronous lazy loading so next call may block user interface
        var clazz = js.lang.Class.forName(className);
        return js.lang.Types.isElement(clazz) ? new clazz(this, node) : null;
    },

    getEList : function (nodeList) {
        if (!nodeList) {
            nodeList = new js.dom.NodeList();
        }
        return new js.dom.EList(this, nodeList);
    },

    _getStandardElementClassName : function (node) {
        switch (node.nodeName.toLowerCase()) {
        case "a":
            return "js.dom.Anchor";

        case "img":
            return "js.dom.Image";

        case "form":
            return "js.dom.Form";

        case "input":
            switch (node.getAttribute("type")) {
            case "checkbox":
                return "js.dom.Checkbox";
            case "radio":
                return "js.dom.Radio";
            case "file":
                return "js.dom.FileInput";
            case "email":
                return "js.dom.Email";
            case "tel":
                return "js.dom.Phone";
            }
            // fall throw next case

        case "textarea":
            return "js.dom.Control";

        case "button":
            return "js.dom.Button";

        case "select":
            return "js.dom.Select";

        case "option":
            return "js.dom.Element";

        case "iframe":
            return "js.dom.IFrame";

        default:
            return "js.dom.Element";
        }
    },

    inject : function (selector, value) {
        var el = this.getByCss(selector);
        if (el !== null) {
            this._template.injectElement(el, value);
        }
        return this;
    },

    equals : function (doc) {
        if (!(doc && doc instanceof js.dom.Document)) {
            return false;
        }
        return this._document === doc._document;
    },

    toString : function () {
        return "js.dom.Document";
    }
};
$extends(js.dom.Document, Object);

$legacy(js.ua.Engine.TRIDENT, function () {
    js.dom.Document.prototype._evaluate = function (node, xpath, type) {
        // select language compatibility; without it IE uses a private variant with couple differences
        this._document.setProperty("SelectionLanguage", "XPath");

        if (node.nodeType === Node.ELEMENT_NODE) {
            // prefix xpath expression with path to node from document root
        }

        var nodeList = node.selectNodes(xpath);
        if (type === this.XPATH_NODE) {
            return nodeList.item(0);
        }
        return nodeList;
    };

    js.dom.Document.prototype._importNode = function (foreignNode) {
        switch (foreignNode.nodeType) {
        case Node.ELEMENT_NODE:
            var node = this._document.createElement(foreignNode.nodeName);
            for (var i = 0, attr; i < foreignNode.attributes.length; ++i) {
                attr = foreignNode.attributes.item(i);
                if (attr.nodeName !== "data-back-ref") {
                    node.setAttribute(attr.nodeName, attr.value);
                }
            }
            for (i = 0; i < foreignNode.childNodes.length; ++i) {
                node.appendChild(this._importNode(foreignNode.childNodes.item(i)));
            }
            return node;

        case Node.TEXT_NODE:
        case Node.CDATA_SECTION_NODE:
            return this._document.createTextNode(foreignNode.nodeValue);

        case Node.COMMENT_NODE:
            return this._document.createComment(foreignNode.nodeValue);
        }
    };

    js.dom.Document.prototype._getNodeById = function (id) {
        try {
            return this._document.getElementById(id);
        } catch (e) {
            return null;
        }
    };

    js.dom.Document.prototype.isXML = function () {
        return typeof this._document.xml !== "undefined";
    };

    js.dom.Document.prototype.serialize = function () {
        if (typeof this._document.xml !== "undefined") {
            return this._document.xml;
        }
        if (typeof this._document.html !== "undefined") {
            return this._document.html;
        }
        if (typeof XMLSerializer !== "undefined") {
            return new XMLSerializer().serializeToString(this._document);
        }
        throw new js.dom.DomException("js.dom.Document#serialize", "Missing DOM serializer support.");
    };
});

$legacy(js.ua.Engine.WEBKIT || js.ua.Engine.MOBILE_WEBKIT, function () {
    js.dom.Document.prototype.isXML = function () {
        return this._document.xmlVersion == true;
    };
});

$legacy(js.ua.Engine.GECKO, function () {
    js.dom.Document.prototype.isXML = function () {
        return this._document.contentType.indexOf("xml") !== -1;
    };
});

$legacy(js.ua.Engine.PRESTO, function () {
    js.dom.Document.prototype.isXML = function () {
        return typeof XMLDocument !== "undefined" && this._document instanceof XMLDocument;
    };
});
$package('js.lang');

js.lang.Exception = function() {
	this.name = 'j(s)-lib exception';

	this.message = js.lang.Types.isString(arguments[0]) ? $format(arguments) : "";
};

js.lang.Exception.prototype = {
	toString : function() {
		return 'js.lang.Exception';
	}
};
$extends(js.lang.Exception, Error);
$package('js.dom');

js.dom.DomException = function() {
    this.$super(arguments);

    this.name = 'j(s)-lib DOM exception';
};

js.dom.DomException.prototype =
{
    toString: function() {
        return 'js.dom.DomException';
    }
};
$extends(js.dom.DomException, js.lang.Exception);
$package("js.lang");

js.lang.Iterator = {
    hasNext : function () {
    },

    next : function () {
    }
};
$package("js.dom");

js.dom.EList = function (ownerDoc, nodeList) {
    if (nodeList === null) {
        nodeList = new js.dom.NodeList();
    }
    this._ownerDoc = ownerDoc;

    this._nodeList = nodeList;
};

js.dom.EList.prototype = {
    size : function () {
        return this._nodeList.length;
    },

    item : function (index) {
        if (typeof index === "undefined") {
            index = 0;
        }
        return this._ownerDoc.getElement(this._nodeList.item(index));
    },

    isEmpty : function () {
        return this._nodeList.length === 0;
    },

    remove : function () {
        // because NodeList may be live we need to cache all elements references first
        // note that not all node lists are live, e.g. querySelect returns static NodeList
        // but I decided to play safe and cache both cases, even if sub-optimal

        var nodes = [], i, el;
        for (i = 0; i < this._nodeList.length; ++i) {
            nodes.push(this._nodeList.item(i));
        }

        for (i = 0; i < nodes.length; ++i) {
            el = this._ownerDoc.getElement(nodes[i]);
            if (el) {
                el.remove();
            }
        }

        // if this._nodeList is a live NodeList, it is already empty because its elements
        // was removed from document tree and next statement does not harm
        // if node list is static, i.e. not live, clear it by setting its length to zero
        // to sum-up, after this method exit this._nodeList is empty
        nodes.length = 0;
    },

    call : function (methodName) {
        var it = this.it(), el;
        while (it.hasNext()) {
            el = it.next();
            if (js.lang.Types.isFunction(el[methodName])) {
                el[methodName].apply(el, $args(arguments, 1));
            }
        }
        return this;
    },

    // ------------------------------------------------------------------------
    // j(s)-lib extensions to Baby DOM EList interface

    forEach : function (callback, scope) {
        if (typeof scope === "undefined") {
            scope = window;
        }
        for (var i = 0; i < this.size(); i++) {
            callback.call(scope, this.item(i), i, this);
        }
    },

    addCssClass : function (cssClass) {
        this.call("addCssClass", cssClass);
        return this;
    },

    removeCssClass : function (cssClass) {
        this.call("removeCssClass", cssClass);
        return this;
    },

    toggleCssClass : function (cssClass) {
        this.call("toggleCssClass", cssClass);
        return this;
    },

    it : function () {
        return new js.dom.EList.Iterator(this);
    },

    on : function (type, listener, scope, capture) {
        this.call("on", type, listener, scope, capture);
        return this;
    },

    un : function (type, listener) {
        this.call("un", type, listener);
        return this;
    },

    _containsOnlyElements : function (nodeList) {
        for (var i = 0; i < nodeList.length; ++i) {
            if (nodeList.item(i).nodeType !== Node.ELEMENT_NODE) {
                return false;
            }
        }
        return true;
    },

    toString : function () {
        return "js.dom.EList";
    }
};
$extends(js.dom.EList, Object);

js.dom.EList.Iterator = function (elist) {
    this._elist = elist;

    this._index = 0;
};

js.dom.EList.Iterator.prototype = {
    hasNext : function () {
        return this._index < this._elist.size();
    },

    next : function () {
        return this._elist.item(this._index++);
    },

    toString : function () {
        return "js.dom.EList.Iterator";
    }
};
$extends(js.dom.EList.Iterator, Object);
$implements(js.dom.EList.Iterator, js.lang.Iterator);
$package("js.dom");

js.dom.Email = function (ownerDoc, node) {
    this.$super(ownerDoc, node);
};

js.dom.Email.prototype = {
    EMAIL_REX : /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,

    isValid : function () {
        var value = this._getValue();
        var valid = false;

        if (this.hasCssClass(this.CSS_OPTIONAL) && !value) {
            // an optional and empty control is always valid
            return valid = true;
        }
        else {
            valid = this.EMAIL_REX.test(value);
        }

        this.addCssClass(this.CSS_INVALID, !valid);
        return valid;
    },

    toString : function () {
        return "js.dom.Email";
    }
};
$extends(js.dom.Email, js.dom.Control);
$package("js.dom");

js.dom.FileInput = function (ownerDoc, node) {
    this.$super(ownerDoc, node);
    };

js.dom.FileInput.prototype = {
    setValue : function (value) {
        },

    forEachItem : function (callback, scope) {
        var files = this._node.files;
        for (var i = 0; i < files.length; ++i) {
            callback.call(scope || window, {
                name : this.getName(),
                value : files.item(i),
                extra : files.item(i).name
            });
        }
    },

    forEachFile : function (callback, scope) {
        var files = this._node.files;
        for (var i = 0; i < files.length; ++i) {
            callback.call(scope || window, files.item(i));
        }
    },

    toString : function () {
        return "js.dom.FileInput";
    }
};
$extends(js.dom.FileInput, js.dom.Control);
$package("js.dom");

js.dom.Form = function (ownerDoc, node) {
    this.$super(ownerDoc, node);
    this.setAttr("novalidate", "novalidate");
    this._node.method = js.net.Method.POST;
    this._setEnctype("multipart/form-data");

    // focus event does not bubble so we need to use capture to dispatch it first to this form element
    // on focus handler we take care to set focus on original target
    this.on("focus", this._onFocus, this, true);

    this._iterable = new js.dom.ControlsIterable(this);
};

js.dom.Form.prototype = {
    setObject : function (object) {
        this._iterable.forEachAll(function (control) {
            var opp = this._getOPPath(control), value;
            if (opp !== null) {
                value = js.lang.OPP.get(object, opp);
                if (typeof value !== "undefined") {
                    control.setValue(value);
                }
            }
        }, this);
        return this.focus();
    },

    getObject : function (object) {
        if (typeof object === "undefined") {
            object = {};
        }
        this._iterable.forEachAll(function (control) {
            var opp = this._getOPPath(control);
            if (opp !== null) {
                js.lang.OPP.set(object, opp, control.getValue());
            }
        }, this);
        return object;
    },

    _getOPPath : function (control) {
        var name = control.getName();
        return name !== null ? js.util.Strings.toScriptCase(name) : null;
    },

    isValid : function () {
        var valid = true;
        this._iterable.forEach(function (control) {
            valid = control.isValid() && valid;
        });
        return valid;
    },

    focus : function () {
        var autofocusControl = this.getByCss("[autofocus]");
        if (autofocusControl !== null) {
            autofocusControl.focus();
        }
        return this;
    },

    getAction : function () {
        return this._node.action || null;
    },

    submit : function () {
        this._node.submit();
    },

    reset : function () {
        this._iterable.forEach(function (control) {
            control.reset();
        });
        return this.focus();
    },

    toFormData : function () {
        function normalize (value) {
            if (value instanceof Date) {
                value = js.lang.JSON.stringify(value);
                if (value.charAt(0) === '"') {
                    value = value.substr(1, value.length - 2);
                }
            }
            return value;
        }

        var formData = new FormData();
        this._iterable.forEachAll(function (control) {
            control.forEachItem(function (item) {
                if (typeof item.extra === "undefined") {
                    formData.append(item.name, normalize(item.value));
                }
                else {
                    // extra can be, for example, file name in case item is a File
                    formData.append(item.name, normalize(item.value), item.extra);
                }
            }, this);
        });
        return formData;
    },

    addHidden : function (name, value) {
        var hidden = this.getByCss("input[name='%s']", name);
        if (hidden !== null) {
            hidden.setValue(value);
            return hidden;
        }
        hidden = this._ownerDoc.createElement("input", "type", "hidden", "name", name, "value", value);
        var el = this.getFirstChild();
        if (el !== null) {
            el.insertBefore(hidden);
        }
        else {
            this.addChild(hidden);
        }
        return hidden;
    },

    removeHidden : function (name) {
        var hidden = this.getByCss("input[name='%s']", name);
        if (hidden === null) {
            return this;
        }
        var type = hidden.getAttr("type");
        if (type !== "hidden") {
            return this;
        }
        hidden.remove();
        return this;
    },

    _onFocus : function (ev) {
        ev.target.focus();
    },

    _setEnctype : function (enctype) {
        this._node.enctype = enctype;
    },

    toString : function () {
        return "js.dom.Form";
    }
};
$extends(js.dom.Form, js.dom.Element);

$legacy(js.ua.Engine.TRIDENT, function () {
    js.dom.Form.prototype._setEnctype = function (enctype) {
        this._node.encoding = enctype;
        return this;
    };
});
$package('js.dom');

js.dom.IFrame = function(ownerDoc, node) {
	this.$super(ownerDoc, node);

	this._window = null;

	this._innerDoc = null;
};

js.dom.IFrame.prototype = {
	setSrc : function(src) {
		this._node.src = src;
		return this;
	},

	getSrc : function() {
		return this._node.src;
	},

	getWindow : function() {
		if (this._window === null) {
			this._window = new js.ua.Window(this._ownerDoc.getParentWindow(), this._node.contentWindow);
		}
		return this._window;
	},

	getInnerDoc : function() {
		if (this._innerDoc === null) {
			this._innerDoc = new js.dom.Document(this._node.contentWindow.document);
		}
		return this._innerDoc;
	},

	getLocation : function() {
		return this._node.contentWindow.location.toString();
	},

	toString : function() {
		return 'js.dom.IFrame';
	}
};
$extends(js.dom.IFrame, js.dom.Element);
$package('js.dom');

js.dom.Image = function (ownerDoc, node) {
    this.$super(ownerDoc, node);
    };

js.dom.Image.prototype = {
    _TRANSPARENT_DOT : 'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',

    reset : function () {
        this._node.src = this._TRANSPARENT_DOT;
        return this;
    },

    setSrc : function (src) {
        if (!src || /^\s+|(?:&nbsp;)+$/g.test(src)) {
            return this.reset();
        }
        if (this._format !== null) {
            src = this._format.format(src);
        }
        this._node.src = src;
        return this;
    },

    getSrc : function () {
        return this._node.src;
    },

    setWidth : function (width) {
        return this.setAttr("width", width.toString());
    },

    setHeight : function (height) {
        return this.setAttr("height", height.toString());
    },

    reload : function (src) {
        var i = src.indexOf('?');
        if (i !== -1) {
            src = src.substring(0, i);
        }
        this._node.src = src + '?' + Math.random().toString(36).substr(2);
        return this;
    },

    isValid : function () {
        return this._node.src && this._node.src !== this._TRANSPARENT_DOT;
    },

    toString : function () {
        return 'js.dom.Image';
    }
};
$extends(js.dom.Image, js.dom.Element);
$package("js.dom");

js.dom.Node = {
    _BACK_REF : "__js_element__",

    _DATA_CLASS : "data-class",

    _DATA_FORMAT : "data-format",

    setElement : function (node, el) {
        node[js.dom.Node._BACK_REF] = el;
    },

    getElement : function (node) {
        var el = node[js.dom.Node._BACK_REF];
        return el ? el : null;
    },

    removeBackRef : function (node) {
        if (node[js.dom.Node._BACK_REF]) {
            delete node[js.dom.Node._BACK_REF];
        }
    },

    setElementClassName : function (node, className) {
        node.setAttribute(this._DATA_CLASS, className);
    },

    getElementClassName : function (node) {
        var className = node.getAttribute(this._DATA_CLASS);
        return className ? className : null;
    },

    getFormatName : function (node) {
        var formatName = node.getAttribute(this._DATA_FORMAT);
        return formatName ? formatName : null;
    },

    firstChild : function (node, nodeType) {
        return node ? js.dom.Node._getNeighbor(node.firstChild, nodeType || Node.ELEMENT_NODE, "next") : null;
    },

    firstElementChild : function (node) {
        return node ? node.firstElementChild : null;
    },

    lastChild : function (node, nodeType) {
        return node ? js.dom.Node._getNeighbor(node.lastChild, nodeType || Node.ELEMENT_NODE, "previous") : null;
    },

    lastElementChild : function (node) {
        return node ? node.lastElementChild : null;
    },

    nextSibling : function (node, nodeType) {
        return node ? js.dom.Node._getNeighbor(node.nextSibling, nodeType || Node.ELEMENT_NODE, "next") : null;
    },

    nextElementSibling : function (node) {
        return node ? node.nextElementSibling : null;
    },

    previousSibling : function (node, nodeType) {
        return node ? js.dom.Node._getNeighbor(node.previousSibling, nodeType || Node.ELEMENT_NODE, "previous") : null;
    },

    previousElementSibling : function (node) {
        return node ? node.previousElementSibling : null;
    },

    childElementCount : function (node) {
        return node.childElementCount;
    },

    hasChildren : function (node, nodeType) {
        if (!node) {
            return false;
        }
        return js.dom.Node.firstChild(node, nodeType || Node.ELEMENT_NODE) !== null;
    },

    getElementByClass : function (context, clazz) {
        var className = js.lang.Types.isFunction(clazz) ? clazz.prototype.toString() : clazz;
        return js.dom.Node.querySelector(context, "[data-class='" + className + "']");
    },

    getElementsByClass : function (context, clazz) {
        var className = js.lang.Types.isFunction(clazz) ? clazz.prototype.toString() : clazz;
        return js.dom.Node.querySelectorAll(context, "[data-class='" + className + "']");
    },

    getElementsByTagName : function (context, tag) {
        return context && tag ? context.getElementsByTagName(tag) : new js.dom.NodeList();
    },

    getElementsByClassName : function (context, cssClass) {
        if (!context) {
            return new js.dom.NodeList();
        }
        return context.getElementsByClassName(cssClass);
    },

    querySelector : function (context, selectors) {
        if (!context) {
            return null;
        }
        if (!selectors) {
            return null;
        }
        try {
            return context.querySelector(selectors);
        } catch (e) {
            // apparently querySelector throws exception only for syntax error on selectors
            // excerpt from MDN: Throws a SYNTAX_ERR exception if the specified group of selectors is invalid.
            return null;
        }
    },

    querySelectorAll : function (context, selectors) {
        if (!context) {
            return new js.dom.NodeList();
        }
        if (!selectors) {
            return new js.dom.NodeList();
        }
        try {
            return context.querySelectorAll(selectors);
        } catch (e) {
            // apparently querySelectorAll throws exception only for syntax error on selectors
            // excerpt from MDN: Throws a SYNTAX_ERR exception if the specified group of selectors is invalid.
            return new js.dom.NodeList();
        }
    },

    _getNeighbor : function (node, nodeType, direction, predicate) {
        if (!predicate) {
            predicate = function () {
                return true;
            };
        }
        while (!!node) {
            if (node.nodeType === nodeType && predicate(node)) {
                return node;
            }
            node = node[direction + "Sibling"];
        }
        return null;
    },

    toString : function (node) {
        if (!node) {
            return "undefined node";
        }
        var s = node.nodeName.toLowerCase();
        if (s === "input") {
            s += ("[" + node.getAttribute("type") + "]");
        }
        return s;
    }
};

js.dom.Node.Iterator = function (node) {
    this._child = js.dom.Node._getNeighbor(node ? node.firstChild : null, Node.ELEMENT_NODE, "next");
};

js.dom.Node.Iterator.prototype = {
    hasNext : function () {
        return this._child !== null;
    },

    next : function () {
        if (this._child === null) {
            return null;
        }
        var node = this._child;
        this._child = js.dom.Node._getNeighbor(this._child.nextSibling, Node.ELEMENT_NODE, "next");
        return node;
    },

    toString : function () {
        return "js.dom.Node.Iterator";
    }
};
$extends(js.dom.Node.Iterator, Object);
$implements(js.dom.Node.Iterator, js.lang.Iterator);

$legacy(typeof Node === "undefined", function () {
    Node = {
        ELEMENT_NODE : 1,
        ATTRIBUTE_NODE : 2,
        TEXT_NODE : 3,
        CDATA_SECTION_NODE : 4,
        ENTITY_REFERENCE_NODE : 5,
        ENTITY_NODE : 6,
        PROCESSING_INSTRUCTION_NODE : 7,
        COMMENT_NODE : 8,
        DOCUMENT_NODE : 9,
        DOCUMENT_TYPE_NODE : 10,
        DOCUMENT_FRAGMENT_NODE : 11,
        NOTATION_NODE : 12
    };
});

$legacy(js.ua.Engine.TRIDENT, function () {
    js.dom.Node._backRefs = {};

    js.dom.Node.setElement = function (node, el) {
        try {
            node[js.dom.Node._BACK_REF] = el;
        } catch (e) {
            var backRef = node.getAttribute("data-back-ref");
            if (!backRef) {
                backRef = js.util.ID();
                node.setAttribute("data-back-ref", backRef);
            }
            js.dom.Node._backRefs[backRef] = el;
        }
    };

    js.dom.Node.getElement = function (node) {
        var el = node[js.dom.Node._BACK_REF];
        if (typeof el !== "undefined") {
            return el;
        }
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return null;
        }
        var backRef = node.getAttribute("data-back-ref");
        if (!backRef) {
            return null;
        }
        el = js.dom.Node._backRefs[backRef];
        return el ? el : null;
    };

    js.dom.Node.removeBackRef = function (node) {
        if (node[js.dom.Node._BACK_REF]) {
            delete node[js.dom.Node._BACK_REF];
            return;
        }
        var backRef = node.getAttribute("data-back-ref");
        if (backRef && js.dom.Node._backRefs[backRef]) {
            delete js.dom.Node._backRefs[backRef];
        }
    };
});

$legacy(js.ua.Engine.TRIDENT, function () {
    js.dom.Node.getElementsByTagName = function (node, tag) {
        if (!node || !tag) {
            return new js.dom.NodeList();
        }
        if (tag !== "*") {
            return node.getElementsByTagName(tag);
        }
        // it seems IE includes comment nodes when get elements by wild card
        var nodeList = node.getElementsByTagName("*"), result = new js.dom.NodeList();
        for (var i = 0; i < nodeList.length; i++) {
            node = nodeList.item(i);
            if (node.nodeType === Node.ELEMENT_NODE) {
                result.push(node);
            }
        }
        return nodeList;
    };
});

$legacy(js.ua.Engine.TRIDENT, function () {
    js.dom.Node.firstElementChild = function (node) {
        return node ? js.dom.Node._getNeighbor(node.firstChild, Node.ELEMENT_NODE, "next") : null;
    };

    js.dom.Node.lastElementChild = function (node) {
        return node ? js.dom.Node._getNeighbor(node.lastChild, Node.ELEMENT_NODE, "previous") : null;
    };

    js.dom.Node.nextElementSibling = function (node) {
        return node ? js.dom.Node._getNeighbor(node.nextSibling, Node.ELEMENT_NODE, "next") : null;
    };

    js.dom.Node.previousElementSibling = function (node) {
        return node ? js.dom.Node._getNeighbor(node.previousSibling, Node.ELEMENT_NODE, "previous") : null;
    };

    js.dom.Node.childElementCount = function (node) {
        var child = this.firstElementChild(node);
        var count = 0;
        while (child !== null) {
            ++count;
            child = this.nextElementSibling(child);
        }
        return count;
    };

    js.dom.Node.getElementsByClassName = function (node, cssClass) {
        return node && cssClass ? node.querySelectorAll("." + cssClass) : new js.dom.NodeList();
    };
});
$package('js.dom');

js.dom.NodeList = function (array) {
    var nodeList = typeof array !== 'undefined' ? array : [];

    nodeList.item = function (index) {
        return this[index];
    };

    return nodeList;
};
$extends(js.dom.NodeList, Object);
$package("js.dom");

js.dom.Phone = function (ownerDoc, node) {
    this.$super(ownerDoc, node);
};

js.dom.Phone.prototype = {
    PHONE_REX : /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/im,

    isValid : function () {
        var value = this._getValue();
        var valid = false;

        if (this.hasCssClass(this.CSS_OPTIONAL) && !value) {
            // an optional and empty control is always valid
            return valid = true;
        }
        else {
            valid = this.PHONE_REX.test(value);
        }

        this.addCssClass(this.CSS_INVALID, !valid);
        return valid;
    },

    toString : function () {
        return "js.dom.Phone";
    }
};
$extends(js.dom.Phone, js.dom.Control);
$package('js.dom');

js.dom.Radio = function(ownerDoc, node) {
	this.$super(ownerDoc, node);
	};

js.dom.Radio.prototype = {
	setValue : function(value) {
		this._node.checked = (this._node.value === value);
		return this;
	},

	toString : function() {
		return 'js.dom.Radio';
	}
};
$extends(js.dom.Radio, js.dom.Checkbox);
$package("js.dom");

js.dom.Select = function (ownerDoc, node) {
    this.$super(ownerDoc, node);
    this._events = this.getCustomEvents();
    this._events.register("updated");

    var restPath = this.getAttr("data-load");
    if (restPath !== null) {
        $rest(restPath, this.setOptions, this);
    }

    this.on("change", this._onChange, this);
};

js.dom.Select.prototype = {
    _DEF_OPTION_CSS : "default-option",

    load : function (remoteClassStub, remoteMethod) {
        var args = $args(arguments, 2);
        args.push(this.setOptions); // callback
        args.push(this); // callback scope
        remoteClassStub[remoteMethod].apply(remoteClassStub, args);
        return this;
    },

    setOptions : function (items) {
        // remove all children less those tagged as this._DEF_OPTION_CSS
        var child = this.getFirstChild(), nextSibling;
        while (child !== null) {
            nextSibling = child.getNextSibling();
            if (!child.hasCssClass(this._DEF_OPTION_CSS)) {
                child.remove();
            }
            child = nextSibling;
        }

        for (var i = 0, item, option; i < items.length; i++) {
            item = items[i];
            option = this._ownerDoc._document.createElement("option");

            if (js.lang.Types.isString(item)) {
                option.text = item;
            }
            else if (typeof item.id !== "undefined") {
                option.text = item.name;
                option.value = item.id.toString();

                if (typeof this._data === "undefined") {
                    this._data = {};
                }
                this._data[option.value] = item;
            }
            else {
                option.text = item.text;
                option.value = typeof item.value !== "undefined" ? item.value : item.text;
            }
            this._node.add(option, null);
        }

        this._events.fire("updated", this._getOption());
        return this;
    },

    setValue : function (value) {
        var i, opts, l;

        this._node.selectedIndex = 0;
        for (i = 0, opts = this._node.options, l = opts.length; i < l; i++) {
            if (opts[i].value == value || opts[i].text == value) {
                this._node.selectedIndex = i;
                break;
            }
        }
        return this;
    },

    reset : function () {
        this._node.selectedIndex = 0;
        return this;
    },

    getValue : function () {
        return this._getOption().value;
    },

    getText : function () {
        return this._getOption().text;
    },

    getObject : function () {
        return this._getOption().data;
    },

    isEmpty : function () {
        return this.getIndex() === -1;
    },

    isValid : function () {
        return !this.isEmpty();
    },

    getIndex : function () {
        return this._node.selectedIndex;
    },

    equals : function (value) {
        return this._getOption().value == value;
    },

    _onChange : function (ev) {
        this._events.fire("updated", this._getOption());
    },

    _getOption : function () {
        var idx, option;

        // if this select is empty returns null option
        if (this._node.options.length === 0) {
            return {
                value : null,
                text : null,
                data : null
            };
        }

        idx = this._node.selectedIndex;
        // if no selection made consider the first option
        if (idx === -1) {
            idx = 0;
        }
        option = this._node.options[idx];
        return {
            value : option.value,
            text : option.text,
            data : typeof this._data !== "undefined" ? this._data[option.value] : null
        };
    },

    toString : function () {
        return "js.dom.Select";
    }
};
$extends(js.dom.Select, js.dom.Control);
$package("js.dom");

js.dom.Style = function (el) {
    this._node = el._node;
};

js.dom.Style.prototype = {
    set : function (style, value) {
        if (js.lang.Types.isObject(style)) {
            for ( var s in style) {
                this.set(s, style[s]);
            }
            return this;
        }
        this._node.style[js.util.Strings.toScriptCase(style)] = value;
        return this;
    },

    get : function (style) {
        if (!this._node.style) {
            return null;
        }
        if (!style) {
            return null;
        }

        style = js.util.Strings.toScriptCase(style);
        var v = this.getComputedStyle(style);
        var isNull = v === null;
        if (js.ua.Engine.TRIDENT && style === "zIndex" && v === 0) {
            isNull = true;
        }
        if (isNull) {
            return null;
        }
        if (!js.lang.Types.isString(v)) {
            v = v.toString();
        }
        return v;
    },

    getComputedStyle : function (style) {
        // n.b. computed style returns a read-only style object
        var value = window.getComputedStyle(this._node).getPropertyValue(style);
        return (typeof value === "undefined" || value.length === 0) ? null : value;
    },

    getClientRect : function () {
        return this._node.getBoundingClientRect();
    },

    remove : function (style) {
        this._node.style[js.util.Strings.toScriptCase(style)] = "";
        return this;
    },

    has : function (style) {
        var value = this.get(style);
        if (value === null) {
            return false;
        }
        if (arguments.length === 1) {
            return !!value;
        }
        for (var i = 1; i < arguments.length; ++i) {
            if (value === arguments[i]) {
                return true;
            }
        }
        return false;
    },

    isVisible : function () {
        var n = this._node;
        while (n) {
            if (n.style.display.toLowerCase() === "none") {
                return false;
            }
            if (n.style.visibility.toLowerCase() === "hidden") {
                return false;
            }
            if (n.nodeName.toLowerCase() === "body") {
                return true;
            }
            n = n.parentNode;
        }
        return false;
    },

    getWidth : function () {
        return parseInt(this.getComputedStyle("width"), 10);
    },

    setWidth : function (width) {
        if (js.lang.Types.isNumber(width)) {
            width = width.toString(10) + "px";
        }
        return this.set("width", width);
    },

    getHeight : function () {
        return parseInt(this.getComputedStyle("height"), 10);
    },

    setHeight : function (height) {
        if (js.lang.Types.isNumber(height)) {
            height = height.toString(10) + "px";
        }
        return this.set("height", height);
    },

    getBorderWidth : function () {
        return {
            top : parseInt(this.getComputedStyle("border-top-width"), 10),
            right : parseInt(this.getComputedStyle("border-right-width"), 10),
            bottom : parseInt(this.getComputedStyle("border-bottom-width"), 10),
            left : parseInt(this.getComputedStyle("border-left-width"), 10)
        };
    },

    getPadding : function () {
        return {
            top : parseInt(this.getComputedStyle("padding-top"), 10),
            right : parseInt(this.getComputedStyle("padding-right"), 10),
            bottom : parseInt(this.getComputedStyle("padding-bottom"), 10),
            left : parseInt(this.getComputedStyle("padding-left"), 10)
        };
    },

    getMargin : function () {
        return {
            top : parseInt(this.getComputedStyle("margin-top"), 10),
            right : parseInt(this.getComputedStyle("margin-right"), 10),
            bottom : parseInt(this.getComputedStyle("margin-bottom"), 10),
            left : parseInt(this.getComputedStyle("margin-left"), 10)
        };
    },

    setPosition : function (position) {
        if (position) {
            this.set("position", position);
        }
        return this;
    },

    getPosition : function () {
        return this.get("position");
    },

    isPositioned : function () {
        var p = this.get("position");
        return p === "absolute" || p === "fixed" || p === "relative";
    },

    setTop : function (top) {
        return this.set("top", Math.round(top).toString(10) + "px");
    },

    setRight : function (right) {
        return this.set("right", Math.round(right).toString(10) + "px");
    },

    setBottom : function (bottom) {
        return this.set("bottom", Math.round(bottom).toString(10) + "px");
    },

    setLeft : function (left) {
        return this.set("left", Math.round(left).toString(10) + "px");
    },

    getPageLeft : function () {
        var left = 0;
        for (var n = this._node; n; n = n.offsetParent) {
            left += n.offsetLeft;
        }
        return left;
    },

    getPageTop : function () {
        var top = 0;
        for (var n = this._node; n; n = n.offsetParent) {
            top += n.offsetTop;
        }
        return top;
    },

    swap : function (styles, fn, scope) {
        var old = {};
        for ( var name in styles) {
            old[name] = this._node.style[name];
            this._node.style[name] = styles[name];
        }
        var value = fn.apply(scope, $args(arguments, 3));
        for ( var name in styles) {
            this._node.style[name] = old[name];
        }
        return value;
    },

    toString : function () {
        return "js.dom.Style";
    }
};
$extends(js.dom.Style, Object);

$legacy(js.ua.Engine.TRIDENT, function () {
    js.dom.Style.prototype.getComputedStyle = function (style) {
        var value;
        if (window.getComputedStyle) {
            value = window.getComputedStyle(this._node).getPropertyValue(style);
        }
        else if (this._node.currentStyle) {
            value = this._node.currentStyle[js.util.Strings.toScriptCase(style)];
        }
        return (typeof value === "undefined" || value.length === 0) ? null : value;
    };
});
$package("js.dom.template");

js.dom.template.ArabicNumeralNumbering = function() {
};

js.dom.template.ArabicNumeralNumbering.prototype = {
	format : function(index) {
		return index.toString(10);
	},

	toString : function() {
		return "js.dom.template.ArabicNumeralNumbering";
	}
};
$extends(js.dom.template.ArabicNumeralNumbering, Object);
$package('js.dom.template');

js.dom.template.Operator = function (content) {
    this._content = content;
};

js.dom.template.Operator.prototype = {
    _OBJECT_SETTER : "setObject",

    exec : function (element, scope, operand) {
        // precondition - only js.dom.Element has method setObject; all others from hierarchy inherit it
        // if a user defined type implements its own object setter templates operator is not longer executed
        // is the method implementor responsibility to call super or take what ever measure to initialize its sub-graph

        // if element is not js.dom.Element and if has its own object setter delegates operator execution to element
        // this logic is implemented here because can be more operators using it, e.g. data-object, data-list, etc.
        // note that it uses private access to class construction implementation
        if (element.__ctor__ !== js.dom.Element && element.__ctor__ && element.__ctor__.prototype.hasOwnProperty(this._OBJECT_SETTER)) {
            $trace("js.dom.template.Operator#exec", "User defined |%s| object setter for operator |%s|.", element, this);
            $debug("js.dom.template.Operator#exec", "User defined object setter |%s#setObject(%s)|.", element.toString(), operand);
            try {
                element.setObject(this._content.getValue(scope, operand));
            } catch (er) {
                this._error(element, scope, operand, er);
            }
            return;
        }

        try {
            return this._exec(element, scope, operand);
        } catch (er) {
            this._error(element, scope, operand, er);
        }
    },

    _error : function (element, scope, operand, er) {
        var message = $format("%%s:\r\n" + //
        "\t- element: %s\r\n" + //
        "\t- class: %s\r\n" + //
        "\t- operator: %s\r\n" + //
        "\t- operand: %s\r\n" + // " +
        "\t- scope: %s\r\n" + // " +
        "\t- cause: %%s", element, element.toString(), this, operand, scope);

        if (er instanceof js.dom.template.ContentException) {
            $warn("js.dom.template.Operator#exec", message, "Undefined or invalid property", er.message);
            return;
        }

        if (er instanceof js.lang.AssertException) {
            $warn("js.dom.template.Operator#exec", message, "Assertion fails", er.message);
            throw er;
        }

        $error("js.dom.template.Operator#exec", message, "Fatal error", er.message);
        js.ua.System.error(er);
    },

    _exec : function (element, scope, operand) {
    },

    toString : function () {
        return "js.dom.template.Operator";
    }
};
$extends(js.dom.template.Operator, Object);
$package("js.dom.template");

js.dom.template.AttrOperator = function(content) {
    this.$super(content);
};

js.dom.template.AttrOperator.prototype = {
	_exec : function(element, scope, expression) {
		js.util.Strings.parseNameValues(expression).forEach(function(pairs) {
	        var propertyPath = pairs.value;
			var attrName = pairs.name;
			var value = this._content.getValue(scope, propertyPath);

			if (value === null) {
				$warn("js.dom.template.AttrOperator#_exec", "Null property |%s|. Remove %s attribute from element |%s|.", propertyPath, attrName, element);
				element.removeAttr(attrName);
			}
			else {
				if (attrName === "id" && js.lang.Types.isNumber(value)) {
					value = value.toString();
				}
				$debug("js.dom.template.AttrOperator#_exec", "Set element |%s| %s attribute from property |%s|.", element, attrName, propertyPath);
				element.setAttr(attrName, value);
			}
		}, this);
	},

	toString : function() {
		return "js.dom.template.AttrOperator";
	}
};
$extends(js.dom.template.AttrOperator, js.dom.template.Operator);
$package("js.dom.template");

js.dom.template.ConditionalExpression = function (content, scope, expression) {
    this._expression = expression;

    this._not = false;

    this._propertyPath = null;

    this._opcode = js.dom.template.ConditionalExpression.Opcode.NONE;

    this._operand = null;

    this._value = false;

    this._parse();
    this._value = this._evaluate(content.getValue(scope, this._propertyPath));
};

js.dom.template.ConditionalExpression.prototype = {
    value : function () {
        return this._value;
    },

    _parse : function () {
        if (this._expression.charAt(0) === '!') {
            this._not = true;
            this._expression = this._expression.substring(1);
        }

        var builder = "";
        var state = js.dom.template.ConditionalExpression.State.PROPERTY_PATH;

        for (var i = 0, c; i < this._expression.length; ++i) {
            c = this._expression.charAt(i);
            switch (state) {
            case js.dom.template.ConditionalExpression.State.PROPERTY_PATH:
                if (this._isPropertyPathChar(c)) {
                    builder += c;
                    break;
                }
                this._propertyPath = builder;
                builder = "";
                this._opcode = js.dom.template.ConditionalExpression.Opcode.forChar(c);
                state = js.dom.template.ConditionalExpression.State.OPERAND;
                break;

            case js.dom.template.ConditionalExpression.State.OPERAND:
                builder += c;
                break;

            default:
                }
        }

        if (state == js.dom.template.ConditionalExpression.State.PROPERTY_PATH) {
            this._opcode == js.dom.template.ConditionalExpression.Opcode.NONE;
            this._propertyPath = builder;
            this._opcode = js.dom.template.ConditionalExpression.Opcode.NOT_EMPTY;
        }
        else {
            if (builder) {
                // operand string builder may be empty if operand is missing, e.g. 'value='
                this._operand = builder;
            }
        }
    },

    JAVA_IDENTIFIER : /[a-zA-Z0-9._$]/,

    _isPropertyPathChar : function (char) {
        return this.JAVA_IDENTIFIER.test(char);
    },

    _evaluate : function (object) {
        if (this._opcode === js.dom.template.ConditionalExpression.Opcode.INVALID) {
            $warn("js.dom.template.ConditionalExpression#evaluate", "Invalid conditional expression |%s|. Not supported opcode.", this._expression);
            return false;
        }
        var processor = this._getProcessor(this._opcode);

        if (this._operand === null && !processor.acceptNullOperand()) {
            $warn("js.dom.template.ConditionalExpression#evaluate", "Invalid conditional expression |%s|. Missing mandatory operand for operator |%s|.", this._expression, this._opcode);
            return false;
        }
        if (!processor.acceptValue(object)) {
            $warn("js.dom.template.ConditionalExpression#evaluate", "Invalid conditional expression |%s|. Operator |%s| does not accept value type |%s|.", this._expression, this._opcode, object);
            return false;
        }
        if (this._operand !== null && !js.dom.template.ConditionalExpression.OperandFormatValidator.isValid(object, this._operand)) {
            $warn("js.dom.template.ConditionalExpression#evaluate", "Invalid conditional expression |%s|. Operand does not match value type |%s|.", this._expression, object);
            return false;
        }

        var value = processor.evaluate(object, this._operand);
        return this._not ? !value : value;
    },

    _processors : {},

    _getProcessor : function (opcode) {
        var processor = this._processors[opcode];

        if (typeof processor === "undefined") {
            switch (opcode) {
            case js.dom.template.ConditionalExpression.Opcode.NOT_EMPTY:
                processor = new js.dom.template.ConditionalExpression.NotEmptyProcessor();
                break;

            case js.dom.template.ConditionalExpression.Opcode.EQUALS:
                processor = new js.dom.template.ConditionalExpression.EqualsProcessor();
                break;

            case js.dom.template.ConditionalExpression.Opcode.LESS_THAN:
                processor = new js.dom.template.ConditionalExpression.LessThanProcessor();
                break;

            case js.dom.template.ConditionalExpression.Opcode.GREATER_THAN:
                processor = new js.dom.template.ConditionalExpression.GreaterThanProcessor();
                break;

            default:
                }
            this._processors[opcode] = processor;
        }

        return processor;
    },

    toString : function () {
        return "js.dom.template.ConditionalExpression";
    }
};
$extends(js.dom.template.ConditionalExpression, Object);

js.dom.template.ConditionalExpression.Opcode = {
    NONE : 0,

    INVALID : 1,

    NOT_EMPTY : 2,

    EQUALS : 3,

    LESS_THAN : 4,

    GREATER_THAN : 5
};

js.dom.template.ConditionalExpression.Opcode.forChar = function (code) {
    switch (code) {
    case '=':
        return js.dom.template.ConditionalExpression.Opcode.EQUALS;
    case '<':
        return js.dom.template.ConditionalExpression.Opcode.LESS_THAN;
    case '>':
        return js.dom.template.ConditionalExpression.Opcode.GREATER_THAN;
    }
    return js.dom.template.ConditionalExpression.Opcode.INVALID;
};

js.dom.template.ConditionalExpression.State = {
    NONE : 0,

    PROPERTY_PATH : 1,

    OPERAND : 2
};

js.dom.template.ConditionalExpression.Processor = {
    evaluate : function (value, operand) {
    },

    acceptNullOperand : function () {
    },

    acceptValue : function (value) {
    }
};

js.dom.template.ConditionalExpression.NotEmptyProcessor = function () {
};

js.dom.template.ConditionalExpression.NotEmptyProcessor.prototype = {
    evaluate : function (value, operand) {
        if (js.lang.Types.isArray(value)) {
            return value.length > 0;
        }
        return Boolean(value);
    },

    acceptNullOperand : function () {
        return true;
    },

    acceptValue : function (value) {
        return true;
    }
};
$extends(js.dom.template.ConditionalExpression.NotEmptyProcessor, Object);
$implements(js.dom.template.ConditionalExpression.NotEmptyProcessor, js.dom.template.ConditionalExpression.Processor);

js.dom.template.ConditionalExpression.EqualsProcessor = function () {
};

js.dom.template.ConditionalExpression.EqualsProcessor.prototype = {
    evaluate : function (value, operand) {
        if (value === null) {
            return operand === "null";
        }
        if (js.lang.Types.isBoolean(value)) {
            return operand === (value ? "true" : "false");
        }
        if (js.lang.Types.isDate(value)) {
            return this._evaluateDate(value, operand);
        }
        return value == operand;
    },

    _evaluateDate : function (date, dateFormat) {
        var dateItems = js.dom.template.ConditionalExpression.Dates.dateItems(date);
        var matcher = js.dom.template.ConditionalExpression.Dates.dateMatcher(dateFormat);
        for (var i = 0, value; i < dateItems.length; ++i) {
            value = matcher[i + 1];
            if (!value) {
                break;
            }
            if (dateItems[i] !== parseInt(value)) {
                return false;
            }
        }
        return true;
    },

    acceptNullOperand : function () {
        return false;
    },

    acceptValue : function (value) {
        return true;
    }
};
$extends(js.dom.template.ConditionalExpression.EqualsProcessor, Object);
$implements(js.dom.template.ConditionalExpression.EqualsProcessor, js.dom.template.ConditionalExpression.Processor);

js.dom.template.ConditionalExpression.ComparisonProcessor = function () {
};

js.dom.template.ConditionalExpression.ComparisonProcessor.prototype = {
    evaluate : function (value, operand) {
        if (js.lang.Types.isNumber(value)) {
            return this.compare(value, Number(operand));
        }
        if (js.lang.Types.isDate(value)) {
            return this.compare(value, js.dom.template.ConditionalExpression.Dates.parse(operand));
        }
        return false;
    },

    compare : function (value, operand) {
    },

    acceptNullOperand : function () {
        return false;
    },

    acceptValue : function (value) {
        if (js.lang.Types.isNumber(value)) {
            return true;
        }
        if (js.lang.Types.isDate(value)) {
            return true;
        }
        return false;
    }
};
$extends(js.dom.template.ConditionalExpression.ComparisonProcessor, Object);
$implements(js.dom.template.ConditionalExpression.ComparisonProcessor, js.dom.template.ConditionalExpression.Processor);

js.dom.template.ConditionalExpression.LessThanProcessor = function () {
};

js.dom.template.ConditionalExpression.LessThanProcessor.prototype = {
    compare : function (value, operand) {
        return value < operand;
    }
};
$extends(js.dom.template.ConditionalExpression.LessThanProcessor, js.dom.template.ConditionalExpression.ComparisonProcessor);

js.dom.template.ConditionalExpression.GreaterThanProcessor = function () {
};

js.dom.template.ConditionalExpression.GreaterThanProcessor.prototype = {
    compare : function (value, operand) {
        return value > operand;
    }
};
$extends(js.dom.template.ConditionalExpression.GreaterThanProcessor, js.dom.template.ConditionalExpression.ComparisonProcessor);

js.dom.template.ConditionalExpression.OperandFormatValidator = {
    DATE_PATTERN : /^\d{4}(?:-\d{2}(?:-\d{2}(?:T\d{2}(?::\d{2}(?::\d{2}(?:Z)?)?)?)?)?)?$/,

    NUMBER_PATTERN : /^[+-]?\d+(?:\.\d+)?$/,

    BOOLEAN_PATTERN : /^true|false$/,

    isValid : function (value, operand) {
        if (!operand) {
            return false;
        }
        if (js.lang.Types.isBoolean(value)) {
            return this.BOOLEAN_PATTERN.test(operand);
        }
        if (js.lang.Types.isNumber(value)) {
            return this.NUMBER_PATTERN.test(operand);
        }
        if (js.lang.Types.isDate(value)) {
            return this.DATE_PATTERN.test(operand);
        }
        return true;
    }
};

js.dom.template.ConditionalExpression.Dates = {
    DATE_PATTERN : /(\d{4})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2})(?::(\d{2})(?::(\d{2})(?:Z)?)?)?)?)?)?/,

    dateMatcher : function (dateFormat) {
        // at this point date format is already validated and is safe to ignore null matcher
        var matcher = this.DATE_PATTERN.exec(dateFormat);
        return matcher;
    },

    parse : function (dateFormat) {
        var matcher = this.dateMatcher(dateFormat);

        var year = this._group(matcher, 1);
        var month = this._group(matcher, 2);
        var day = this._group(matcher, 3);
        var hours = this._group(matcher, 4);
        var minutes = this._group(matcher, 5);
        var seconds = this._group(matcher, 6);
        var utc = Date.UTC(year, month, day, hours, minutes, seconds);

        return new Date(utc);
    },

    _group : function (matcher, group) {
        var value = matcher[group];
        if (group == 2) {
            // the second group is hard coded to month and should be normalized, January should be 0
            return this._parseInt(value, 1) - 1;
        }
        if (group == 3) {
            // the third group is hard coded to day of month and should default to 1
            return this._parseInt(value, 1);
        }
        // all other groups defaults to 0
        return this._parseInt(value, 0);
    },

    _parseInt : function (value, defaultValue) {
        return value ? parseInt(value) : defaultValue;
    },

    dateItems : function (date) {
        var items = new Array(6);

        items[0] = date.getUTCFullYear();
        items[1] = date.getUTCMonth() + 1;
        items[2] = date.getUTCDate();
        items[3] = date.getUTCHours();
        items[4] = date.getUTCMinutes();
        items[5] = date.getUTCSeconds();

        return items;
    }
};
$package("js.dom.template");

js.dom.template.Content = function(model) {
	this._model = model ? model : {};
};

$static(function() {
	js.dom.template.Content._EMPTY_ITERATOR = new js.lang.Uniterator([]);

	js.dom.template.Content._EMPTY_MAP = {};
});

js.dom.template.Content.prototype = {
	getModel : function() {
		return this._model;
	},

	getIterable : function(scope, propertyPath) {
		var value = this.getValue(scope, propertyPath);
		if (value === null) {
			$warn("js.dom.template.Content#getIterable", "Null content value for property |%s|. Returns empty iterator.", propertyPath);
			return js.dom.template.Content._EMPTY_ITERATOR;
		}
		if (!js.lang.Types.isArray(value)) {
			throw new js.dom.template.ContentException(propertyPath, "Invalid content type. Expected array but got |%s|.", value);
		}
		return new js.lang.Uniterator(value);
	},

	getMap : function(scope, propertyPath) {
		var value = this.getValue(scope, propertyPath);
		if (value === null) {
			$warn("js.dom.template.Content#getMap", "Null content value for property |%s|. Returns empty map.", propertyPath);
			return js.dom.template.Content._EMPTY_MAP;
		}
		if (!js.lang.Types.isStrictObject(value)) {
			throw new js.dom.template.ContentException(propertyPath, "Invalid content type. Expected map but got |%s|.", value);
		}
		return value;
	},

	isEmpty : function(scope, propertyPath) {
		var value = this.getValue(scope, propertyPath);
		if (value === null) {
			return true;
		}
		if (typeof value.length !== "undefined") {
			return value.length === 0;
		}
		if (js.lang.Types.isFunction(value.size)) {
			return value.size() === 0;
		}
		if (js.lang.Types.isFunction(value.isEmpty)) {
			return value.isEmpty();
		}
		return !value;
	},

	getValue : function(context, propertyPath) {
		if (propertyPath === ".") {
			return context;
		}
		if (propertyPath.charAt(0) === ".") {
			return this._getAbsoluteValue(propertyPath);
		}
		return this._getRelativeValue(context, propertyPath);
	},

	_getAbsoluteValue : function(propertyPath) {
		return this._getRelativeValue(this._model, propertyPath.substr(1));
	},

	_getRelativeValue : function(context, propertyPath) {
		var o = context;
		var pathElements = propertyPath.split(".");
		for ( var i = 0;;) {
			o = this._getObjectProperty(o, pathElements[i]);
			if (++i === pathElements.length) {
				return o;
			}
			if (o === null) {
				return null;
			}
			if (!js.lang.Types.isObject(o)) {
				throw new js.dom.template.ContentException(propertyPath, "Undefined content value.");
			}
		}
		return o;
	},

	_getObjectProperty : function(object, property) {
		// takes care to normalize property name since it can be CSS like hyphen case
		property = js.util.Strings.toScriptCase(property);
		var value = object[property];
		if (typeof value !== "undefined") {
			return value;
		}
		var getterName = "get" + property.charAt(0).toUpperCase() + property.substr(1);
		var getter = this[getterName];
		if (js.lang.Types.isFunction(getter)) {
			return getter.call(this, object);
		}
		throw new js.dom.template.ContentException(property, "Undefined content value.");
	},

	toString : function() {
		return "js.dom.template.Content";
	}
};
$extends(js.dom.template.Content, Object);
$package('js.dom.template');

js.dom.template.ContentException = function(propertyPath, message) {
	this.$super($format(arguments, 1));

	this.name = 'Undefined property exception';

	this.propertyPath = propertyPath;
};

js.dom.template.ContentException.prototype = {
	toString : function() {
		return 'js.dom.template.ContentException';
	}
};
$extends(js.dom.template.ContentException, js.lang.Exception);
$package("js.dom.template");

js.dom.template.CssClassOperator = function (content) {
    this.$super(content);
};

js.dom.template.CssClassOperator.prototype = {
    _exec : function (element, scope, expression) {
        js.util.Strings.parseNameValues(expression).forEach(function (pair) {
            var expression = pair.name;
            var cssClass = pair.value;

            var conditionalExpression = new js.dom.template.ConditionalExpression(this._content, scope, expression);
            if (conditionalExpression.value()) {
                $debug("js.dom.template.CssClassOperator#_exec", "Add CSS class |%s| to element |%s|.", cssClass, element);
                element.addCssClass(cssClass);
            }
            else {
                $debug("js.dom.template.CssClassOperator#_exec", "Remove CSS class |%s| from element |%s|.", cssClass, element);
                element.removeCssClass(cssClass);
            }
        }, this);
    },

    toString : function () {
        return "js.dom.template.CssClassOperator";
    }
};
$extends(js.dom.template.CssClassOperator, js.dom.template.Operator);
$package("js.dom.template");

js.dom.template.ExcludeOperator = function() {
};

js.dom.template.ExcludeOperator.prototype = {
	_exec : function(element, scope, booleanExpression) {
		// returned value is interpreted as branch enabled
		// boolean expression argument is true if branch should be excluded, so we need to inverse it
		return !(booleanExpression.toLowerCase() === "true");
	},

	toString : function() {
		return "js.dom.template.ExcludeOperator";
	}
};
$extends(js.dom.template.ExcludeOperator, js.dom.template.Operator);
$package("js.dom.template");

js.dom.template.GotoOperator = function () {
};

js.dom.template.GotoOperator.prototype = {
    _exec : function (element, scope, elementID) {
        return elementID;
    },

    toString : function () {
        return "js.dom.template.GotoOperator";
    }
};
$extends(js.dom.template.GotoOperator, js.dom.template.Operator);
$package("js.dom.template");

js.dom.template.HrefOperator = function (content) {
    this.$super(content);
};

js.dom.template.HrefOperator.prototype = {
    _exec : function (element, scope, propertyPath) {
        var href = this._content.getValue(scope, propertyPath);
        if (href === null) {
            $warn("js.dom.template.HrefOperator#_exec", "Null property |%s|. Remove href attribute from element |%s|.", propertyPath, element);
            element.removeAttr("href");
        }
        else {
            $debug("js.dom.template.HrefOperator#_exec", "Set element |%s| href attribute from property |%s|.", element, propertyPath);
            element.setAttr("href", href);
        }
    },

    toString : function () {
        return "js.dom.template.HrefOperator";
    }
};
$extends(js.dom.template.HrefOperator, js.dom.template.Operator);
$package("js.dom.template");

js.dom.template.HtmlOperator = function (content) {
    this.$super(content);
};

js.dom.template.HtmlOperator.prototype = {
    _exec : function (element, scope, propertyPath) {
        if (scope === null) {
            $warn("js.dom.template.HtmlOperator#_exec", "Null scope for property |%s|. Remove children from element |%s|.", propertyPath, element);
            element.removeChildren();
            return null;
        }

        var html = this._content.getValue(scope, propertyPath);

        if (html === null) {
            $warn("js.dom.template.HtmlOperator#_exec", "Null property |%s|. Remove children from element |%s|.", propertyPath, element);
            element.removeChildren();
        }
        else {
            $debug("js.dom.template.HtmlOperator#_exec", "Set element |%s| inner HTML from property |%s|.", element, propertyPath);
            element.setHTML(html);
        }
        return undefined;
    },

    toString : function () {
        return "js.dom.template.HtmlOperator";
    }
};
$extends(js.dom.template.HtmlOperator, js.dom.template.Operator);
$package("js.dom.template");

js.dom.template.IdOperator = function (content) {
    this.$super(content);
};

js.dom.template.IdOperator.prototype = {
    _exec : function (element, scope, propertyPath) {
        var id = this._content.getValue(scope, propertyPath);
        if (id === null) {
            $warn("js.dom.template.IdOperator#_exec", "Null property |%s|. Remove id attribute from element |%s|.", propertyPath, element);
            element.removeAttr("id");
        }
        else {
            if (js.lang.Types.isNumber(id)) {
                id = id.toString();
            }
            $debug("js.dom.template.IdOperator#_exec", "Set element |%s| id attribute from property |%s|.", element, propertyPath);
            element.setAttr("id", id);
        }
    },

    toString : function () {
        return "js.dom.template.IdOperator";
    }
};
$extends(js.dom.template.IdOperator, js.dom.template.Operator);
$package("js.dom.template");

js.dom.template.IfOperator = function (content) {
    this.$super(content);
};

js.dom.template.IfOperator.prototype = {
    _exec : function (element, scope, expression) {
        var conditionalExpression = new js.dom.template.ConditionalExpression(this._content, scope, expression);
        return conditionalExpression.value();
    },

    toString : function () {
        return "js.dom.template.IfOperator";
    }
};
$extends(js.dom.template.IfOperator, js.dom.template.Operator);
$package('js.dom.template');

js.dom.template.Index = function() {
	this.value = 0;
};

js.dom.template.Index.prototype = {
	increment : function() {
		++this.value;
	},

	toString : function() {
		return "js.dom.template.Index";
	}
};
$extends(js.dom.template.Index, Object);
$package("js.dom.template");

js.dom.template.ListOperator = function (template, content) {
    this._template = template;

    this.$super(content);
};

js.dom.template.ListOperator.prototype = {
    _ITEM_TEMPLATE : "item-template",

    _ITEM_VALUE : "value",

    _exec : function (element, scope, propertyPath) {
        var itemTemplate = element.getUserData(this._ITEM_TEMPLATE);
        if (itemTemplate === null) {
            itemTemplate = element.getFirstChild();
            itemTemplate.remove(false);
            element.setUserData(this._ITEM_TEMPLATE, itemTemplate);
        }
        element.removeChildren();
        if (scope === null) {
            // on a null scope returns but after preparing item template and removing children
            return null;
        }

        $debug("js.dom.template.ListOperator#_exec", "Process element |%s| for property |%s|.", element, propertyPath);

        var it = this._content.getIterable(scope, propertyPath), itemElement, value;
        while (it.hasNext()) {
            value = it.next();
            itemElement = itemTemplate.clone(true);
            itemElement.setUserData(this._ITEM_VALUE, value);
            element.addChild(itemElement);
            // list item value become the scope for injecting element
            this._template.injectItem(itemElement, value);
        }
        return undefined;
    },

    toString : function () {
        return "js.dom.template.ListOperator";
    }
};
$extends(js.dom.template.ListOperator, js.dom.template.Operator);
$package('js.dom.template');

js.dom.template.UpperCaseRomanNumbering = function () {
};

js.dom.template.UpperCaseRomanNumbering.prototype = {
    Numeral : [ {
        roman : 'I',
        decimal : 1
    }, {
        roman : 'IV',
        decimal : 4
    }, {
        roman : 'V',
        decimal : 5
    }, {
        roman : 'IX',
        decimal : 9
    }, {
        roman : 'X',
        decimal : 10
    }, {
        roman : 'XL',
        decimal : 40
    }, {
        roman : 'L',
        decimal : 50
    }, {
        roman : 'XC',
        decimal : 90
    }, {
        roman : 'C',
        decimal : 100
    }, {
        roman : 'CD',
        decimal : 400
    }, {
        roman : 'D',
        decimal : 500
    }, {
        roman : 'CM',
        decimal : 900
    }, {
        roman : 'M',
        decimal : 1000
    } ],

    format : function (index) {
        var s = '';
        for ( var i = this.Numeral.length - 1; i >= 0; i--) {
            while (index >= this.Numeral[i].decimal) {
                s += this.Numeral[i].roman;
                index -= this.Numeral[i].decimal;
            }
        }
        return s;
    },

    toString : function () {
        return 'js.dom.template.UpperCaseRomanNumbering';
    }
};
$extends(js.dom.template.UpperCaseRomanNumbering, Object);
$package('js.dom.template');

js.dom.template.LowerCaseRomanNumbering = function() {
};

js.dom.template.LowerCaseRomanNumbering.prototype = {
	format : function(index) {
		return this.$super('format', index).toLowerCase();
	},

	toString : function() {
		return "js.dom.template.LowerCaseRomanNumbering";
	}
};
$extends(js.dom.template.LowerCaseRomanNumbering, js.dom.template.UpperCaseRomanNumbering);
$package('js.dom.template');

js.dom.template.UpperCaseStringNumbering = function () {
};

js.dom.template.UpperCaseStringNumbering.prototype = {
    _dictionary : "ABCDEFGHIJKLMNOPQRSTUVWXYZ",

    format : function (index) {
        --index; // lists index value starts with 1
        var charsCount = Math.floor(index / this._dictionary.length) + 1;
        index = index % this._dictionary.length;
        var c = this._dictionary.charAt(index);
        var s = "";
        for ( var i = 0; i < charsCount; ++i) {
            s += c;
        }
        return s;
    },

    toString : function () {
        return 'js.dom.template.UpperCaseStringNumbering';
    }
};
$extends(js.dom.template.UpperCaseStringNumbering, Object);
$package('js.dom.template');

js.dom.template.LowerCaseStringNumbering = function() {
};

js.dom.template.LowerCaseStringNumbering.prototype = {
	format : function(index) {
		return this.$super('format', index).toLowerCase();
	},

	toString : function() {
		return "js.dom.template.LowerCaseStringNumbering";
	}
};
$extends(js.dom.template.LowerCaseStringNumbering, js.dom.template.UpperCaseStringNumbering);
$package("js.dom.template");

js.dom.template.MapOperator = function (template, content) {
    this._template = template;

    this.$super(content);
};

js.dom.template.MapOperator.prototype = {
    _KEY_TEMPLATE : "key-template",

    _VALUE_TEMPLATE : "value-template",

    _exec : function (element, scope, propertyPath) {
        var keyTemplate = element.getUserData(this._KEY_TEMPLATE), valueTemplate;
        if (keyTemplate === null) {
            keyTemplate = element.getFirstChild();
            keyTemplate.remove(false);
            element.setUserData(this._KEY_TEMPLATE, keyTemplate);

            valueTemplate = element.getFirstChild();
            valueTemplate.remove(false);
            element.setUserData(this._VALUE_TEMPLATE, valueTemplate);
        }
        else {
            valueTemplate = element.getUserData(this._VALUE_TEMPLATE);
        }
        element.removeChildren();
        if (scope === null) {
            // on a null scope returns but after preparing key and value templates and removing children
            return null;
        }

        $debug("js.dom.template.MapOperator#_exec", "Process element |%s| for property |%s|.", element, propertyPath);

        var map = this._content.getMap(scope, propertyPath), keyElement, valueElement;
        for ( var key in map) {
            keyElement = keyTemplate.clone(true);
            valueElement = valueTemplate.clone(true);
            element.addChild(keyElement, valueElement);
            this._template.injectItem(keyElement, key);
            this._template.injectItem(valueElement, map[key]);
        }
        return undefined;
    },

    toString : function () {
        return "js.dom.template.MapOperator";
    }
};
$extends(js.dom.template.MapOperator, js.dom.template.Operator);
$package("js.dom.template");

js.dom.template.NumberingOperator = function (template, content) {
    this._template = template;

    this.$super(content);
};

js.dom.template.NumberingOperator.prototype = {
    _exec : function (element, scope, format) {
        // scope can be null but this operator doesnot use it

        var indexes = this._template._indexes;
        element.setText(this._getNumbering(indexes, format));
        return undefined;
    },

    _getNumbering : function (indexes, format) {
        var sb = "";
        var i = format.length;
        var j = i;
        var indexPosition = indexes.length - 1;
        for (;;) {
            i = format.lastIndexOf('%', i);
            if (i === -1 && j > 0) {
                sb = format.substring(0, j) + sb;
                break;
            }
            if (i + 2 < format.length) {
                sb = format.substring(i + 2, j) + sb;
            }
            if (i + 1 === format.length) {
                continue;
            }

            var numberingFormat = this._getNumberingFormat(format.charAt(i + 1));
            sb = numberingFormat.format(indexes[indexPosition--].value) + sb;
            if (i === 0) {
                break;
            }
            j = i;
            i--;
        }
        return sb;
    },

    _getNumberingFormat : function (formatCode) {
        switch (formatCode) {
        case 'n':
            return new js.dom.template.ArabicNumeralNumbering();
        case 's':
            return new js.dom.template.LowerCaseStringNumbering();
        case 'S':
            return new js.dom.template.UpperCaseStringNumbering();
        case 'i':
            return new js.dom.template.LowerCaseRomanNumbering();
        case 'I':
            return new js.dom.template.UpperCaseRomanNumbering();
        }
        },

    toString : function () {
        return "js.dom.template.NumberingOperator";
    }
};
$extends(js.dom.template.NumberingOperator, js.dom.template.Operator);
$package("js.dom.template");

js.dom.template.ObjectOperator = function (content) {
    this.$super(content);
};

js.dom.template.ObjectOperator.prototype = {
    _exec : function (element, scope, propertyPath) {
        if (scope === null) {
            return null;
        }
        var value = this._content.getValue(scope, propertyPath);
        if (value === null) {
            $warn("js.dom.template.ObjectOperator#_exec", "Null scope for property |%s| on element |%s|.", propertyPath, element);
        }
        else if ((propertyPath === "." && js.lang.Types.isFunction(value)) || (propertyPath !== "." && !js.lang.Types.isStrictObject(value))) {
            throw new js.dom.template.ContentException(propertyPath, "Invalid content type. Expected strict object but got |%s|.", js.lang.Types.getTypeName(value));
        }
        return value;
    },

    toString : function () {
        return "js.dom.template.ObjectOperator";
    }
};
$extends(js.dom.template.ObjectOperator, js.dom.template.Operator);
$package("js.dom.template");

js.dom.template.OListOperator = function (template, content) {
    this._template = template;

    this.$super(content);
};

js.dom.template.OListOperator.prototype = {
    _ITEM_TEMPLATE : "item-template",

    _exec : function (element, scope, propertyPath) {
        var itemTemplate = element.getUserData(this._ITEM_TEMPLATE);
        if (itemTemplate === null) {
            itemTemplate = element.getFirstChild();
            itemTemplate.remove(false);
            element.setUserData(this._ITEM_TEMPLATE, itemTemplate);
        }
        element.removeChildren();
        if (scope === null) {
            // on a null scope returns but after preparing item template and removing children
            return null;
        }

        var indexes = this._template._indexes;
        var index = new js.dom.template.Index();
        indexes.push(index);

        $debug("js.dom.template.OListOperator#_exec", "Process element |%s| with property |%s|.", element, propertyPath);

        var it = this._content.getIterable(scope, propertyPath), itemElement;
        while (it.hasNext()) {
            index.increment();
            itemElement = itemTemplate.clone(true);
            element.addChild(itemElement);
            this._template.injectItem(itemElement, it.next());
        }
        indexes.pop();
        return undefined;
    },

    toString : function () {
        return "js.dom.template.OListOperator";
    }
};
$extends(js.dom.template.OListOperator, js.dom.template.Operator);
$package("js.dom.template");

js.dom.template.OMapOperator = function (template, content) {
    this._template = template;

    this.$super(content);
};

js.dom.template.OMapOperator.prototype = {
    _KEY_TEMPLATE : "key-template",

    _VALUE_TEMPLATE : "value-template",

    _exec : function (element, scope, propertyPath) {
        var keyTemplate = element.getUserData(this._KEY_TEMPLATE), valueTemplate;
        if (keyTemplate === null) {
            keyTemplate = element.getFirstChild();
            keyTemplate.remove(false);
            element.setUserData(this._KEY_TEMPLATE, keyTemplate);

            valueTemplate = element.getFirstChild();
            valueTemplate.remove(false);
            element.setUserData(this._VALUE_TEMPLATE, valueTemplate);
        }
        else {
            valueTemplate = element.getUserData(this._VALUE_TEMPLATE);
        }
        element.removeChildren();
        if (scope === null) {
            // on a null scope returns but after preparing key and value templates and removing children
            return null;
        }

        var indexes = this._template._indexes;
        var index = new js.dom.template.Index();
        indexes.push(index);

        $debug("js.dom.template.OMapOperator#_exec", "Process element |%s| for property |%s|.", element, propertyPath);

        var map = this._content.getMap(scope, propertyPath), keyElement, valueElement;
        for ( var key in map) {
            index.increment();
            keyElement = keyTemplate.clone(true);
            valueElement = valueTemplate.clone(true);
            element.addChild(keyElement, valueElement);
            this._template.injectItem(keyElement, key);
            this._template.injectItem(valueElement, map[key]);
        }
        indexes.pop();
        return undefined;
    },

    toString : function () {
        return "js.dom.template.OMapOperator";
    }
};
$extends(js.dom.template.OMapOperator, js.dom.template.Operator);
$package("js.dom.template");

js.dom.template.Opcode = {
    NONE : 1,

    ATTR : 2,

    CSS_CLASS : 3,

    ID : 4,

    SRC : 5,

    HREF : 6,

    TITLE : 7,

    VALUE : 8,

    TEXT : 9,

    HTML : 10,

    OBJECT : 11,

    LIST : 12,

    OLIST : 13,

    MAP : 14,

    OMAP : 15,

    NUMBERING : 16,

    IF : 17,

    EXCLUDE : 18,

    GOTO : 19,

    _OPCODE_PREFIX : "data-",

    fromAttrName : function (attrName) {
        if (attrName.indexOf(this._OPCODE_PREFIX) !== 0) {
            return this.NONE;
        }
        var opcode = attrName.substring(this._OPCODE_PREFIX.length).toUpperCase().replace(/-/g, '_');
        if (!(opcode in this)) {
            return this.NONE;
        }
        return this[opcode];
    },

    hasOperator : function (element, operatorName) {
        return element.hasAttr(this._OPCODE_PREFIX + operatorName.toLowerCase());
    },

    type : function (opcode) {
        var t = this._types[opcode];
        return (typeof t === "undefined") ? js.dom.template.Opcode.Type.NONE : t;
    }
};

js.dom.template.Opcode.Type = {
    NONE : 1,

    JUMP : 2,

    CONDITIONAL : 3,

    CONTENT : 4,

    ATTRIBUTE : 5,

    name : function (type) {
        if (!this._names) {
            this._names = [ "NONE", "JUMP", "CONDITIONAL", "CONTENT", "ATTRIBUTE" ];
        }
        return this._names[type - 1] || this._names[0];
    }
};

$static(function () {
    // WARNING: take care to update opcode types hash table when add new operators
    var Opcode = js.dom.template.Opcode;

    Opcode._types = {};
    Opcode._types[Opcode.NONE] = Opcode.Type.NONE;
    Opcode._types[Opcode.ATTR] = Opcode.Type.ATTRIBUTE;
    Opcode._types[Opcode.CSS_CLASS] = Opcode.Type.ATTRIBUTE;
    Opcode._types[Opcode.ID] = Opcode.Type.ATTRIBUTE;
    Opcode._types[Opcode.SRC] = Opcode.Type.ATTRIBUTE;
    Opcode._types[Opcode.HREF] = Opcode.Type.ATTRIBUTE;
    Opcode._types[Opcode.TITLE] = Opcode.Type.ATTRIBUTE;
    Opcode._types[Opcode.VALUE] = Opcode.Type.ATTRIBUTE;
    Opcode._types[Opcode.TEXT] = Opcode.Type.CONTENT;
    Opcode._types[Opcode.HTML] = Opcode.Type.CONTENT;
    Opcode._types[Opcode.OBJECT] = Opcode.Type.CONTENT;
    Opcode._types[Opcode.LIST] = Opcode.Type.CONTENT;
    Opcode._types[Opcode.OLIST] = Opcode.Type.CONTENT;
    Opcode._types[Opcode.MAP] = Opcode.Type.CONTENT;
    Opcode._types[Opcode.OMAP] = Opcode.Type.CONTENT;
    Opcode._types[Opcode.NUMBERING] = Opcode.Type.CONTENT;
    Opcode._types[Opcode.IF] = Opcode.Type.CONDITIONAL;
    Opcode._types[Opcode.EXCLUDE] = Opcode.Type.CONDITIONAL;
    Opcode._types[Opcode.GOTO] = Opcode.Type.JUMP;
});
$package('js.dom.template');

js.dom.template.OperatorFactory = function (template) {
    this._template = template;
};

js.dom.template.OperatorFactory.prototype = {
    init : function (content) {
        var Opcode = js.dom.template.Opcode;
        this[Opcode.GOTO] = new js.dom.template.GotoOperator(content);
        this[Opcode.EXCLUDE] = new js.dom.template.ExcludeOperator(content);
        this[Opcode.IF] = new js.dom.template.IfOperator(content);
        this[Opcode.ATTR] = new js.dom.template.AttrOperator(content);
        this[Opcode.ID] = new js.dom.template.IdOperator(content);
        this[Opcode.SRC] = new js.dom.template.SrcOperator(content);
        this[Opcode.HREF] = new js.dom.template.HrefOperator(content);
        this[Opcode.TITLE] = new js.dom.template.TitleOperator(content);
        this[Opcode.VALUE] = new js.dom.template.ValueOperator(content);
        this[Opcode.CSS_CLASS] = new js.dom.template.CssClassOperator(content);
        this[Opcode.OBJECT] = new js.dom.template.ObjectOperator(content);
        this[Opcode.TEXT] = new js.dom.template.TextOperator(content);
        this[Opcode.HTML] = new js.dom.template.HtmlOperator(content);
        this[Opcode.NUMBERING] = new js.dom.template.NumberingOperator(this._template, content);
        this[Opcode.LIST] = new js.dom.template.ListOperator(this._template, content);
        this[Opcode.OLIST] = new js.dom.template.OListOperator(this._template, content);
        this[Opcode.MAP] = new js.dom.template.MapOperator(this._template, content);
        this[Opcode.OMAP] = new js.dom.template.OMapOperator(this._template, content);
    },

    getInstance : function (opcode) {
        var operator = this[opcode];
        return operator;
    },

    toString : function () {
        return "js.dom.template.OperatorFactory";
    }
};
$extends(js.dom.template.OperatorFactory, Object);
$package('js.dom.template');

js.dom.template.OperatorsList = function () {
    this._jumpOperator = null;

    this._conditionalOperator = null;

    this._formattingOperator = null;

    this._contentOperator = null;

    this._attributeOperators = [];
};

js.dom.template.OperatorsList.prototype = {
    initElement : function (element) {
        // reset this operators list content because instance is reused
        this._jumpOperator = null;
        this._conditionalOperator = null;
        this._formattingOperator = null;
        this._contentOperator = null;
        this._attributeOperators = [];

        var Opcode = js.dom.template.Opcode;
        var attrs = element.getNode().attributes;
        var attr, i, opcode, type, meta;

        for (i = 0; i < attrs.length; i++) {
            attr = attrs[i];

            opcode = Opcode.fromAttrName(attr.nodeName);
            if (opcode === Opcode.NONE) {
                continue;
            }
            meta = {
                opcode : opcode,
                operand : attr.value
            };

            type = Opcode.type(opcode);
            switch (type) {
            case Opcode.Type.JUMP:
                this._insanityCheck(element, this._jumpOperator, type);
                this._jumpOperator = meta;
                break;

            case Opcode.Type.CONDITIONAL:
                this._insanityCheck(element, this._conditionalOperator, type);
                this._conditionalOperator = meta;
                break;

            case Opcode.Type.FORMATTING:
                this._insanityCheck(element, this._formattingOperator, type);
                this._formattingOperator = meta;
                break;

            case Opcode.Type.CONTENT:
                this._insanityCheck(element, this._contentOperator, type);
                this._contentOperator = meta;
                break;

            case Opcode.Type.ATTRIBUTE:
                this._attributeOperators.push(meta);
                break;

            default:
                }
        }
    },

    initItem : function (element) {
        this.initElement(element);
        if (this._contentOperator === null) {
            var opcode = element.hasChildren() ? js.dom.template.Opcode.OBJECT : js.dom.template.Opcode.TEXT;
            this._contentOperator = {
                opcode : opcode,
                operand : "."
            };
        }
    },

    initSubtree : function (element) {
        this.initElement(element);

        // TODO hack for subtree injection
        if (this._contentOperator === null) {
            this._contentOperator = {
                opcode : js.dom.template.Opcode.OBJECT,
                operand : "."
            };
        }

        if (this._contentOperator !== null) {
            this._contentOperator.operand = ".";
            return;
        }

        var message = $format("Missing content operator. Element not usable for template injection:\r\n" + //
        "\t- trace: %s\r\n" + //
        "\t- dump: %s\r\n" + //
        "Note that element attributes does not contain a content operator.\r\n" + //
        "See js.dom.template.Opcode.Type#CONTENT for a list of content operators.", element.trace(), element.dump());
        $error("js.dom.template.OperatorsList#initSubtree", message);

        },

    hasJumpOperator : function () {
        return this._jumpOperator !== null;
    },

    hasConditionalOperator : function () {
        return this._conditionalOperator !== null;
    },

    hasContentOperator : function () {
        return this._contentOperator !== null;
    },

    getJumpOperatorMeta : function () {
        return this._jumpOperator;
    },

    getConditionalOperatorMeta : function () {
        return this._conditionalOperator;
    },

    getContentOperatorMeta : function () {
        return this._contentOperator;
    },

    getAttributeOperatorsMeta : function () {
        return this._attributeOperators;
    },

    _insanityCheck : function (element, meta, type) {
        },

    toString : function () {
        return "js.dom.template.OperatorsList";
    }
};
$extends(js.dom.template.OperatorsList, Object);

js.dom.template.OperatorsList.Meta = function () {
    this.opcode = null;

    this.operand = null;
};
$extends(js.dom.template.OperatorsList.Meta, Object);
$package("js.dom.template");

js.dom.template.SrcOperator = function (content) {
    this.$super(content);
};

js.dom.template.SrcOperator.prototype = {
    _exec : function (element, scope, propertyPath) {
        var value = this._content.getValue(scope, propertyPath);
        if (value === null) {
            $warn("js.dom.template.SrcOperator#_exec", "Null property |%s|. Remove src attribute from element |%s|.", propertyPath, element);
            element.removeAttr("src");
        }
        else {
            $debug("js.dom.template.SrcOperator#_exec", "Set element |%s| src attribute from property |%s|.", element, propertyPath);
            if (js.lang.Types.isFunction(element.setSrc)) {
                element.setSrc(value);
            }
            else {
                element.setAttr("src", value);
            }
        }
    },

    toString : function () {
        return "js.dom.template.SrcOperator";
    }
};
$extends(js.dom.template.SrcOperator, js.dom.template.Operator);
$package('js.dom.template');

js.dom.template.Template = function (doc) {
    this._doc = doc;

    this._operatorFactory = new js.dom.template.OperatorFactory(this);

    this._operators = new js.dom.template.OperatorsList();

    this._indexes = [];
};

js.dom.template.Template.getInstance = function (doc) {
    return new js.dom.template.Template(doc);
};

js.dom.template.Template.prototype = {
    inject : function (value) {
        var content = this._init(value);
        this._injectElement(this._doc.getRoot(), content.getModel());
    },

    injectElement : function (element, value) {
        var content = this._init(value);
        this._operators.initSubtree(element);
        this._inject(element, content.getModel());
    },

    injectItem : function (element, scope) {
        this._operators.initItem(element);
        this._inject(element, scope);
    },

    _init : function (value) {
        var content = value instanceof js.dom.template.Content ? value : new js.dom.template.Content(value);
        this._operatorFactory.init(content);
        return content;
    },

    _injectElement : function (element, scope) {
        this._operators.initElement(element);
        this._inject(element, scope);
    },

    _inject : function (element, scope) {
        if (this._operators.hasJumpOperator()) {
            var id = this._execOperator(element, scope, this._operators.getJumpOperatorMeta());
            // replace current element and its operators list with goto target element
            // but only if target element exists
            var gotoElement = this._doc.getById(id);
            if (gotoElement) {
                element = gotoElement;
                this._operators.initElement(element);
            }
        }

        if (scope !== null && this._operators.hasConditionalOperator()) {
            var branchEnabled = this._execOperator(element, scope, this._operators.getConditionalOperatorMeta());
            if (!branchEnabled) {
                $debug("js.dom.template.Template#_inject", "Element |%s| rejected by conditional operator.", element);
                element.hide();
                return;
            }
            element.show();
        }

        if (scope !== null) {
            this._operators.getAttributeOperatorsMeta().forEach(function (meta) {
                this._execOperator(element, scope, meta);
            }, this);
        }

        if (this._operators.hasContentOperator()) {
            scope = this._execOperator(element, scope, this._operators.getContentOperatorMeta());
            if (typeof scope === "undefined") {
                return;
            }
            if (scope === null && this._operators.getContentOperatorMeta().opcode !== js.dom.template.Opcode.OBJECT) {
                // content operator returns null if fully processed, that is, document tree branch is ended
                return;
            }
        }

        var it = element.getChildren().it(), el;
        while (it.hasNext()) {
            this._injectElement(it.next(), scope);
        }
    },

    _execOperator : function (element, scope, meta) {
        var operator = this._operatorFactory.getInstance(meta.opcode);
        return operator.exec(element, scope, meta.operand);
    },

    toString : function () {
        return "js.dom.template.Template";
    }
};
$extends(js.dom.template.Template, Object);
$package("js.dom.template");

js.dom.template.TextOperator = function (content) {
    this.$super(content);
};

js.dom.template.TextOperator.prototype = {
    _exec : function (element, scope, propertyPath) {
        if (scope === null) {
            $warn("js.dom.template.TextOperator#_exec", "Null scope on property |%s|. Remove element |%s| text content.", propertyPath, element);
            element.removeText();
            return null;
        }

        var value = this._content.getValue(scope, propertyPath);
        if (value === null || value === '') {
            $warn("js.dom.template.TextOperator#_exec", "Null or empty property |%s|. Remove element |%s| text content.", propertyPath, element);
            element.removeText();
        }
        else {
            $debug("js.dom.template.TextOperator#_exec", "Set text content to element |%s| from property |%s|.", element, propertyPath);
            // do not use raw text setter, i.e. element.setText
            // uses value setter because it supports data-format 
            element.setValue(value);
        }
        return undefined;
    },

    toString : function () {
        return "js.dom.template.TextOperator";
    }
};
$extends(js.dom.template.TextOperator, js.dom.template.Operator);
$package("js.dom.template");

js.dom.template.TitleOperator = function (content) {
    this.$super(content);
};

js.dom.template.TitleOperator.prototype = {
    _exec : function (element, scope, propertyPath) {
        var value = this._content.getValue(scope, propertyPath);
        if (value === null) {
            $warn("js.dom.template.TitleOperator#_exec", "Null property |%s|. Remove title attribute from element |%s|.", propertyPath, element);
            element.removeAttr("title");
        }
        else {
            $debug("js.dom.template.TitleOperator#_exec", "Set element |%s| title attribute from property |%s|.", element, propertyPath);
            element.setAttr("title", value);
        }
    },

    toString : function () {
        return "js.dom.template.TitleOperator";
    }
};
$extends(js.dom.template.TitleOperator, js.dom.template.Operator);
$package("js.dom.template");

js.dom.template.ValueOperator = function (content) {
    this.$super(content);
};

js.dom.template.ValueOperator.prototype = {
    GENERIC_ELEMENTS : [ "div" ],

    _exec : function (element, scope, propertyPath) {
        var value = this._content.getValue(scope, propertyPath);

        // if context element is a generic element just pass value to its value setter
        if (this.GENERIC_ELEMENTS.indexOf(element.getTag()) !== -1) {
            element.setValue(value);
            return;
        }

        if (value === null) {
            $warn("js.dom.template.ValueOperator#_exec", "Null property |%s|. Reset value for element |%s|.", propertyPath, element);
            element.reset();
        }
        else {
            $debug("js.dom.template.ValueOperator#_exec", "Set element |%s| value from property |%s|.", element, propertyPath);
            element.setValue(value);
        }
    },

    toString : function () {
        return "js.dom.template.ValueOperator";
    }
};
$extends(js.dom.template.ValueOperator, js.dom.template.Operator);
$package("js.event");

js.event.DomEvents = function (targetNode) {
    this._targetNode = new js.event.TargetNode(targetNode);

    this._handlers = [];
};

js.event.DomEvents.prototype = {
    hasType : function (type) {
        return type in js.event.Types;
    },

    getHandlers : function () {
        return this._handlers;
    },

    addListener : function (type, listener, scope, capture) {
        if (!(type in js.event.Types)) {
            return;
        }

        var handler = new js.event.Handler(this._targetNode, type, listener, scope, capture);
        // standard browsers silently discard multiple registration for listeners with the same parameters but IE allows
        if (this._handlers.indexOf(handler) !== -1) {
            return;
        }
        this._addListener(handler);
        this._handlers.push(handler);
    },

    removeListener : function (type, listener, capture) {
        if (!(type in js.event.Types)) {
            return;
        }

        var i, handler;
        for (i = this._handlers.length - 1; i >= 0; i--) {
            handler = this._handlers[i];
            if (handler.type === type && handler.listener === listener && handler.capture === capture) {
                this._handlers.splice(i, 1);
                this._removeListener(handler);
            }
        }
    },

    _addListener : function (handler) {
        handler.node.addEventListener(handler.type, handler.domEventListener, handler.capture);
    },

    _removeListener : function (handler) {
        handler.node.removeEventListener(handler.type, handler.domEventListener, handler.capture);
    },

    toString : function () {
        return "js.event.DomEvents";
    }
};
$extends(js.event.DomEvents, Object);

$legacy(typeof document.addEventListener === "undefined", function () {
    js.event.DomEvents.prototype._addListener = function (handler) {
        // attach event allows for multiple registration of the same event but is handled before reaching this point
        handler.node.attachEvent("on" + handler.type, handler.domEventListener);
    };

    js.event.DomEvents.prototype._removeListener = function (handler) {
        handler.node.detachEvent("on" + handler.type, handler.domEventListener);
    };
});

$legacy(js.ua.Engine.GECKO, function () {
    js.event.DomEvents.prototype._addListener = function (handler) {
        var type = handler.type;
        if (type === "mousewheel") {
            type = "DOMMouseScroll";
        }
        handler.node.addEventListener(type, handler.domEventListener, handler.capture);
        return true;
    };
});
$package('js.event');

js.event.Event = function (doc, type) {
    this._doc = doc;

    this.type = type;
};

js.event.Event.prototype = {
    init : function (domEvent) {
        this.timeStamp = domEvent.timeStamp;

        this._init(domEvent || window.event);

        this.shiftKey = domEvent.shiftKey;

        this.altKey = domEvent.altKey;

        this.ctrlKey = domEvent.ctrlKey;

        if (this.type === 'mousewheel') {
            this.wheel = 0;
            if (domEvent.wheelDelta) {
                this.wheel = domEvent.wheelDelta / 120;
                if (js.ua.Engine.PRESTO) {
                    this.wheel = -this.wheel;
                }
            }
            else if (domEvent.detail) {
                this.wheel = -domEvent.detail / 3;
            }
        }

        this.prevented = false;

        this.stopped = false;
        return this;
    },

    _init : function (domEvent) {
        this._domEvent = domEvent;

        this.target = domEvent.target.nodeType === Node.ELEMENT_NODE ? this._doc.getElement(domEvent.target) : null;

        this.pageX = domEvent.pageX;

        this.pageY = domEvent.pageY;

        this.key = Number(domEvent.keyCode) || Number(domEvent.which);
    },

    prevent : function () {
        if (this._domEvent.cancelable) {
            this.prevented = true;
        }
    },

    stop : function () {
        this.stopped = true;
    },

    halt : function () {
        this.stop();
        this.prevent();
    },

    isRightClick : function () {
        return this._domEvent.button === 2;
    },

    isLeftClick : function () {
        return this._domEvent.button === 0;
    },

    isMiddleClick : function () {
        return this._domEvent.button === 1;
    },

    toString : function () {
        return 'js.event.Event';
    }
};
$extends(js.event.Event, Object);

$legacy(js.ua.Engine.TRIDENT, function () {
    js.event.Event.prototype._init = function (domEvent) {
        this.target = this._doc.getElement(domEvent.srcElement);
        this.pageX = domEvent.clientX + this._doc._document.body.scrollLeft + this._doc._document.documentElement.scrollLeft;
        this.pageY = domEvent.clientY + this._doc._document.body.scrollTop + this._doc._document.documentElement.scrollTop;
        this.key = domEvent.keyCode;
    };

    js.event.Event.prototype.prevent = function () {
        this.prevented = true;
    };
});
$package("js.event");

js.event.EventsMap = {
    handle : function (context, args) {
        if (args.length < 2) {
            return false;
        }
        if (!js.lang.Types.isStrictObject(args[0])) {
            return false;
        }
        if (!js.lang.Types.isStrictObject(args[1])) {
            return false;
        }

        var listenersScope = args[0];
        var eventsMap = args[1];

        var eventSelector;
        var eventType;
        var eventListener;
        var selector;
        var name;
        var separatorIndex;

        // event declaration { "click [name='create']" : this._onCreate }
        // event selector click [name='create']
        // event type click
        // selector [name='create']
        // event listener this._onCreate

        for (eventSelector in eventsMap) {
            separatorIndex = eventSelector.indexOf(' ') + 1;
            eventType = separatorIndex > 0 ? eventDeclararion.substring(0, separatorIndex).trim() : "click";
            selector = eventSelector.substring(separatorIndex).trim();
            if (selector.charAt(0) === '&') {
                name = selector.substring(1);
                selector = $format("[name='%s'],[data-name='%s']", name, name);
            }

            eventListener = eventsMap[eventSelector];
            context.findByCss(selector).on(eventType, eventListener, listenersScope);
        }

        return true;
    }
};
$package("js.event");

js.event.Handler = function (targetNode, type, listener, scope, capture) {
    this.node = targetNode.node;

    this.type = type;

    this.listener = listener;

    this._scope = scope;

    this.capture = capture;

    this._event = new js.event.Event(targetNode.ownerDoc, type);

    this.domEventListener = this._handle.bind(this);
};

js.event.Handler.DEF_IDLE_TIMEOUT = 10;

js.event.Handler.idleTimeout = null;
$static(function () {
    js.event.Handler.idleTimeout = new js.util.Timeout(js.event.Handler.DEF_IDLE_TIMEOUT * 60 * 1000, function () {
        WinMain.page.onIdleTimeout();
    });
    js.event.Handler.idleTimeout.start();
});

js.event.Handler.prototype = {
    _handle : function (domEvent) {
        if (js.event.Handler.idleTimeout !== null) {
            js.event.Handler.idleTimeout.start();
        }
        if (!this._preHandle(domEvent)) {
            return;
        }
        var ev = this._event.init(domEvent);
        try {
            this.listener.call(this._scope, ev);
        } catch (er) {
            js.ua.System.error(er);
        }
        if (ev.prevented === true) {
            this._prevent(domEvent);
        }
        if (ev.stopped === true) {
            this._stop(domEvent);
        }
    },

    _preHandle : function (domEvent) {
        // if (domEvent.eventPhase !== js.event.Event.AT_TARGET) {
        // return false;
        // }
        return true;
    },

    _prevent : function (domEvent) {
        domEvent.preventDefault();
    },

    _stop : function (domEvent) {
        domEvent.stopPropagation();
    },

    equals : function (handler) {
        return handler.node === this.node && handler.type === this.type && handler.listener === this.listener;
    },
    
    toString : function () {
        return "js.event.Handler";
    }
};
$extends(js.event.Handler, Object);

$legacy(js.ua.Engine.TRIDENT, function () {
    js.event.Handler.prototype._prevent = function (domEvent) {
        domEvent.returnValue = false;
    };

    js.event.Handler.prototype._stop = function (domEvent) {
        domEvent.cancelBubble = true;
    };
});

$legacy(js.ua.Engine.TRIDENT || js.ua.Engine.PRESTO || js.ua.Engine.MOBILE_WEBKIT, function () {
    js.event.Handler.prototype._preHandle = function (domEvent) {
        // if (domEvent.eventPhase !== js.event.Event.AT_TARGET) {
        // return false;
        // }
        if (this.type === "load" && this.node.nodeName.toLowerCase() === "iframe" && this.node.contentWindow.location.toString() === "about:blank") {
            return false;
        }
        return true;
    };
});
$package('js.event');


js.event.Key =
{
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    BREAK: 19,
    CAPS_LOCK: 20,
    ESCAPE: 27,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    INSERT: 45,
    DELETE: 46,
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,
    COLON: 59,
    PLUS: 61,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    NUM0: 96,
    NUM1: 97,
    NUM2: 98,
    NUM3: 99,
    NUM4: 100,
    NUM5: 101,
    NUM6: 102,
    NUM7: 103,
    NUM8: 104,
    NUM9: 105,
    NUM_MULTIPLY: 106,
    NUM_PLUS: 107,
    NUM_MINUS: 109,
    NUM_POINT: 110,
    NUM_DIVIDE: 111,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    NUM_LOCK: 144,
    SCROLL_LOCK: 145,
    LESS_THAN: 188,
    MINUS: 189,
    GREATER_THAN: 190,
    QUESTION: 191,
    TILDE: 192,
    LEFT_BRACKET: 219,
    DIVIDE: 220,
    RIGHT_BRACKET: 221,
    QUOTATION: 222
};
$package('js.event');

js.event.TargetNode = function (node) {
    this.node = node instanceof js.dom.Document ? node._document : node._node;

    this.ownerDoc = node instanceof js.dom.Document ? node : node._ownerDoc;
};

js.event.TargetNode.prototype = {
    toString : function () {
        return 'js.event.TargetNode';
    }
};
$extends(js.event.TargetNode, Object);
$package("js.event");

js.event.Types = {
    abort : "HTMLEvents",

    beforeunload : "HTMLEvents",

    blur : "HTMLEvents",

    canplay : "MediaEvents",

    canplaythrough : "MediaEvents",

    change : "HTMLEvents",

    click : "MouseEvents",

    dblclick : "MouseEvents",

    durationchange : "MediaEvents",

    emptied : "MediaEvents",

    ended : "MediaEvents",

    error : "HTMLEvents",

    focus : "HTMLEvents",

    input : "HTMLEvents",

    keydown : "UIEvents",

    keypress : "UIEvents",

    keyup : "UIEvents",

    load : "HTMLEvents",

    loadeddata : "MediaEvents",

    loadedmetadata : "MediaEvents",

    loadstart : "MediaEvents",

    mousedown : "MouseEvents",

    mousemove : "MouseEvents",

    mouseout : "MouseEvents",

    mouseover : "MouseEvents",

    mouseup : "MouseEvents",

    mousewheel : "SyntheticEvents",

    orientationchange : "HTMLEvents",

    paste : "UIEvents",

    pause : "MediaEvents",

    play : "MediaEvents",

    playing : "MediaEvents",

    progress : "MediaEvents",

    ratechange : "MediaEvents",

    reset : "HTMLEvents",

    resize : "HTMLEvents",

    scroll : "HTMLEvents",

    seeked : "MediaEvents",

    seeking : "MediaEvents",

    select : "HTMLEvents",

    stalled : "MediaEvents",

    submit : "HTMLEvents",

    suspend : "MediaEvents",

    timeupdate : "MediaEvents",

    transitionend : "TransitionEvent",

    unload : "HTMLEvents",

    volumechange : "MediaEvents",

    waiting : "MediaEvents"
};
$package("js.format");

js.format.Format = {
    format : function (object) {
    },

    parse : function (string) {
    },

    test : function (string) {
    }
};
$package("js.format");

js.format.AbstractDateTime = function (dateFormat) {
    this._dateFormat = dateFormat;
};

js.format.AbstractDateTime.prototype = {
    format : function (date) {
        if (date === null) {
            return "";
        }
        if (!js.lang.Types.isDate(date)) {
            return "";
        }
        return this._dateFormat.format(date);
    },

    parse : function (source) {
        if (!source) {
            return null;
        }
        if (!js.lang.Types.isString(source)) {
            return null;
        }
        return this._dateFormat.parse(source);
    },

    test : function (source) {
        return this._dateFormat.test(source);
    },

    toString : function () {
        return "js.format.AbstractDateTime";
    }
};
$extends(js.format.AbstractDateTime, Object);
$implements(js.format.AbstractDateTime, js.format.Format);
$package("js.format");

js.format.BitRate = function () {
    this._numberFormat = new js.format.NumberFormat();
    this._numberFormat.setGroupingUsed(true);
    this._numberFormat.setMinimumFractionDigits(2);
    this._numberFormat.setMaximumFractionDigits(2);
};

js.format.BitRate.Unit = {
    1 : "bps",

    1000 : "Kbps",

    1000000 : "Mbps",

    1000000000 : "Gbps",

    1000000000000 : "Tbps"
};

js.format.BitRate.prototype = {
    _VALID_INPUT : function () {
        var units = [];
        for ( var u in js.format.BitRate.Unit) {
            units.push(js.format.BitRate.Unit[u]);
        }
        return new RegExp("^([^ ]+)\\s+(" + units.join("|") + ")$", "gi");
    }(),

    format : function (bitRate) {
        if (!bitRate) {
            return this._format(0, "1");
        }

        // workaround for precision to 5 digits
        // maximum numeric part value is 999.99 in current number format settings
        // if bitrate is 999995 is reasonable to expect 1.0 Mbps but because bitrate < Mbps threshold
        // selected unit is Kbps and after numeric part rounding formatted string is 1,000.00 Kbps
        // which is correct but not as expected; the same is true for Gbps and Tbps
        // next logic takes care to choose next units if round increases value, so Kbps -> Mbps

        var adjustToNextUnit = false;
        if (bitRate.toString().indexOf("99999") !== -1) {
            adjustToNextUnit = Math.round("0." + bitRate.toString().substr(5)) === 1;
        }

        var threshold = 0, t = 0;
        for (t in js.format.BitRate.Unit) {
            if (bitRate < t) {
                if (!adjustToNextUnit) {
                    break;
                }
                adjustToNextUnit = false;
            }
            threshold = t;
        }
        if (threshold === 0) {
            // threshold is zero if bit rate is greater or equals largest threshold
            // uses that largest threshold to format bit rate
            threshold = t;
        }
        return this._format(bitRate / Number(threshold), threshold);
    },

    _format : function (bitRate, threshold) {
        return this._numberFormat.format(bitRate) + " " + js.format.BitRate.Unit[threshold];
    },

    parse : function (string) {
        this._VALID_INPUT.lastIndex = 0;
        var m = this._VALID_INPUT.exec(string);
        var value = this._numberFormat.parse(m[1]);
        var unit = m[2].toLowerCase();
        if (unit.length > 3) {
            unit = js.util.Strings.toTitleCase(unit);
        }
        for ( var t in js.format.BitRate.Unit) {
            if (js.format.BitRate.Unit[t] === unit) {
                return value * Number(t);
            }
        }
    },

    test : function (string) {
        this._VALID_INPUT.lastIndex = 0;
        var m = this._VALID_INPUT.exec(string);
        return (m !== null && typeof m[1] !== "undefined") ? this._numberFormat.test(m[1]) : false;
    },

    toString : function () {
        return "js.format.BitRate";
    }
};
$extends(js.format.BitRate, Object);
$implements(js.format.BitRate, js.format.Format);
$package("js.format");

js.format.Currency = function () {
    this._numberFormat = new js.format.NumberFormat("@string/currency-format");
    this._numberFormat.setGroupingUsed(true);
    this._numberFormat.setMinimumFractionDigits(2);
    this._numberFormat.setMaximumFractionDigits(2);
};

js.format.Currency.prototype = {
    format : function (currency) {
        return this._numberFormat.format(currency);
    },

    parse : function (string) {
        return this._numberFormat.parse(string);
    },

    test : function (string) {
        return this._numberFormat.test(string);
    },

    toString : function () {
        return "js.format.Currency";
    }
};
$extends(js.format.Currency, Object);
$implements(js.format.Currency, js.format.Format);
$package("js.format");

js.format.DateFormat = function(pattern) {
	this._pattern = pattern;

	this._symbols = new js.format.DateFormatSymbols();

	this._validInput = null;
	this._compile();
};

js.format.DateFormat.SHORT = 1;

js.format.DateFormat.MEDIUM = 2;

js.format.DateFormat.LONG = 3;

js.format.DateFormat.FULL = 4;

js.format.DateFormat.DATE_STYLES = {
	1 : "shortDate",

	2 : "mediumDate",

	3 : "longDate",

	4 : "fullDate"
};

js.format.DateFormat.TIME_STYLES = {
	1 : "shortTime",

	2 : "mediumTime",

	3 : "longTime",

	4 : "fullTime"
};

js.format.DateFormat.getDateTimeInstance = function(dateStyle, timeStyle) {
	var symbols = new js.format.DateFormatSymbols();
	var datePattern = symbols.patterns[this.DATE_STYLES[dateStyle]];
	var timePattern = symbols.patterns[this.TIME_STYLES[timeStyle]];
	return new js.format.DateFormat(datePattern + " " + timePattern);
};

js.format.DateFormat.getDateInstance = function(style) {
	var symbols = new js.format.DateFormatSymbols();
	var datePattern = symbols.patterns[this.DATE_STYLES[style]];
	return new js.format.DateFormat(datePattern);
};

js.format.DateFormat.getTimeInstance = function(style) {
	var symbols = new js.format.DateFormatSymbols();
	var timePattern = symbols.patterns[this.TIME_STYLES[style]];
	return new js.format.DateFormat(timePattern);
};

js.format.DateFormat.PatternFormatters = {
	symbols : null,

	date : null,

	y : function() {
		return this.truncateYear(this.date.getFullYear());
	},

	yy : function() {
		return this.truncateYear(this.date.getFullYear());
	},

	yyy : function() {
		return this.date.getFullYear().toString();
	},

	yyyy : function() {
		return this.date.getFullYear().toString();
	},

	M : function() {
		return (this.date.getMonth() + 1).toString();
	},

	MM : function() {
		return this.pad(this.date.getMonth() + 1, 2);
	},

	MMM : function() {
		return this.symbols.shortMonths[this.date.getMonth()];
	},

	MMMM : function() {
		return this.symbols.fullMonths[this.date.getMonth()];
	},

	d : function() {
		return this.date.getDate();
	},

	dd : function() {
		return this.pad(this.date.getDate(), 2);
	},

	E : function() {
		return this.symbols.shortWeekDays[this.date.getDay()];
	},

	EE : function() {
		return this.symbols.shortWeekDays[this.date.getDay()];
	},

	EEE : function() {
		return this.symbols.shortWeekDays[this.date.getDay()];
	},

	EEEE : function() {
		return this.symbols.fullWeekDays[this.date.getDay()];
	},

	h : function() {
		var h = this.date.getHours() % 12;
		if (h === 0) {
			h = 12;
		}
		return h.toString();
	},

	hh : function() {
		return this.pad(js.format.DateFormat.PatternFormatters["h"]());
	},

	H : function() {
		return this.date.getHours().toString();
	},

	HH : function() {
		return this.pad(this.date.getHours(), 2);
	},

	m : function() {
		return this.date.getMinutes().toString();
	},

	mm : function() {
		return this.pad(this.date.getMinutes(), 2);
	},

	s : function() {
		return this.date.getSeconds().toString();
	},

	ss : function() {
		return this.pad(this.date.getSeconds(), 2);
	},

	S : function() {
		var S = this.date.getMilliseconds();
		return this.pad(S > 99 ? Math.round(S / 100) : S, 1);
	},

	SS : function() {
		var S = this.date.getMilliseconds();
		return this.pad(S > 9 ? Math.round(S / 10) : S, 2);
	},

	SSS : function() {
		return this.pad(this.date.getMilliseconds(), 3);
	},

	a : function() {
		return this.date.getHours() < 12 ? "AM" : "PM";
	},

	z : function() {
		return this.shortTZ(this.date);
	},

	zz : function() {
		return this.shortTZ(this.date);
	},

	zzz : function() {
		return this.shortTZ(this.date);
	},

	zzzz : function() {
		return this.fullTZ(this.date);
	},

	Z : function() {
		return this.rfc822TZ(this.date);
	},

	pad : function(val, len) {
		val = String(val);
		len = len || 2;
		while (val.length < len) {
			val = "0" + val;
		}
		return val;
	},

	truncateYear : function(fullYear) {
		var currentYear = new Date().getFullYear();
		return fullYear.toString().substr(2);
	},

	// i do not have a reliable algorithm to determine client time zone id or display name since it depends on country,
	// beside date time zone offset; also take care there are rumors time zone offset is not dealing well with daylight
	// saving; for now uses rfc822 format for all time zone format

	shortTZ : function(date) {
		return this.rfc822TZ(date);
	},

	fullTZ : function(date) {
		return this.rfc822TZ(date);
	},

	rfc822TZ : function(date) {
		var tz = date.getTimezoneOffset();
		var s = tz < 0 ? "+" : "-";
		var h = Math.abs(Math.round(tz / 60));
		var m = Math.abs(Math.round(tz % 60));
		return s + this.pad(h) + this.pad(m);
	}
};

js.format.DateFormat.prototype = {
	_FORMAT_PATTERNS : /y{1,4}|M{1,4}|d{1,2}|E{1,4}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|a|z{1,4}|Z/g,

	_PATTERN_CHARS : "yMdEhHmsSazZ",

	format : function(date) {
		var formatters = js.format.DateFormat.PatternFormatters;
		formatters.symbols = this._symbols;
		formatters.date = date;

		this._FORMAT_PATTERNS.lastIndex = 0;
		return this._pattern.replace(this._FORMAT_PATTERNS, function($0) {
			return formatters[$0]();
		});
	},

	parse : function(source) {
		var sourceIndex = 0;

		var pattern = this._pattern;
		var patternChars = this._PATTERN_CHARS;
		var patternIndex = 0;
		var symbols = this._symbols;

		function isDigit(c) {
			return c >= "0" && c <= "9";
		}
		function isPattern(c) {
			return patternChars.indexOf(c) !== -1;
		}
		function text() {
			skipPattern();
			return parseText();
		}
		function number() {
			return Number(parseNumber(skipPattern()));
		}
		function year() {
			var patternLength = skipPattern();
			var year = parseNumber(patternLength);
			if (patternLength > 2) {
				return year;
			}

			var nowFullYear = new Date().getFullYear();
			var nowYear = nowFullYear % 100;
			var century = Math.floor(nowFullYear / 100);
			if (nowYear >= 80) {
				if (year <= nowYear - 80) {
					++century;
				}
			}
			else {
				if (year > nowYear + 20) {
					--century;
				}
			}
			return 100 * century + year;
		}
		function month() {
			var patternLength = skipPattern();
			if (patternLength <= 2) {
				var m = parseNumber(patternLength);
				return m > 0 ? m - 1 : 0;
			}

			var rex = new RegExp(parseText(), "gi");
			var i = index(symbols.fullMonths, rex);
			if (i === -1) {
				i = index(symbols.shortMonths, rex);
			}
			return i;
		}
		function weekDay() {
			var s = text();
			var rex = new RegExp(s, "gi");
			var i = index(symbols.fullWeekDays, rex);
			if (i === -1) {
				i = index(symbols.shortWeekDays, rex);
			}
			}
		function ampmMarker() {
			++patternIndex;
			var ampm = source.substr(sourceIndex, 2).toLowerCase();
			// silently ignore index beyond source length
			sourceIndex += 2;
			return ampm;
		}

		function skipPattern() {
			var c = pattern.charAt(patternIndex);
			var patternLength = 1;
			while (patternIndex < pattern.length && c === pattern.charAt(++patternIndex)) {
				++patternLength;
			}
			return patternLength;
		}
		function parseNumber(patternLength) {
			var inputLengthHint = isPattern(pattern.charAt(patternIndex)) ? patternLength : Number.POSITIVE_INFINITY;
			if (patternIndex === pattern.length) {
				inputLengthHint = Number.POSITIVE_INFINITY;
			}
			var text = "";
			while (sourceIndex < source.length && isDigit(source.charAt(sourceIndex)) && inputLengthHint-- > 0) {
				text += source.charAt(sourceIndex++);
			}
			return Number(text);
		}
		function parseText() {
			var text = "";
			var endOfText = patternIndex < pattern.length ? pattern.charAt(patternIndex) : null;
			while (sourceIndex < source.length && source.charAt(sourceIndex) !== endOfText) {
				text += source.charAt(sourceIndex++);
			}
			return text;
		}
		function index(names, rex) {
			for (var i = 0; i < names.length; ++i) {
				// rex.lastIndex = 0;
				if (rex.test(names[i])) {
					return i;
				}
			}
			return -1;
		}

		// date components value initialized to epoch
		var y = 1970, M = 0, d = 1, h = 0, m = 0, s = 0, S = 0;
		var pm = false;
		for (; patternIndex < pattern.length;) {
			switch (pattern.charAt(patternIndex)) {
			case "y":
				y = year();
				break;
			case "M":
				M = month();
				break;
			case "d":
				d = number();
				break;
			case "H":
				h = number();
				break;
			case "h":
				h = number();
				break;
			case "m":
				m = number();
				break;
			case "s":
				s = number();
				break;
			case "S":
				S = number();
				break;
			case "a":
				pm = ampmMarker() === "pm";
				break;
			case "E":
				weekDay();
				break;
			case "z":
				text();
				break;
			case "Z":
				text();
				break;
			default:
				++patternIndex;
				++sourceIndex;
			}
		}
		if (pm) {
			h = (h + 12) % 24;
		}
		return new Date(y, M, d, h, m, s, S);
	},

	test : function(source) {
		this._validInput.lastIndex = 0;
		return this._validInput.test(source);
	},

	_compile : function() {
		// in order to avoid abusing garbage collector pattern handling procedures and pattern parsing loop use these
		// function global variables

		// makes this date format pattern available to skipSubPattern procedure
		var pattern = this._pattern;
		// index is updated by pattern parsing loop and used by skipSubPattern procedure
		var index = 0;
		// regualr expression builder is updated by pattern parsing loop
		var rex = "";

		// all pattern handling procedures update this object state instead of returning a value
		var match = {
			pattern : null,
			length : 0
		};

		function year() {
			match.length = skipSubPattern();
			match.pattern = match.length > 2 ? "\\d{1,4}" : "\\d{2}";
		}
		function month() {
			match.length = skipSubPattern();
			match.pattern = match.length <= 2 ? "\\d{1,2}" : match.length === 3 ? "\\w{3}" : "\\w{3,}";
		}
		function weekDay() {
			match.length = skipSubPattern();
			match.pattern = match.length === 3 ? "\\w{3}" : "\\w{3,}";
		}
		function number(maxDigitsCount) {
			match.length = skipSubPattern();
			if (typeof maxDigitsCount === "undefined") {
				maxDigitsCount = 2;
			}
			match.pattern = "\\d{1," + maxDigitsCount + "}";
		}
		function ampmMarker() {
			match.length = skipSubPattern();
			match.pattern = "am|pm";
		}
		function generalTZ() {
			match.length = skipSubPattern();
			match.pattern = "[+-]?\\d{4}";
		}
		function rfc822TZ() {
			match.length = skipSubPattern();
			match.pattern = "[+-]?\\d{4}";
		}

		function skipSubPattern() {
			// skip over current sub-pattern; returns sub-pattern length
			var c = pattern.charAt(index);
			var subPatternLength = 1;
			var i = index;
			while (i < pattern.length && c === pattern.charAt(++i)) {
				++subPatternLength;
			}
			return subPatternLength;
		}

		// pattern parsing loop

		for (var c; index < pattern.length;) {
			c = pattern.charAt(index);
			match.length = 0;

			switch (c) {
			case "y":
				year();
				break;
			case "M":
				month();
				break;
			case "d":
			case "H":
			case "h":
			case "m":
			case "s":
				number();
				break;
			case "S":
				number(3);
				break;
			case "a":
				ampmMarker();
				break;
			case "E":
				weekDay();
				break;
			case "z":
				generalTZ();
				break;
			case "Z":
				rfc822TZ();
				break;

			default:
			}

			if (match.length > 0) {
				rex += match.pattern;
				index += match.length;
			}
			else {
				rex += js.util.Strings.escapeRegExp(c);
				++index;
			}
		}
		this._validInput = new RegExp("^" + rex + "$", "gi");
	},

	toString : function() {
		return "js.format.DateFormat";
	}
};
$extends(js.format.DateFormat, Object);
$implements(js.format.DateFormat, js.format.Format);
$package("js.format");

js.format.DateFormatSymbols = function () {
    return js.format.DateFormatSymbols._symbols;
};
$extends(js.format.DateFormatSymbols, Object);

js.format.DateFormatSymbols._symbols = {
    patterns : {
        fullDate : "@string/full-date",
        fullTime : "@string/full-time",
        longDate : "@string/long-date",
        longTime : "@string/long-time",
        mediumDate : "@string/medium-date",
        mediumTime : "@string/medium-time",
        shortDate : "@string/short-date",
        shortTime : "@string/short-time"
    },

    fullMonths : [ "@string/full-jan", "@string/full-feb", "@string/full-mar", "@string/full-apr", "@string/full-may", "@string/full-jun", "@string/full-jul", "@string/full-aug", "@string/full-sep", "@string/full-oct", "@string/full-nov", "@string/full-dec" ],
    shortMonths : [ "@string/short-jan", "@string/short-feb", "@string/short-mar", "@string/short-apr", "@string/short-may", "@string/short-jun", "@string/short-jul", "@string/short-aug", "@string/short-sep", "@string/short-oct", "@string/short-nov", "@string/short-dec" ],
    fullWeekDays : [ "@string/full-su", "@string/full-mo", "@string/full-tu", "@string/full-we", "@string/full-th", "@string/full-fr", "@string/full-sa" ],
    shortWeekDays : [ "@string/short-su", "@string/short-mo", "@string/short-tu", "@string/short-we", "@string/short-th", "@string/short-fr", "@string/short-sa" ],
    tinyWeekDays : [ "@string/tiny-su", "@string/tiny-mo", "@string/tiny-tu", "@string/tiny-we", "@string/tiny-th", "@string/tiny-fr", "@string/tiny-sa" ]
};
$package("js.format");

js.format.Factory = {
	_pool : {},

	getFormat : function(className) {
		if (className === null) {
			return null;
		}
		var instance = this._pool[className];
		if (typeof instance !== "undefined") {
			return instance;
		}

		var clazz = js.lang.Class.forName(className);
		instance = new clazz();
		this._pool[className] = instance;
		return instance;
	}
};
$package("js.format");

js.format.FileSize = function () {
    this._numberFormat = new js.format.NumberFormat();
    this._numberFormat.setGroupingUsed(true);
    this._numberFormat.setMinimumFractionDigits(2);
    this._numberFormat.setMaximumFractionDigits(2);

    var units = [];
    for ( var t in js.format.FileSize.Unit) {
        units.push(js.format.FileSize.Unit[t]);
    }
    this._validInput = new RegExp("^([^ ]+)\\s+(" + units.join("|") + ")$", "gi");
};

js.format.FileSize.Unit = {
    1 : "B",

    1024 : "KB",

    1048576 : "MB",

    1073741824 : "GB",

    1099511627776 : "TB"
};

js.format.FileSize.prototype = {
    _VALID_INPUT : function () {
        var units = [];
        for ( var u in js.format.FileSize.Unit) {
            units.push(js.format.FileSize.Unit[u]);
        }
        return new RegExp("^([^ ]+)\\s+(" + units.join("|") + ")$", "gi");
    }(),

    format : function (fileSize) {
        if (!fileSize) {
            return this._format(0, "1");
        }

        var threshold = 0, t = 0;
        for (t in js.format.FileSize.Unit) {
            if (fileSize < t) {
                break;
            }
            threshold = t;
        }
        if (threshold === 0) {
            // threshold is zero if file size is greater or equals largest threshold
            // uses that largest threshold to format file size
            threshold = t;
        }
        return this._format(fileSize / Number(threshold), threshold);
    },

    _format : function (fileSize, threshold) {
        return this._numberFormat.format(fileSize) + " " + js.format.FileSize.Unit[threshold];
    },

    parse : function (string) {
        this._VALID_INPUT.lastIndex = 0;
        var m = this._VALID_INPUT.exec(string);
        var value = this._numberFormat.parse(m[1]);
        var unit = m[2].toUpperCase();
        for ( var t in js.format.FileSize.Unit) {
            if (js.format.FileSize.Unit[t] === unit) {
                return value * Number(t);
            }
        }
    },

    test : function (string) {
        this._VALID_INPUT.lastIndex = 0;
        var m = this._VALID_INPUT.exec(string);
        return (m !== null && typeof m[1] !== "undefined") ? this._numberFormat.test(m[1]) : false;
    },

    toString : function () {
        return "js.format.FileSize";
    }
};
$extends(js.format.FileSize, Object);
$implements(js.format.FileSize, js.format.Format);
$package("js.format");

js.format.FullDate = function () {
    this.$super(js.format.DateFormat.getDateInstance(js.format.DateFormat.FULL));
};
$extends(js.format.FullDate, js.format.AbstractDateTime);
$package("js.format");

js.format.FullDateTime = function () {
    this.$super(js.format.DateFormat.getDateTimeInstance(js.format.DateFormat.FULL, js.format.DateFormat.FULL));
};
$extends(js.format.FullDateTime, js.format.AbstractDateTime);
$package("js.format");

js.format.FullTime = function() {
    this.$super(js.format.DateFormat.getTimeInstance(js.format.DateFormat.FULL));
};
$extends(js.format.FullTime, js.format.AbstractDateTime);
$package("js.format");

js.format.LongDate = function() {
    this.$super(js.format.DateFormat.getDateInstance(js.format.DateFormat.LONG));
};
$extends(js.format.LongDate, js.format.AbstractDateTime);
$package("js.format");

js.format.LongDateTime = function () {
    this.$super(js.format.DateFormat.getDateTimeInstance(js.format.DateFormat.LONG, js.format.DateFormat.LONG));
};
$extends(js.format.LongDateTime, js.format.AbstractDateTime);
$package("js.format");

js.format.LongTime = function () {
    this.$super(js.format.DateFormat.getTimeInstance(js.format.DateFormat.LONG));
};
$extends(js.format.LongTime, js.format.AbstractDateTime);
$package("js.format");

js.format.MediumDate = function () {
    this.$super(js.format.DateFormat.getDateInstance(js.format.DateFormat.MEDIUM));
};
$extends(js.format.MediumDate, js.format.AbstractDateTime);
$package("js.format");

js.format.MediumDateTime = function () {
    this.$super(js.format.DateFormat.getDateTimeInstance(js.format.DateFormat.MEDIUM, js.format.DateFormat.MEDIUM));
};
$extends(js.format.MediumDateTime, js.format.AbstractDateTime);
$package("js.format");

js.format.MediumTime = function () {
    this.$super(js.format.DateFormat.getTimeInstance(js.format.DateFormat.MEDIUM));
};
$extends(js.format.MediumTime, js.format.AbstractDateTime);
$package("js.format");

js.format.Number = function () {
    this._numberFormat = new js.format.NumberFormat();
    this._numberFormat.setGroupingUsed(true);
    this._numberFormat.setMinimumFractionDigits(2);
    this._numberFormat.setMaximumFractionDigits(2);
};

js.format.Number.prototype = {
    format : function (number) {
        return this._numberFormat.format(number);
    },

    parse : function (string) {
        return this._numberFormat.parse(string);
    },

    test : function (string) {
        return this._numberFormat.test(string);
    },

    toString : function () {
        return "js.format.Number";
    }
};
$extends(js.format.Number, Object);
$implements(js.format.Number, js.format.Format);
$package("js.format");

js.format.NumberFormat = function (pattern) {
    var l = js.ua.Regional.language;
    var c = js.ua.Regional.country;
    var key = l.charAt(0).toUpperCase() + l.charAt(1) + "_" + c;

    var symbols = js.format.NumberFormat[key];
    if (typeof symbols === "undefined") {
        symbols = js.format.NumberFormat.En_US;
    }

    this._pattern = pattern;

    this._decimalSeparator = symbols.decimalSeparator;

    this._groupingSeparator = symbols.groupingSeparator;

    this._groupingUsed = false;

    this._minimumFractionDigits = 0;

    this._maximumFractionDigits = Number.POSITIVE_INFINITY;

    this._minimumIntegerDigits = 0;

    this._maximumIntegerDigits = Number.POSITIVE_INFINITY;

    this._validInput = null;
    this._compile();
};

js.format.NumberFormat.prototype = {
    setGroupingUsed : function (value) {
        this._groupingUsed = value;
        return this;
    },

    setMinimumFractionDigits : function (value) {
        this._minimumFractionDigits = value;
        if (this._minimumFractionDigits > this._maximumFractionDigits) {
            this._maximumFractionDigits = this._minimumFractionDigits;
        }
        return this;
    },

    setMaximumFractionDigits : function (value) {
        this._maximumFractionDigits = value;
        if (this._maximumFractionDigits < this._minimumFractionDigits) {
            this._minimumFractionDigits = this._maximumFractionDigits;
        }
        return this;
    },

    setMinimumIntegerDigits : function (value) {
        this._minimumIntegerDigits = value;
        if (this._minimumIntegerDigits > this._maximumIntegerDigits) {
            this._maximumIntegerDigits = this._minimumIntegerDigits;
        }
        return this;
    },

    setMaximumIntegerDigits : function (value) {
        this._maximumIntegerDigits = value;
        if (this._maximumIntegerDigits < this._minimumIntegerDigits) {
            this._minimumIntegerDigits = this._maximumIntegerDigits;
        }
        return this;
    },

    format : function (number) {
        var formattedNumber = this._formatNumericPart(number);
        return typeof this._pattern === "undefined" ? formattedNumber : this._injectNumericPart(formattedNumber);
    },

    _formatNumericPart : function (number) {
        var value = number.toString();
        var parts = value.split(".");
        var integerPart = parts[0], i;
        var fractionalPart = parts.length > 1 ? parts[1] : "";

        if (fractionalPart.length > this._maximumFractionDigits) {
            if (this._maximumFractionDigits === 0) {
                integerPart = (Number(integerPart) + Math.round("0." + fractionalPart)).toString();
                fractionalPart = "";
            }
            else {
                fractionalPart = this._round(fractionalPart, this._maximumFractionDigits);
                if (fractionalPart.length > this._maximumFractionDigits) {
                    fractionalPart = fractionalPart.substr(fractionalPart.length - this._maximumFractionDigits);
                    integerPart = (Number(integerPart) + 1).toString();
                }
            }
        }
        for (i = fractionalPart.length; i < this._minimumFractionDigits; ++i) {
            fractionalPart += "0";
        }

        for (i = integerPart.length; i < this._minimumIntegerDigits; ++i) {
            integerPart = "0" + integerPart;
        }
        if (integerPart.length > this._maximumIntegerDigits) {
            integerPart = this._round(integerPart, this._maximumIntegerDigits);
        }
        if (this._groupingUsed) {
            var rex = /(\d+)(\d{3})/;
            while (rex.test(integerPart)) {
                integerPart = integerPart.replace(rex, "$1" + this._groupingSeparator + "$2");
            }
        }

        value = integerPart;
        if (fractionalPart) {
            value += (this._decimalSeparator + fractionalPart);
        }
        return value;
    },

    parse : function (string) {
        if (string.length === 0) {
            return 0;
        }
        if (typeof this._pattern !== "undefined") {
            string = this._extractNumericPart(string);
        }
        return this._parseNumericPart(string);
    },

    _parseNumericPart : function (string) {
        if (!string) {
            return null;
        }
        if (this._groupingUsed) {
            var rex = new RegExp(js.util.Strings.escapeRegExp(this._groupingSeparator), "g");
            string = string.replace(rex, "");
        }
        if (this._decimalSeparator !== ".") {
            string = string.replace(this._decimalSeparator, ".");
        }
        return Number(string);
    },

    test : function (text) {
        if (typeof this._pattern === "undefined") {
            return this._testNumericPart(text);
        }

        var patternIndex = 0;
        var pattern = this._pattern;
        var textIndex = 0;
        var c;

        function skipNumericPart () {
            c = pattern.charAt(++patternIndex);
            while (textIndex < text.length && c !== text.charAt(textIndex)) {
                ++textIndex;
            }
            return textIndex;
        }

        for (; patternIndex < pattern.length; ++patternIndex, ++textIndex) {
            if (pattern.charAt(patternIndex) === "#") {
                if (!this._testNumericPart(text.substring(textIndex, skipNumericPart()))) {
                    return false;
                }
            }
            if (!js.util.Strings.equalsIgnoreCase(pattern.charAt(patternIndex), text.charAt(textIndex))) {
                return false;
            }
        }
        return true;
    },

    _testNumericPart : function (text) {
        if (!js.lang.Types.isString(text) || text.length === 0) {
            return false;
        }
        function isDigit (c) {
            return c >= "0" && c <= "9";
        }
        var i = 0;
        if (text.charAt(0) === "+" || text.charAt(0) === "-") {
            ++i;
        }
        for ( var c; i < text.length; ++i) {
            c = text.charAt(i);
            if (isDigit(c) || c === this._decimalSeparator) {
                continue;
            }
            if (this._groupingUsed && c === this._groupingSeparator) {
                continue;
            }
            return false;
        }
        return true;
    },

    _injectNumericPart : function (numericPart) {
        return this._pattern.replace("#", numericPart);
    },

    _extractNumericPart : function (source) {
        this._validInput.lastIndex = 0;
        var m = this._validInput.exec(source);
        if (m === null) {
            return null;
        }
        if (typeof m[1] === "undefined") {
            return null;
        }
        return m[1];
    },

    _round : function (number, digitsCount) {
        if (digitsCount === 0) {
            return "";
        }
        var s = number.substr(0, digitsCount) + "." + number.substr(digitsCount);
        s = Math.round(Number(s)).toString();
        while (s.length < digitsCount) {
            s = "0" + s;
        }
        return s;
    },

    _compile : function () {
        if (typeof this._pattern !== "undefined") {
            var rex = "([0-9" + this._decimalSeparator + this._groupingSeparator + "]+)";
            this._validInput = new RegExp("^" + js.util.Strings.escapeRegExp(this._pattern).replace("#", rex) + "$", "g");
        }
    },

    toString : function () {
        return "js.format.NumberFormat";
    }
};
$extends(js.format.NumberFormat, Object);
$implements(js.format.NumberFormat, js.format.Format);

js.format.NumberFormat.En_US = {
    decimalSeparator : ".",
    groupingSeparator : ",",
    infinity : "infinity"
};

js.format.NumberFormat.De_CH = {
    decimalSeparator : "'",
    groupingSeparator : ".",
    infinity : "unendlich"
};

js.format.NumberFormat.Ro_RO = {
    decimalSeparator : ",",
    groupingSeparator : ".",
    infinity : "infinit"
};
$package("js.format");

js.format.Percent = function () {
    this._numberFormat = new js.format.NumberFormat("@string/percent-format");
    this._numberFormat.setGroupingUsed(true);
    this._numberFormat.setMinimumFractionDigits(2);
    this._numberFormat.setMaximumFractionDigits(2);
};

js.format.Percent.prototype = {
    format : function (percent) {
        return this._numberFormat.format(100 * percent);
    },

    parse : function (string) {
        return this._numberFormat.parse(string) / 100;
    },

    test : function (string) {
        return this._numberFormat.test(string);
    },

    toString : function () {
        return "js.format.Percent";
    }
};
$extends(js.format.Percent, Object);
$implements(js.format.Percent, js.format.Format);
$package("js.format");

js.format.ShortDate = function () {
    this.$super(js.format.DateFormat.getDateInstance(js.format.DateFormat.SHORT));
};
$extends(js.format.ShortDate, js.format.AbstractDateTime);
$package('js.format');

js.format.ShortDateTime = function() {
    this.$super(js.format.DateFormat.getDateTimeInstance(js.format.DateFormat.SHORT, js.format.DateFormat.SHORT));
};
$extends(js.format.ShortDateTime, js.format.AbstractDateTime);
$package("js.format");

js.format.ShortTime = function() {
    this.$super(js.format.DateFormat.getTimeInstance(js.format.DateFormat.SHORT));
};
$extends(js.format.ShortTime, js.format.AbstractDateTime);
$package('js.format');

js.format.StandardDate = function () {
    this.$super(new js.format.DateFormat("yyyy-MM-dd"));
};
$extends(js.format.StandardDate, js.format.AbstractDateTime);
$package('js.format');

js.format.StandardDateTime = function() {
    this.$super(new js.format.DateFormat("yyyy-MM-dd HH:mm:ss"));
};
$extends(js.format.StandardDateTime, js.format.AbstractDateTime);
$package('js.format');

js.format.StandardTime = function () {
    this.$super(new js.format.DateFormat("HH:mm:ss"));
};
$extends(js.format.StandardTime, js.format.AbstractDateTime);
$package("js.fx");

js.fx.Anim = function () {
    var i, descriptor, defaultProperties, property;

    this._fxs = [];

    defaultProperties = {};
    for (i = 0; i < arguments.length; i++) {
        descriptor = arguments[i];
        if (descriptor.defaultProperties) {
            delete descriptor.defaultProperties;
            defaultProperties = descriptor;
            continue;
        }
        if (typeof descriptor.at !== "undefined") {
            continue;
        }

        for (property in defaultProperties) {
            if (typeof descriptor[property] === "undefined") {
                descriptor[property] = defaultProperties[property];
            }
        }
        this._fxs.push(new js.fx.Effect(descriptor));
    }

    this._FRAME_REQUEST_CALLBACK = this._render.bind(this);

    this._animationFrameRequestId = null;

    this._startTimestamp = null;

    this._events = new js.event.CustomEvents();
    this._events.register("anim-render");
    this._events.register("anim-stop");
};

js.fx.Anim.prototype = {
    on : function (type, listener, scope) {
        this._events.addListener(type, listener, scope || window);
        return this;
    },

    un : function (type, listener) {
        this._events.removeListener(type, listener);
        return this;
    },

    start : function () {
        this._fxs.forEach(function (fx) {
            fx.running = true;
        });
        this._startTimestamp = null;
        this._animationFrameRequestId = this._requestAnimationFrame(this._FRAME_REQUEST_CALLBACK);
    },

    stop : function () {
        if (this._animationFrameRequestId !== null) {
            this._fxs.forEach(function (fx) {
                fx.running = false;
            });
            if (this._animationFrameRequestId !== null) {
                this._cancelAnimationFrame(this._animationFrameRequestId);
            }
            this._animationFrameRequestId = null;
        }
    },

    _requestAnimationFrame : function (frameRequestCallback) {
        return window.requestAnimationFrame(frameRequestCallback);
    },

    _cancelAnimationFrame : function (animationFrameRequestId) {
        window.cancelAnimationFrame(animationFrameRequestId);
    },

    _render : function (timestamp) {
        var runningFxs;

        if (this._startTimestamp === null) {
            this._startTimestamp = timestamp;
        }
        timestamp -= this._startTimestamp;

        runningFxs = 0;
        this._fxs.forEach(function (fx) {
            var t, value;
            if (!fx.running) {
                return;
            }

            t = timestamp - fx.offset;
            if (t < 0) {
                return;
            }
            
            value = Math.round(fx.ttf(t, fx.origin, fx.magnitude, fx.duration));
            fx.render(value, timestamp);
            
            if (t > fx.duration) {
                fx.running = false;
            }
            else {
                runningFxs++;
            }
        }, this);

        if (runningFxs > 0) {
            this._events.fire("anim-render", timestamp);
            this._requestAnimationFrame(this._FRAME_REQUEST_CALLBACK);
            return;
        }

        // ensure every effect reach final value to cope with frame loss
        this._fxs.forEach(function (fx) {
            fx.render(fx.magnitude + fx.origin, timestamp);
        });
        this._events.fire("anim-stop", timestamp);
    },

    toString : function () {
        return "js.fx.Anim";
    }
};
$extends(js.fx.Anim, Object);

$legacy(typeof window.requestAnimationFrame !== "function", function () {
    if (typeof webkitRequestAnimationFrame === "function") {
        js.fx.Anim.prototype._requestAnimationFrame = function (frameRequestCallback) {
            return window.webkitRequestAnimationFrame(frameRequestCallback);
        };

        js.fx.Anim._cancelAnimationFrame = function (animationFrameRequestId) {
            window.webkitCancelAnimationFrame(animationFrameRequestId);
        };
    }
    else {
        js.fx.Anim.prototype._requestAnimationFrame = function (callback) {
            // since we are in degraded mode uses only 30 FPS
            return window.setTimeout(function () {
                callback(new Date().getTime() - js.lang.Operator._timestamp);
            }, 33);
        };

        js.fx.Anim._cancelAnimationFrame = function (timeoutId) {
            window.clearTimeout(timeoutId);
        };
    }
});
$package('js.fx');

js.fx.Config = {
    PX_UNITS : /width|height|top|bottom|left|right|margin|marginTop|marginRight|marginBottom|marginLeft|padding|paddingTop|paddingRight|paddingBottom|paddingLeft/i,

    DEF_DURATION : 1000
};
$package('js.fx');

js.fx.Descriptor = {
    el : null,

    offset : null,

    duration : null,

    style : null,

    units : null,

    from : null,

    to : null,

    ttf : null,

    render : null
};
$package("js.fx");

js.fx.Effect = function (descriptor) {
    this.running = false;

    this.offset = descriptor.offset || 0;

    this.duration = descriptor.duration || js.fx.Config.DEF_DURATION;

    this.ttf = descriptor.ttf || js.fx.TTF.Linear;

    this.style = descriptor.style;

    this.units = descriptor.units || (js.fx.Config.PX_UNITS.test(this.style) ? 'px' : '');

    this.origin = descriptor.from;

    this.magnitude = descriptor.to - descriptor.from;

    this.el = descriptor.el;

    this.render = descriptor.render ? descriptor.render : function (value, timestamp) {
        this.el.style.set(this.style, value + this.units);
    }
};
$extends(js.fx.Effect, Object);
$package('js.fx');

js.fx.TTF = {};

js.fx.TTF.Linear = function (timestamp, origin, magnitude, duration) {
    var tgalpha = magnitude / duration;
    return origin + tgalpha * timestamp;
};
$extends(js.fx.TTF.Linear, Object);

js.fx.TTF.Exponential = function (timestamp, origin, magnitude, duration) {
    timestamp /= duration;
    return origin + magnitude * timestamp * timestamp;
};
$extends(js.fx.TTF.Exponential, Object);

js.fx.TTF.Logarithmic = function (timestamp, origin, magnitude, duration) {
    return origin - magnitude * (timestamp /= duration) * (timestamp - 2);
};
$extends(js.fx.TTF.Logarithmic, Object);

js.fx.TTF.Swing = function (timestamp, origin, magnitude, duration) {
    var CYCLES = 4;
    var radians = CYCLES * 2 * Math.PI;
    var deltaR = radians / duration;
    var deltaM = magnitude / duration;
    return origin - Math.sin(timestamp * deltaR) * (magnitude - timestamp * deltaM);
};
$extends(js.fx.TTF.Swing, Object);
$package('js.lang');

js.lang.AssertException = function() {
    this.$super(arguments);

    this.name = 'j(s)-lib assertion';
};

js.lang.AssertException.prototype =
{
    toString: function() {
        return 'js.lang.AssertException';
    }
};
$extends(js.lang.AssertException, js.lang.Exception);
$package("js.lang");

js.lang.Class = {
	_CLASS_LOADER_URL : "js/core/JsClassLoader/loadClass.rmi",

	_cache : {},

	forName : function(className) {
		var clazz = this._cache[className];
		if (typeof clazz !== "undefined") {
			return clazz;
		}

		try {
			clazz = eval(className);
			// if package exists but class from package is missing class is undefined
		} catch (er) {
			// because evaluation works on a well formed class name and only tries
			// to get a reference - i.e. does not execute any code, there is no
			// reason for exception beside not found, which is proceeded below
		}
		if (typeof clazz === "undefined") {
			$debug("js.lang.Class#forName", "Class %s not found. Try to load it from server.", className);
			clazz = this._loadClass(className);
		}
		this._cache[className] = clazz;
		return clazz;
	},

	_loadClass : function(className) {
		// do not use js.net package in order to avoid circular dependencies
		var xhr = new XMLHttpRequest();

		xhr.open("POST", this._CLASS_LOADER_URL, false);
		xhr.timeout = 4000;
		xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
		xhr.setRequestHeader("Accept", "text/javascript");

		try {
			xhr.send(js.lang.JSON.stringify(className));
			// we do not need sanity check since script comes from the same domain
			eval(xhr.responseText);
			return eval(className);
		} catch (er) {
			$error("js.lang.Class#loadClass", er);
		}
		return null;
	},

	getResource : function(className, resourceName) {

	},

	toString : function() {
		return "js.lang.Class";
	}
};
$package("js.lang");

js.lang.JSON = {
    parse : function (json) {
        return JSON.parse(json, function (key, value) {
            if (js.lang.Types.isString(value)) {
                var d = js.lang.JSON._json2date(value);
                if (d !== null) {
                    return d;
                }
            }
            return value;
        });
    },

    stringify : function (value) {
        return JSON.stringify(value);
    },

    load : function (url, callback, scope) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onreadystatechange = handler.bind(this);
        xhr.send();

        function handler (evtXHR) {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 || xhr.status < 300) {
                    callback.call(scope, JSON.parse(xhr.responseText));
                }
                else {
                    js.ua.System.alert("Invocation Errors Occured");
                }
            }
        }
    },

    _REX_DATE : /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?Z$/i,

    _json2date : function (json) {
        // if given argument is not a valid json date it can have arbitrary length, including large
        // i"m pretty sure regexp#match is smart enough to quickly exit and i do not filter json argument by length

        this._REX_DATE.lastIndex = 0;
        var m = json.match(this._REX_DATE);
        if (m === null) {
            return null;
        }
        if (typeof m[7] === "undefined") {
            // WebKit and Presto doesn"t use milliseconds while Trident and Gecko does
            // defaults milliseconds to zero if missing
            m[7] = 0;
        }
        m.shift(); // m[0] is matched string, i.e. the ISO8601 date representation
        m[1] -= 1; // convert month ordinal into index

        // serialized JSON date is UTC date, that why ends with "Z"
        // first uses Date#UTC to get the UTC time - number of milliseconds from epoch
        // then create a local date instance
        // so, if UTC time is 0 create date instance if Thu Jan 01 1970 02:00:00 GMT+0200, in my case
        return new Date(Date.UTC.apply(Date.UTC, m));
    },

    toString : function () {
        return "js.lang.JSON";
    }
};

$legacy(js.ua.Engine.TRIDENT, function () {
    Date.prototype.toJSON = function () {
        function f (n) {
            return n < 10 ? "0" + n : n;
        }
        return this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z";
    };
});
$package('js.lang');

js.lang.NOP = function () {
};
$extends(js.lang.NOP, Object);
$package("js.lang");

js.lang.OPP = {
    get : function (obj, opp) {
        return this._get(obj, opp.split("."), 0);
    },

    _get : function (obj, opp, i) {
        if (typeof obj !== "undefined" && obj !== null && i < opp.length) {
            obj = this._get(obj[opp[i++]], opp, i);
        }
        return obj;
    },

    set : function (obj, opp, value) {
        this._set(obj, opp.split("."), 0, value);
    },

    _set : function (obj, opp, i, value) {
        // iterate till OPP right most element
        if (i === opp.length - 1) {
            obj[opp[i]] = value;
            return;
        }

        obj = obj[opp[i]];
        if (obj === null || typeof obj !== "object") {
            return;
        }
        ++i;
        obj = this._set(obj, opp, i, value);
    },

    toString : function () {
        return "js.lang.OPP";
    }
};
$package("js.lang");

js.lang.Uniterator = function (value) {
    if (arguments.length !== 1) {
        value = js.lang.Uniterator._EMPTY_ARRAY;
    }
    else if (typeof value === "undefined") {
        value = js.lang.Uniterator._UNDEF_ARRAY;
    }
    else if (value === null) {
        value = js.lang.Uniterator._NULL_ARRAY;
    }
    else if (js.lang.Types.isFunction(value.it)) {
        return value.it();
    }

    if (!js.lang.Types.isNodeList(value)) {
        if (!js.lang.Types.isArray(value)) {
            value = [ value ];
        }
        value.item = function (index) {
            return this[index];
        };
    }

    this._items = value;

    this._index = 0;
};

js.lang.Uniterator._EMPTY_ARRAY = [];

js.lang.Uniterator._UNDEF_ARRAY = [ undefined ];

js.lang.Uniterator._NULL_ARRAY = [ null ];

js.lang.Uniterator.prototype = {
    hasNext : function () {
        return this._index < this._items.length;
    },

    next : function () {
        return this._items.item(this._index++);
    },

    toString : function () {
        return "js.lang.Uniterator";
    }
};
$extends(js.lang.Uniterator, Object);
$implements(js.lang.Uniterator, js.lang.Iterator);
$package('js.net');

js.net.Method = {
	DELETE : 'DELETE',

	GET : 'GET',

	HEAD : 'HEAD',

	OPTIONS : 'OPTIONS',

	POST : 'POST',

	PUT : 'PUT'
};
$package('js.net');

js.net.ReadyState =
{
    UNSENT: 0,

    OPENED: 1,

    HEADERS_RECEIVED: 2,

    LOADING: 3,

    DONE: 4
};
$package("js.net");

js.net.RMI = function () {
    this._remoteContextURL = null;

    this._forceSynchronousMode = false;

    if (arguments.length > 0) {
        if (arguments.length === 1) {
            if (js.lang.Types.isString(arguments[0])) {
                this._remoteContextURL = arguments[0];
            }
            else {
                this._forceSynchronousMode = arguments[0];
            }
        }
        else {
            this._remoteContextURL = arguments[0];

            this._forceSynchronousMode = arguments[1];
        }
    }

    this._className = null;

    this._methodName = null;

    this._parameters = null;

    this._callback = null;

    this._scope = null;

    this._errorHandler = null;

    this._errorHandlerScope = null;

    this._xhr = null;
};

js.net.RMI._loopValues = {};

js.net.RMI.setLoop = function (remoteClass, remoteMethod, value) {
    this._loopValues[remoteClass + "$" + remoteMethod] = value;
};

js.net.RMI.removeLoop = function (remoteClass, remoteMethod) {
    delete this._loopValues[remoteClass + "$" + remoteMethod];
};

js.net.RMI._hasLoop = function (rmi) {
    return typeof this._loopValues[rmi._className + "$" + rmi._methodName] !== "undefined";
};

js.net.RMI._getLoopValue = function (rmi) {
    return this._loopValues[rmi._className + "$" + rmi._methodName];
};

js.net.RMI.prototype = {
    setMethod : function (className, methodName) {
        if (className && methodName) {
            this._className = className;
            this._methodName = methodName;
        }
        return this;
    },

    setParameters : function (parameters) {
        if (typeof parameters === "undefined") {
            return this;
        }

        if (parameters !== null && typeof parameters.callee === "function") {
            var startIdx = arguments.length > 1 ? arguments[1] : 0;
            if (startIdx >= arguments[0].length) {
                return this;
            }
            var args = [];
            for (var i = startIdx; i < arguments[0].length; i++) {
                args.push(arguments[0][i]);
            }
            this.setParameters.apply(this, args);
            return this;
        }

        // remote parameters are send using HTTP request message body encoded as JSON array
        // anyway, DOM documents and forms are special cases, they are encoded as XML or multipart
        // if last cases, parameters to send are actually an object but not an array
        if (arguments.length >= 1 && (arguments[0] instanceof js.dom.Document || arguments[0] instanceof js.dom.Form)) {
            this._parameters = arguments[0];
            return this;
        }

        this._parameters = [];
        for (var i = 0; i < arguments.length; ++i) {
            if (typeof arguments[i] !== "undefined") {
                this._parameters.push(arguments[i]);
            }
        }
        return this;
    },

    setErrorHandler : function (errorHandler, errorHandlerScope) {
        this._errorHandler = errorHandler;
        this._errorHandlerScope = errorHandlerScope;
        return this;
    },

    exec : function (callback, scope) {
        this._callback = callback;
        this._scope = scope || window;
        if (js.net.RMI._hasLoop(this)) {
            try {
                return this._onLoad(js.net.RMI._getLoopValue(this));
            } catch (er) {
                js.ua.System.error(er);
                return null;
            }
        }

        // class and method names are conveyed using HTTP request URI
        // so, "comp.prj.Class" and "method" becomes "comp/prj/Class/method.rmi"
        // if this RMI is performed cross domain insert remote context at url begin
        // in this case request URI may be: http://host/context/comp/prj/Class/method.rmi
        var requestURI = "";
        if (this._remoteContextURL !== null) {
            requestURI += this._remoteContextURL;
            requestURI += '/';
        }
        requestURI += (this._className.replace(/\./g, "/") + "/" + this._methodName + ".rmi");
        $debug("js.net.RMI#exec", "RMI call on %s(%s).", requestURI, this._parameters !== null ? this._parameters.toString() : "");

        this._xhr = new js.net.XHR();
        this._xhr.on("load", this._onLoad, this);
        if (this._errorHandler !== null) {
            this._xhr.on("error", this._errorHandler, this._errorHandlerScope || window);
        }
        this._xhr.open(js.net.Method.POST, requestURI, !this._forceSynchronousMode);
        var remoteValue = this._xhr.send(this._parameters);
        return this._forceSynchronousMode ? remoteValue : undefined;
    },

    _onLoad : function (value) {
        if (this._callback) {
            this._callback.call(this._scope, value);
        }
        delete this._callback;
        delete this._scope;
        delete this._xhr;
    },

    toString : function () {
        return "js.net.RMI";
    }
};
$extends(js.net.RMI, Object);
$package("js.net");

js.net.WebSocket = function () {
    var url, subProtocol;
    if (arguments.length === 2) {
        url = arguments[0];
        subProtocol = arguments[1];
    }
    else {
        var u = WinMain.url;
        url = $format("ws://%s:%d/%s/sock.wsp", u.host, u.port, u.path);
        subProtocol = arguments[0];
    }
    this._events = new js.event.CustomEvents();
    this._events.register("open", "close", "message", "error");

    this._sock = new WebSocket(url, subProtocol);
    this._sock.onopen = this._onopen.bind(this);
    this._sock.onclose = this._onclose.bind(this);
    this._sock.onmessage = this._onmessage.bind(this);
    this._sock.onerror = this._onerror.bind(this);
};

js.net.WebSocket.prototype = {
    on : function (type, listener, scope) {
        this._events.addListener(type, listener, scope || window);
        return this;
    },

    send : function (data) {
        this._sock.send(JSON.stringify(data));
        return this;
    },

    close : function () {
        this._sock.close();
    },

    _onopen : function () {
        this._events.fire("open");
    },

    _onclose : function () {
        this._events.fire("close");
    },

    _onmessage : function (message) {
        var data = JSON.parse(message.data);
        this._events.fire("message", data);
    },

    _onerror : function () {
        this._events.fire("error");
    },

    toString : function () {
        return "js.net.WebSocket";
    }
};
$extends(js.net.WebSocket, Object);
$package("js.net");

js.net.XHR = function() {
	this._request = new XMLHttpRequest();

	this._state = js.net.XHR.StateMachine.CREATED;

	this._synchronousMode = false;

	this._timeout = new js.util.Timeout(0);
	this._timeout.setCallback(this._onTimeout, this);

	this._events = new js.event.CustomEvents();
	this._events.register("progress", "error", "timeout", "load", "loadend");
};

js.net.XHR.SYNC_TIMEOUT = 4000;

js.net.XHR.VALID_HEADER = /^[A-Z0-9\-\/\s,\.]+$/gi;

js.net.XHR.prototype = {
	on : function(type, listener, scope) {
		if (type === "progress") {
			this._request.upload.addEventListener("progress", function(ev) {
				this._events.fire("progress", ev);
			}.bind(this));
		}
		this._events.addListener(type, listener, scope || window);
		return this;
	},

	setTimeout : function(timeout) {
		this._timeout.set(timeout);
		return this;
	},

	setHeader : function(header, value) {
		function isValid(str) {
			js.net.XHR.VALID_HEADER.lastIndex = 0;
			return str && js.net.XHR.VALID_HEADER.test(str);
		}
		return this._setHeader(header, value);
	},

	_setHeader : function(header, value) {
		this._request.setRequestHeader(header, value);
		return this;
	},

	getHeader : function(header) {
		return this._request.getResponseHeader(header);
	},

	getStatus : function() {
		return window.parseInt(this._request.status, 10);
	},

	getStatusText : function() {
		return this._request.statusText;
	},

	open : function(method, url, async, user, password) {
		this._state = js.net.XHR.StateMachine.OPENED;

		if (typeof async === "undefined") {
			async = true;
		}
		this._synchronousMode = !async;
		if (this._synchronousMode && this._timeout.get() === 0) {
			this._timeout.set(js.net.XHR.SYNC_TIMEOUT);
		}
		if (async) {
			this._request.onreadystatechange = this._onReadyStateChange.bind(this);
		}
		this._request.open(method, url, async, user, password);

		this._request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		this._request.setRequestHeader("Cache-Control", "no-cache");
		this._request.setRequestHeader("Cache-Control", "no-store");
		this._request.setRequestHeader("Accept", "application/json, text/xml, text/plain");
		return this;
	},

	send : function(data) {
		this._state = js.net.XHR.StateMachine.SENDING;

		// send void --------------------------------------
		if (typeof data === "undefined" || data === null) {
			// do not set Content-Type if data is null or undefined
			this._timeout.start();
			this._request.send();
		}

		// send string ------------------------------------
		else if (js.lang.Types.isString(data)) {
			this._request.setRequestHeader("Content-Type", "text/plain; charset=UTF-8");
			this._timeout.start();
			this._request.send(data);
		}

		// send document ----------------------------------
		else if (data instanceof js.dom.Document) {
			this._request.setRequestHeader("Content-Type", "text/xml; charset=UTF-8");
			this._timeout.start();
			this._request.send(data.getDocument());
		}

		// send form --------------------------------------
		else if (data instanceof js.dom.Form) {
			// relies on browser to set the proper multipart content type and boundaries
			this._request.send(data.toFormData());
			// upload duration may naturally vary from seconds to minutes and is hardly predictable
			// for this reason sending forms doesn't use timeout but relies on abort and progress events
		}

		// send file --------------------------------------
		else if (data instanceof File) {
			var formData = new FormData();
			formData.append(data.name, data);
			this._request.send(formData);
		}

		// send object ------------------------------------
		else {
			this._request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
			this._timeout.start();
			this._request.send(js.lang.JSON.stringify(data));
		}

		if (this._synchronousMode) {
			this._timeout.stop();
			return this._processResponse();
		}
	},

	abort : function() {
		// here we face a race condition
		// send has executed; as a consequence a separate thread is created for XHR transaction
		// we are in current thread executing abort but there is no guaranty meanwhile transaction
		// thread was not already executed finalization from ready state handler

		try {
			this._request.onreadystatechange = null;
			this._timeout.stop();
			this._request.abort();
			this._state = js.net.XHR.StateMachine.ABORTED;
			this._events.fire("loadend");
		} catch (er) {
			$error("js.net.XHR#abort", er);
		}
	},

	_onReadyStateChange : function() {
		if (this._request.readyState === js.net.ReadyState.DONE) {
			try {
				this._timeout.stop();
				var response = this._processResponse();
				if (typeof response !== "undefined") {
					this._events.fire("load", response);
				}
			} catch (er) {
				js.ua.System.error(er);
			} finally {
				try {
					this._events.fire("loadend");
				} catch (er) {
					$error("js.net.XHR#_onReadyStateChange", "Error on loadend listeners: %s.", er);
				}
			}
		}
	},

	_processResponse : function() {
		var er, contentType;

		// j(s)-lib server side HTTP response status code can be only:
		// 200 - success, redirect with X-JSLIB-Location or text/html content
		// 204 - success with not content, that is, void remote method
		// 400 - client request fail to obey a business constrain, e.g. employee SSN is not unique
		// 500 - internal server error

		if (this._request.status === 500) {
			er = JSON.parse(this._request.responseText);
			$debug("js.net.XHR#_processResponse", "Server side error: %s: %s", er.cause, er.message);
			if (this._events.hasListener("error")) {
				this._events.fire("error", er);
			}
			else {
				WinMain.page.onServerFail(er);
			}
			this._state = js.net.XHR.StateMachine.ERROR;
			return undefined;
		}

		contentType = this._request.getResponseHeader("Content-Type");
		if (this._request.status === 400) {
			er = js.lang.JSON.parse(this._request.responseText);
			$debug("js.net.XHR#_processResponse", "Broken business constrain: 0x%4X", er.errorCode);
			WinMain.page.onBusinessFail(er);
			this._state = js.net.XHR.StateMachine.ERROR;
			return undefined;
		}

		if (this._request.status < 200 || this._request.status >= 300) {
			$error("js.net.XHR#_processResponse", "Invalid server response status code |%s|.", this._request.status);
			throw new js.lang.Exception("Invalid server response.");
		}

		// at this point status code is in 200 range meaning loading with success

		// under normal use case response is an object, or array for that mater, encoded JSON, XML or plain text
		// anyway, if server application uses container provided security is possible, e.g. when session expires, to
		// have HTML page, perhaps a login form or an error page
		// if response content type is text/html reload the page to force redirect to login

		// using text/html to signal session end and to reload page prevents using HTML as valid response for XHR
		// anyway, for time being I do not see use case for HTML response; one may be layout loaded dynamically but
		// there one can use XML

		if (contentType === "text/html") {
			$error("js.net.XHR#_processResponse", "Got HTML page from server, most probably login form. Force page reload.");
			WinMain.reload();
			return undefined;
		}

		this._state = js.net.XHR.StateMachine.DONE;
		var redirect = this._request.getResponseHeader("X-JSLIB-Location");
		// XMLHttpRequest mandates null for not existing response header but there is at least one browser that returns
		// empty string; so we need to test for both conditions
		if (redirect) {
			$debug("js.net.XHR#_processResponse", "Server side redirect to |%s|.", redirect);
			WinMain.assign(redirect);
			return undefined;
		}

		// process server response considering its content type
		if (contentType && contentType.indexOf("xml") !== -1) {
			return new js.dom.Document(this._request.responseXML);
		}
		if (contentType && contentType.indexOf("json") !== -1) {
			return js.lang.JSON.parse(this._request.responseText);
		}
		// content type is neither JSON or XML; process it as text
		return this._request.responseText;
	},

	_onTimeout : function() {
		this._events.fire("timeout");
		this.abort();
	},

	toString : function() {
		return "js.net.XHR";
	}
};
$extends(js.net.XHR, Object);

js.net.XHR.StateMachine = {
	CREATED : 0,

	OPENED : 1,

	SENDING : 2,

	ABORTED : 3,

	DONE : 4,

	ERROR : 5
};

function $rest(restPath, callback, scope) {
	var xhr = new js.net.XHR();
	xhr.on("load", callback, scope);
	xhr.open("POST", restPath);
	xhr.send();
};
$package("js.ua");

js.ua.Cookies = {
    MAX_LENGTH : 4096,

    set : function (name, value, expires, path, domain, secure) {
        // convert value to string and store type information as comments suffix
        // suffix is as follow:
        // -b boolean
        // -n number
        // -d date
        // -s string
        // -o object
        // -a array
        var comment = "j(s)-lib-";
        if (js.lang.Types.isBoolean(value)) {
            comment += "b";
            value = value ? "true" : "false";
        }
        else if (js.lang.Types.isNumber(value)) {
            comment += "n";
            value = value.toString();
        }
        else if (js.lang.Types.isDate(value)) {
            comment += "d";
            value = js.lang.JSON.stringify(value);
        }
        else if (js.lang.Types.isString(value)) {
            comment += "s";
        }
        else if (js.lang.Types.isArray(value)) {
            comment += "a";
            value = js.lang.JSON.stringify(value);
        }
        else {
            comment += "o";
            value = js.lang.JSON.stringify(value);
        }

        var cookie = name + "=" + escape(value) + ("; comment=" + comment) + (expires ? "; expires=" + expires.toGMTString() : "") + (path ? "; path=" + path : "") + (domain ? "; domain=" + domain : "") + (secure ? "; secure" : "");
        this._setCookie(cookie);
    },

    get : function (name, value, expires) {
        var cookies = this._getCookies();
        var rex = new RegExp("(?:^|.*;\\s*)" + name + "\\s*\\=\\s*([^;]+)(?:;\\s*comment=j\\(s\\)\\-lib\\-([bndsoa]))?.*");
        var match = rex.exec(cookies);
        if (match !== null && match.length > 1) {
            value = unescape(match[1]);
            switch (match[2]) {
            case "b":
                return value === "true" ? true : false;
            case "n":
                return Number(value);
            case "d":
            case "o":
            case "a":
                return js.lang.JSON.parse(value);
            }
            return value;
        }
        if (typeof value !== "undefined") {
            this.set(name, value, expires);
            return value;
        }
        return null;
    },

    has : function (name) {
        var cookies = this._getCookies();
        var rex = new RegExp("(?:^|;\\s*)" + name + "\\s*\\=");
        return rex.test(cookies);
    },

    remove : function (name) {
        if (this.has(name)) {
            var cookie = name + "=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/";
            this._setCookie(cookie);
        }
    },

    isEnabled : function () {
        return navigator.cookieEnabled;
    },

    _INVALID_NAME : /^(?:comment|expires|max\-age|path|domain|secure|version)$|^\$|[;=\s]+/,

    isValidName : function (name) {
        if (!name || !js.lang.Types.isString(name)) {
            return false;
        }
        this._INVALID_NAME.lastIndex = 0;
        return !this._INVALID_NAME.test(name);
    },

    isValidValue : function (value) {
        if (!value || !js.lang.Types.isString(value)) {
            return false;
        }
        return value.indexOf(";") === -1;
    },

    _setCookie : function (cookie) {
        document.cookie = cookie;
    },

    _getCookies : function () {
        return document.cookie;
    },

    toString : function () {
        return "js.ua.Cookies";
    }
};

$legacy(js.ua.Engine.WEBKIT, function () {
    js.ua.Cookies.isEnabled = function () {
        // use UUID to ensure name does not collide with some one used by application code
        var name = js.util.UUID();
        this.set(name, "fake-value");
        if (this.get(name) === null) {
            return false;
        }
        this.remove(name);
        return true;
    };
});
$package('js.ua');

js.ua.Orientation = {
	NONE : 0,

	LANDSCAPE : 1,

	PORTRAIT : 2
};
$package("js.ua");

js.ua.Page = function() {
	js.ua.Regional.init();
};

js.ua.Page._ctor = js.ua.Page;

js.ua.Page.preCreate = null;

js.ua.Page.extendsSubClass = function(pageSubClass) {
	$debug("js.ua.Page.$extends", "Subclass window page %s", pageSubClass);
	pageSubClass.$extends = js.ua.Page.extendsSubClass;
	js.ua.Page._ctor = pageSubClass;
};

js.ua.Page.$extends = function(pageSubClass) {
	$debug("js.ua.Page.$extends", "Subclass window page %s", pageSubClass);
	pageSubClass.$extends = js.ua.Page.extendsSubClass;

	js.ua.Page._ctor = pageSubClass;

	WinMain.on("pre-dom-ready", function() {
		function createMainPage() {
			$debug("js.ua.Page#pre-dom-ready", "Create main page %s.", js.ua.Page._ctor);
			WinMain.page = new js.ua.Page._ctor();
		}

		if (js.ua.Page.preCreate !== null) {
			$debug("js.ua.Page#pre-dom-ready", "Execute preCreate for main page %s.", js.ua.Page._ctor);
			js.ua.Page.preCreate.call(js.ua.Page._ctor.prototype, createMainPage);
		}
		else {
			createMainPage();
		}
	});
};

js.ua.Page.prototype = {
	setIdleTimeout : function(value) {
		js.event.Handler.idleTimeout.set(value * 60 * 1000);
	},

	onIdleTimeout : function() {
		$debug("js.ua.Page#onIdleTimeout", "Idle timeout detected.");
	},

	onServerFail : function(er) {
		js.ua.System.error(er.cause + "\n" + er.message);
	},

	onBusinessFail : function(er) {
		js.ua.System.error("Broken business constrain: 0x%4X", er.errorCode);
	},

	getById : function(id) {
		return WinMain.doc.getById(id);
	},

	getByTag : function(tag) {
		return WinMain.doc.getByTag(tag);
	},

	getByCss : function(selectors, args) {
		return WinMain.doc.getByCss(selectors, args);
	},

	getByCssClass : function(cssClass) {
		return WinMain.doc.getByCssClass(cssClass);
	},

	getByClass : function(clazz) {
		return WinMain.doc.getByClass(clazz);
	},

	getByName : function(name) {
		return WinMain.doc.getByName(name);
	},

	findByTag : function(tag) {
		return WinMain.doc.findByTag(tag);
	},

	findByCss : function(selectors) {
		return WinMain.doc.findByCss(selectors);
	},

	findByCssClass : function(cssClass) {
		return WinMain.doc.findByCssClass(cssClass);
	},

	findByClass : function(clazz) {
		return WinMain.doc.findByClass(clazz);
	},

	findByName : function(name) {
		return WinMain.doc.findByName(name);
	},

	on : function(type, listener, scope, capture) {
		WinMain.doc.on(type, listener, scope, capture);
	},

	_registerButtonKeys : function() {
		var buttonKeys = {};
		var it = $L("button[data-key]").it(), button;
		while (it.hasNext()) {
			button = it.next();
			buttonKeys[button.getAttr("data-key").charCodeAt(0)] = button.getNode();
		}

		$E("body").focus().on("keydown", function(ev) {
			if (ev.altKey && ev.key !== 18) {
				if (ev.key in buttonKeys) {
					var evt = document.createEvent("MouseEvents");
					evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
					buttonKeys[ev.key].dispatchEvent(evt);
				}
				ev.halt();
			}
		});
	},

	toString : function() {
		return "js.ua.Page";
	}
};
$extends(js.ua.Page, Object);
$package('js.ua');

js.ua.Regional = {
    LANGUAGE_COOKIE : 'js.LANGUAGE',

    COUNTRY_COOKIE : 'js.COUNTRY',

    TIMEZONE_COOKIE : 'js.TIMEZONE',

    language : 'en',

    country : 'US',

    timeZone : 'UTC',

    init : function () {
        var locale = this._getUserAgentLocale();
        if (!locale) {
            locale = this.language + '-' + this.country;
        }
        if (js.lang.Types.isString(locale)) {
            locale = locale.split('-');
            if (locale.length !== 2) {
                locale = [ this.language, this.country ];
            }
        }

        var language = js.ua.Cookies.get(this.LANGUAGE_COOKIE);
        if (language === null) {
            language = locale[0];
        }
        if (language) {
            this.language = language.toLowerCase();
        }

        var country = js.ua.Cookies.get(this.COUNTRY_COOKIE);
        if (country === null) {
            country = locale[1];
        }
        if (this.country) {
            this.country = country.toUpperCase();
        }

        var timeZone = js.ua.Cookies.get(this.TIMEZONE_COOKIE);
        if (timeZone !== null) {
            this.timeZone = timeZone;
        }
    },

    _getUserAgentLocale : function () {
        return navigator.language;
    },

    toString : function () {
        return 'js.ua.Regional';
    }
};

$legacy(js.ua.Engine.TRIDENT, function () {
    js.ua.Regional._getUserAgentLocale = function () {
        return navigator.userLanguage;
    };
});
$package('js.util');

js.util.AbstractTimer = function(value, callback, scope) {
	if (typeof value === 'undefined') {
		value = 0;
	}

	this._value = value;

	this._id = null;

	if (typeof callback !== 'undefined') {
		this.setCallback(callback, scope);
	}
};

js.util.AbstractTimer.prototype = {
	set : function(value) {
		if (js.lang.Types.isString(value)) {
			value = Number(value);
		}
		if (value === 0) {
			this.stop();
		}
		if (value >= 0) {
			this._value = value;
		}
		return this;
	},

	get : function() {
		return this._value;
	},

	setCallback : function(callback, scope) {
		this._callback = callback;

		this._scope = scope || window;

		return this;
	},

	start : function() {
		if (this._value > 0) {
			if (this._id !== null) {
				this._stop(this._id);
				this._id = null;
			}
			this._id = this._start(this._handler.bind(this), this._value);
		}
		return this;
	},

	_handler : function() {
		try {
			if (this._callback) {
				this._callback.call(this._scope);
			}
			this._tick();
		} catch (er) {
			this.stop();
			js.ua.System.error(er);
		}
	},

	stop : function() {
		if (this._id !== null) {
			this._stop(this._id);
			this._id = null;
		}
		return this;
	},

	isTicking : function() {
		return this._id !== null;
	},

	_start : function(handler, value) {
	},

	_stop : function(timerID) {
	},

	_tick : function() {
	},

	toString : function() {
		return 'js.util.AbstractTimer';
	}
};
$extends(js.util.AbstractTimer, Object);
$package("js.util");

js.util.ID = function () {
    ++js.util.ID._seed;

    this._value = js.util.ID._seed.toString(36);

    if (this === js.util) {
        // if used as function this points to package scope
        return this._value;
    }
};

js.util.ID._seed = 0;

js.util.ID.prototype = {
    valueOf : function () {
        return this._value;
    },

    toString : function () {
        return "js.util.ID";
    }
};
$extends(js.util.ID, Object);
$package('js.util');

js.util.Rand = function () {
    var start, length;

    if (arguments.length === 0) {
        start = 0;
        length = Number.MAX_VALUE;
    }
    else if (arguments.length === 1) {
        length = arguments[0];
        start = 0;
    }
    else {
        start = arguments[0];
        length = arguments[1];
    }

    this._start = start;

    this._length = length;

    if (this === js.util) {
        // if used as function this points to package scope
        return js.util.Rand.prototype._next(this._start, this._length);
    }
};

js.util.Rand.prototype = {
    next : function () {
        return this._next(this._start, this._length);
    },

    _next : function (start, length) {
        return start + Math.floor(Math.random() * length);
    },

    toString : function () {
        return 'js.util.Rand';
    }
};
$extends(js.util.Rand, Object);
$package('js.util');

js.util.Strings = {
    trim : function (str) {
        return str.trim();
    },

    REGEXP_PATTERN : /([\/|\.|\*|\?|\||\(|\)|\[|\]|\{|\}|\\|\^|\$])/g,

    escapeRegExp : function (str) {
        js.util.Strings.REGEXP_PATTERN.lastIndex = 0;
        return str.replace(js.util.Strings.REGEXP_PATTERN, '\\$1');
    },

    equalsIgnoreCase : function (reference, target) {
        if (typeof reference === 'undefined') {
            return false;
        }
        if (typeof target === 'undefined') {
            return false;
        }

        if (reference === null && target === null) {
            return true;
        }
        if (reference === null || target === null) {
            return false;
        }
        return reference.toLocaleLowerCase() === target.toLocaleLowerCase();
    },

    startsWith : function (str, prefix) {
        if (!str) {
            return false;
        }
        return str.indexOf(prefix) === 0;
    },

    endsWith : function (str, suffix) {
        if (!str) {
            return false;
        }
        return (str.length >= suffix.length) && str.lastIndexOf(suffix) === str.length - suffix.length;
    },

    contains : function (str, value) {
        return str ? str.indexOf(value) !== -1 : false;
    },

    toTitleCase : function (str) {
        return str ? (str.charAt(0).toUpperCase() + str.substr(1).toLowerCase()) : '';
    },

    toHyphenCase : function (str) {
        if (!str) {
            return '';
        }
        var s = str.charAt(0).toLowerCase();
        s += str.substr(1).replace(/([A-Z][^A-Z]*)/g, function ($0, $1) {
            return '-' + $1.toLowerCase();
        });
        return s;
    },

    toScriptCase : function (str) {
        if (!str) {
            return '';
        }
        if (str.valueOf() == 'float') {
            return js.ua.Engine.TRIDENT ? 'styleFloat' : 'cssFloat';
        }
        if (str.indexOf('-') === -1) {
            return str.valueOf();
        }
        return str.replace(/\-(\w)/g, function ($0, $1) {
            return $1.toUpperCase();
        });
    },

    toPlainText : function(text, offset, length) {
        if (typeof offset === "undefined") {
            offset = 0;
        }
        if (typeof length === "undefined") {
            length = Number.MAX_VALUE;
        }

        var TEXT = 0;
        var START_TAG = 1;
        var END_TAG = 2;
        var state = TEXT;

        var plainText = "";
        for (var i = offset, c; i < text.length && plainText.length <= length; ++i) {
            c = text.charAt(i);

            switch (state) {
            case TEXT:
                if (c === '<') {
                    state = START_TAG;
                    break;
                }
                plainText += c;
                break;

            case START_TAG:
                if (c === '/') {
                    state = END_TAG;
                    break;
                }
                if (c === '>') {
                    state = TEXT;
                }
                break;

            case END_TAG:
                if (c === 'p') {
                    plainText += "\r\n";
                }
                if (c === '>') {
                    state = TEXT;
                }
                break;
            }
        }
        return plainText;
    },

    charsCount : function (str, ch) {
        if (!str) {
            return 0;
        }
        var count = 0;
        for ( var i = 0; i < str.length; ++i) {
            if (str.charAt(i) === ch) {
                ++count;
            }
        }
        return count;
    },

    last : function (str, separator) {
        return str.substr(str.lastIndexOf(separator) + 1);
    },

    _PACKAGE_NAME_REX : js.lang.Operator._PACKAGE_NAME_REX,

    isPackageName : function (name) {
        this._PACKAGE_NAME_REX.lastIndex = 0;
        return name && this._PACKAGE_NAME_REX.test(name);
    },

    _CLASS_NAME_REX : js.lang.Operator._CLASS_NAME_REX,

    isQualifiedClassName : function (name) {
        this._CLASS_NAME_REX.lastIndex = 0;
        return name && this._CLASS_NAME_REX.test(name);
    },

    parseNameValues : function (expression) {
        // sample expression: "name0:value0;name1:value1;"

        var pairs = [];
        if (!expression) {
            return pairs;
        }

        var semicolonIndex = 0, colonIndex, name;
        for (;;) {
            colonIndex = expression.indexOf(':', semicolonIndex);
            if (colonIndex === -1) {
                break;
            }
            name = expression.substring(semicolonIndex, colonIndex);

            ++colonIndex;
            semicolonIndex = expression.indexOf(';', colonIndex);
            if (semicolonIndex === -1) {
                semicolonIndex = expression.length;
            }
            pairs.push({
                name : name,
                value : expression.substring(colonIndex, semicolonIndex)
            });
            ++semicolonIndex;
        }

        return pairs;
    },

    toString : function () {
        return 'js.util.Strings';
    }
};

$legacy(js.ua.Engine.TRIDENT, function () {
    js.util.Strings.TRIM_PATTERN = /^\s+|\s+$/g;

    js.util.Strings.trim = function (str) {
        js.util.Strings.TRIM_PATTERN.lastIndex = 0;
        return str.replace(js.util.Strings.TRIM_PATTERN, '');
    };
});
$package('js.util');

js.util.Timeout = function(timeout, callback, scope) {
	if (!(this instanceof js.util.Timeout)) {
		// if constructor invoked as function this points to package scope
		var t = new js.util.Timeout(timeout, callback, scope);
		t.start();
		return t;
	}
	this.$super(timeout, callback, scope);
};

js.util.Timeout.prototype = {
	_start : function(handler, value) {
		return window.setTimeout(handler, value);
	},

	_stop : function(timerID) {
		window.clearTimeout(timerID);
	},

	_tick : function() {
		this._id = null;
	},

	toString : function() {
		return 'js.util.Timeout';
	}
};
$extends(js.util.Timeout, js.util.AbstractTimer);
$package('js.util');

js.util.Timer = function(interval, callback, scope) {
	if (!(this instanceof js.util.Timer)) {
		var t = new js.util.Timer(interval, callback, scope);
		t.start();
		return t;
	}

	this.$super(interval, callback, scope);
};

js.util.Timer.prototype = {
	_start : function(handler, value) {
		return window.setInterval(handler, value);
	},

	_stop : function(timerID) {
		window.clearInterval(timerID);
	},

	toString : function() {
		return 'js.util.Timer';
	}
};
$extends(js.util.Timer, js.util.AbstractTimer);
$package("js.util");

js.util.UUID = function () {
    var uuid = [], chars = js.util.UUID.CHARS;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // fill in random data
    // at i==19 set the high bits of clock sequence as per rfc4122, sec. 4.1.5
    for ( var i = 0, r; i < 36; i++) {
        if (!uuid[i]) {
            r = 0 | Math.random() * 16;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
    }

    this._value = uuid.join('');

    if (this === js.util) {
        // if used as function this points to package scope
        return this._value;
    }
};

js.util.UUID.CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split('');

js.util.UUID.prototype = {
    valueOf : function () {
        return this._value;
    },

    toString : function () {
        return "js.util.UUID";
    }
};
$extends(js.util.UUID, Object);
