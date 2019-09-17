$package("js.widget");

/**
 * Task progress.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct task progress instance.
 * 
 * @param js.dom.Document ownerDoc owner document,
 * @param Node node wrapped native node.
 */
js.widget.Progress = function (ownerDoc, node) {
    $assert(this instanceof js.widget.Progress, "js.widget.Progress#Progress", "Invoked as function.");
    this.$super(ownerDoc, node);
    this.setTotal(100);
};

js.widget.Progress.prototype = {
    /**
     * Start new task. A new task was just started; progress implementations use this notification to update its
     * internal state.
     * 
     * @return js.widget.Progress this object.
     */
    start : function () {
        return this;
    },

    /**
     * Specifies how much work the task requires in total. Total argument should be a positive number; if zero is
     * silently replaced by 1. If given total is undefined, null or empty or is negative it is also considered 1.
     * 
     * @param Number total total work to accomplish.
     * @return js.widget.Progress this object.
     */
    setTotal : function (total) {
        $assert(js.lang.Types.isNumber(total), "js.widget.Progress#setTotal", "Total is not a number.");
        this._node.max = this._getNumber(total, 1);
        return this;
    },

    /**
     * Specifies how much of the task has been completed. If given argument is undefined, null or empty or is a negative
     * number it is replaced by 0.
     * 
     * @param Number value amount of work already performed.
     * @return js.widget.Progress this object.
     */
    setValue : function (value) {
        $assert(js.lang.Types.isNumber(value), "js.widget.Progress#setValue", "Value is not a number.");
        this._node.value = this._getNumber(value, 0);
        return this;
    },

    /**
     * Update progress internal state. This setter update progress internal state to values from given progress event.
     * 
     * @param ProgressEvent progressEvent W3C built-in progress event.
     * @return js.widget.Progress this object.
     */
    update : function (progressEvent) {
        this.setTotal(progressEvent.total);
        this.setValue(progressEvent.loaded);
        return this;
    },

    /**
     * Get numeric value. Ensure value is numeric and is not less than given threshold. If <em>value</em> is not
     * numeric try to convert it; if conversion result is NaN assign threshold value.
     * 
     * @param Object value value to force to number,
     * @param Number threshold threshold value.
     * @return Number the numeric value.
     */
    _getNumber : function (value, threshold) {
        if (!js.lang.Types.isNumber(value)) {
            value = Number(value);
            if (isNaN(value)) {
                value = threshold;
            }
        }
        if (value < threshold) {
            value = threshold;
        }
        return value;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.widget.Progress";
    }
};
$extends(js.widget.Progress, js.dom.Element);
