$package("js.widget");

/**
 * Slider control.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct slider control instance.
 * @param Document ownerDoc owner document,
 * @param Node node native node.
 */
js.widget.Slider = function (ownerDoc, node) {
    this.$super(ownerDoc, node);

    /**
     * This slider minimum value. Default to 0.
     * 
     * @type Number
     */
    this._min = 0;

    /**
     * This slider maximum value. Default to 100.
     * 
     * @type Number
     */
    this._max = 100;

    /**
     * This slider step, that is, scale factor. Default value is 1.
     * 
     * @type Number
     */
    this._step = 1;

    /**
     * This slider pointer.
     * 
     * @type js.dom.Element
     */
    this._pointer = this.getByCssClass("pointer");

    /**
     * This slider width compensated with pointer width.
     * 
     * @type Number
     */
    this._sliderWidth = this._getSliderWidth();

    /**
     * This slider value. Usually updated by dragging the pointer but also using {@link #setValue} method. Default value
     * is slider middle.
     * 
     * @type Number
     */
    this._value = 0;

    /**
     * Custom events.
     * 
     * @type js.event.CustomEvents
     */
    this._events = this.getCustomEvents();
    this._events.register("input", "change");

    // finalize instance initialization
    this.setValue(this._min + this._max / 2);
    this._enableMouseDown();
};

js.widget.Slider.prototype = {
    setMin : function (min) {
        this._min = min;
    },

    setMax : function (max) {
        this._max = max;
    },

    setStep : function (step) {
        this._step = step;
    },

    setValue : function (value) {
        $assert(this._min <= value && value <= this._max, "js.widget.Slider#setValue", "Value not in proper range.");
        this._value = value;
        this._events.fire("change", this._value);
        var left = Math.round((value - this._min) * this._sliderWidth / (this._max - this._min));
        this._pointer.style.setLeft(left);
    },

    getValue : function () {
        return this._value;
    },

    _onMouseDown : function (ev) {
        this._startPageX = ev.pageX;
        this._startLeft = this._getStartLeft(ev);
        this._onMouseMove(ev);
        this._ownerDoc.on("mousemove", this._onMouseMove, this);
        this._ownerDoc.on("mouseup", this._onMouseUp, this);
    },

    _onMouseMove : function (ev) {
        var deltaPageX = ev.pageX - this._startPageX;
        var left = this._startLeft + deltaPageX;
        if (left < 0) {
            left = 0;
        }
        if (left > this._sliderWidth) {
            left = this._sliderWidth;
        }
        this._pointer.style.setLeft(left);

        var value = this._min + left * (this._max - this._min) / this._sliderWidth;
        value = this._step * (Math.round(value / this._step));
        if (this._value !== value) {
            this._value = value;
            this._events.fire("input", value);
        }
    },

    _onMouseUp : function (ev) {
        this._ownerDoc.un('mousemove', this._onMouseMove);
        this._ownerDoc.un('mouseup', this._onMouseUp);
        this._events.fire("change", this._value);
    },

    _enableMouseDown : function () {
        this._pointer.on("mousedown", this._onMouseDown, this);
    },

    _getSliderWidth : function () {
        return this.style.getWidth() - this._pointer.style.getWidth();
    },

    _getStartLeft : function (ev) {
        return parseInt(this._pointer.style.get('left'));
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.widget.Slider";
    }
};
$extends(js.widget.Slider, js.dom.Element);
