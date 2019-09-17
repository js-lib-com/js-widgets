$package("js.widget");

/**
 * Slide bar.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct slide bar instance.
 * @param Document ownerDoc owner document,
 * @param Node node native node.
 */
js.widget.SlideBar = function (ownerDoc, node) {
    this.$super(ownerDoc, node);
};

js.widget.SlideBar.prototype = {
    /**
     * Enable mouse down event listener.
     */
    _enableMouseDown : function () {
        this.on("mousedown", this._onMouseDown, this);
    },

    /**
     * Get slider width.
     * 
     * @return Number slider width.
     */
    _getSliderWidth : function () {
        return this.style.getWidth();
    },

    /**
     * Get start page left position.
     * 
     * @param js.event.Event ev mouse down event.
     * @return Number event page left position.
     */
    _getStartLeft : function (ev) {
        return ev.pageX - this.style.getPageLeft();
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.widget.SlideBar";
    }
};
$extends(js.widget.SlideBar, js.widget.Slider);
