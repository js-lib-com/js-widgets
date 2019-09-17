$package("js.widget");

/**
 * Digital number.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct digital number instance.
 * @param Document ownerDoc owner document,
 * @param Node node native node.
 */
js.widget.DigitalNumber = function (ownerDoc, node) {
    this.$super(ownerDoc, node);
    this._value = 0;
};

js.widget.DigitalNumber.prototype = {
    setValue : function (value) {
        this._value = value;
        window.requestAnimationFrame(this._render.bind(this));
    },

    getValue : function () {
        return this._value;
    },

    _render : function (timestamp) {
        var digitEl, value;

        digitEl = this.getLastChild();
        value = this._value;
        do {
            digitEl.removeAttr("class").addCssClass('_' + value % 10);
            digitEl = digitEl.getPreviousSibling();
            if (digitEl == null) {
                // TODO create dynamic digit element
            }
            value = Math.floor(value / 10);
        } while (value >= 1);

        while (digitEl !== null) {
            digitEl.addCssClass("hidden");
            digitEl = digitEl.getPreviousSibling();
        }
    },

    toString : function () {
        return "js.widget.DigitalNumber";
    }
};
$extends(js.widget.DigitalNumber, js.dom.Element);
