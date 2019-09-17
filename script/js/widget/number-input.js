$package("js.widget");

/**
 * Numeric input.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct numeric input instance.
 * 
 * @param js.dom.Document ownerDoc, element owner document,
 * @param Node node, native {@link Node} instance.
 */
js.widget.NumberInput = function (ownerDoc, node) {
    $assert(this instanceof js.widget.NumberInput, "js.widget.NumberInput#NumberInput", "Invoked as function.");
    this.$super(ownerDoc, node);
};

js.widget.NumberInput.prototype = {
    toString : function () {
        return "js.widget.NumberInput";
    }
};
$extends(js.widget.NumberInput, js.dom.Control);