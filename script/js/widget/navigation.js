$package("js.widget");

/**
 * Experimental navigation bar.
 * 
 * @constructor Construct a movable box.
 * @param js.dom.Document ownerDoc owner document,
 * @param Node node native node instance.
 */
js.widget.Navigation = function (ownerDoc, node) {
    this.$super(ownerDoc, node);
    this.on("click", this._onClick, this);
};

js.widget.Navigation.$extends = function (superClass, subClass) {
    $preload($format("[data-class='%s']", superClass));
};

js.widget.Navigation.prototype = {
    _onClick : function (ev) {
        var href = ev.target.getAttr("href");
        if (href == null) {
            return;
        }
        ev.halt();
        // by convention handler is encoded into link href attribute but with css case
        var handler = js.util.Strings.toScriptCase(href);
        if (typeof this[handler] !== "undefined") {
            this[handler].call(this);
        }
        else {
            js.ua.System.alert("Undefined navigation handler |%s|.", handler);
        }
    },

    toString : function () {
        return "js.widget.Navigation";
    }
};
$extends(js.widget.Navigation, js.dom.Element);