$package("js.widget");

/**
 * Date control.
 * 
 * @author Iulian Rotaru
 * @since 1.2
 * @constructor Construct date element instance.
 * 
 * @param js.dom.Document ownerDoc owner document,
 * @param Node node native {@link Node} instance.
 */
js.widget.Date = function (ownerDoc, node) {
    this.$super(ownerDoc, node);

    var datePicker = this._config.datePicker;
    if (typeof datePicker === "undefined") {
        datePicker = this.DEF_DATE_PICKER;
    }
    this._datePicker = ownerDoc.getByCss("[data-class='%s']", datePicker);

    if (this._datePicker !== null) {
        this.on("click", this._onClick, this);
        this.on("focus", this._onFocus, this);
        var label = this.getPreviousSibling();
        if (label.getTag() === "label") {
            this._caption = label.getText();
        }
    }
};

js.widget.Date.prototype = {
    DEF_DATE_PICKER : "js.widget.DatePicker",

    _onFocus : function (ev) {
        this._datePicker.setCallback(this._onDateSelected, this);
        if (this._caption) {
            this._datePicker.setCaption(this._caption);
        }
        this._datePicker.show();
    },

    _onDateSelected : function (date) {
        if (date == null) {
            this.reset();
        }
        if (typeof date !== "undefined") {
            this.setValue(date);
        }
    },

    _onClick : function (ev) {
        ev.prevent();
    },

    toString : function () {
        return "js.widget.Date";
    }
};
$extends(js.widget.Date, js.dom.Control);
$preload(js.widget.Date);
