$package("js.widget");

/**
 * Percent bar widget. Simple bar partly filled, depending on its percent value. Used to represent merely static, or
 * slow changing values like disk drive usage percent. It accept directly percent values, that is, numeric values in
 * range [0..1]. It has also low and high water mark thresholds and, beside updating filled part width, takes care to
 * add or remove {@link #_LOW_WATER_CSS} and {@link #_HIGH_WATER_CSS} CSS classes.
 * <p>
 * Assuming this component is deployed into standard <em>lib</em> directory, typical usage is like below:
 * 
 * <pre>
 * &lt;div data-value="usage" data-ref="lib/percent-bar"&gt;
 * </pre>
 * 
 * Finally, besides standard object setter used to integrate with templates engine this class has convenient methods to
 * set and retrieve its value.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct percent bar widget instance.
 * @param js.dom.Document ownerDoc owner document,
 * @param Node node native node instance.
 */
js.widget.PercentBar = function (ownerDoc, node) {
    this.$super(ownerDoc, node);

    /**
     * Percent bar value.
     * 
     * @type Number
     */
    this._value = 0.0;

    /**
     * Low water threshold. Add {@link #_LOW_WATER_CSS} class to this percent bar if its value is under this threshold.
     * Default value is 0.33.
     * 
     * @type Number
     */
    this._lowWaterMark = 0.33;

    /**
     * High water threshold. Add {@link #_HIGH_WATER_CSS} class to this percent bar if its value is over this threshold.
     * Default value is 0.66.
     * 
     * @type Number
     */
    this._highWaterMark = 0.66;

    /**
     * This percent bar width.
     * 
     * @type Number
     */
    this._barWidth = this.style.getWidth();

    /**
     * Pointer element.
     * 
     * @type js.dom.Element
     */
    this._pointerElement = this.getByCssClass("pointer");
    $assert(this._pointerElement.style.getWidth() === 0, "js.widget.PercentBar#PercentBar", "Invalid initial value; should be 0.");
};

js.widget.PercentBar.prototype = {
    /**
     * Low water mark CSS class.
     * 
     * @type String
     */
    _LOW_WATER_CSS : "low-water",

    /**
     * High water mark CSS class.
     * 
     * @type String
     */
    _HIGH_WATER_CSS : "high-water",

    /**
     * Set {@link #_lowWaterMark low-water mark} value.
     * 
     * @param Number lowWaterMark low water mark value in range [0..1).
     * @return js.widget.PercentBar this object.
     * @assert low water mark argument is a number in proper range.
     */
    setLowWaterMark : function (lowWaterMark) {
        $assert(0 <= highWaterMark && highWaterMark < 1, "js.widget.PercentBar#setHighWaterMark", "High water argument is not valid.");
        this._lowWaterMark = lowWaterMark;
        return this;
    },

    /**
     * Set {@link #_highWaterMark high-water mark} value.
     * 
     * @param Number highWaterMark high water mark value in range (0..1].
     * @return js.widget.PercentBar this object.
     * @assert high water mark argument is a number in proper range.
     */
    setHighWaterMark : function (highWaterMark) {
        $assert(0 < highWaterMark && highWaterMark <= 1, "js.widget.PercentBar#setHighWaterMark", "High water argument is not valid.");
        this._highWaterMark = highWaterMark;
        return this;
    },

    /**
     * Set this percent bar value. Preserve value and update interface via {@link #setObject}.
     * 
     * @param Number value percent bar value.
     * @return js.widget.PercentBar this object.
     * @assert argument is a valid percent value.
     */
    setValue : function (value) {
        this._value = value;
        this.setObject(value);
        return this;
    },

    /**
     * Get this percent bar value.
     * 
     * @return Number this percent bar value.
     */
    getValue : function () {
        return this._value;
    },

    /**
     * Templates engine value setter. See {@link js.dom.Element#setObject} for details. This setter argument is a
     * percent value; please recall percent is simple a numeric value in range [0..1]. Beside updating filled part width
     * this method takes care to add/remove low/high water marks CSS classes accordingly internal threshold values.
     * 
     * @param Number percent a percent value.
     * @return js.widget.PercentBar this object.
     * @assert argument is a valid percent value.
     */
    setObject : function (percent) {
        $assert(0 <= percent && percent <= 1, "js.widget.PercentBar#setObject", "Invalid percent value.");
        this.addCssClass(this._LOW_WATER_CSS, percent <= this._lowWaterMark);
        this.addCssClass(this._HIGH_WATER_CSS, percent >= this._highWaterMark);
        this._pointerElement.style.setWidth(percent * this._barWidth);
        return this;
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.widget.PercentBar";
    }
};
$extends(js.widget.PercentBar, js.dom.Element);
