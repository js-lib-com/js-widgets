$package("js.widget");

/**
 * Panorama view.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct panorama view instance.
 * @param Document ownerDoc owner document,
 * @param Node node native node.
 */
js.widget.Panorama = function (ownerDoc, node) {
    this.$super(ownerDoc, node);

    this._rollerBand = this.getByCssClass("roller-band");
    this._rollerBandX = this._getRollerBandX();
    $assert(this._rollerBandX === 0, "js.widget.Panorama#Panorama", "Invalid roller bad initial position. Ensure left style is 0.");
    this._rollerBandStartX = 0;
    this._pageStartX = 0;
    this._moving = false;
    this._preventClick = false;
    this._clickHandlers = {};

    this.on("click", this._onClick, this);
    this.on("mousedown", this._onMouseDown, this);
    this.on("touchstart", this._onMouseDown, this);
};

js.widget.Panorama.prototype = {
    _MOVE_TRESHOLD : 10,

    addClickListener : function (target, listener, scope) {
        this._clickHandlers[target.hashCode()] = {
            listener : listener,
            scope : scope || target
        };
    },

    _onClick : function (ev) {
        if (!this._preventClick) {
            var h = this._clickHandlers[ev.target.hashCode()];
            if (typeof h !== "undefined") {
                h.listener.call(h.scope, ev);
            }
        }
    },

    _render : function () {
        this._setRollerBandX(this._rollerBandX);
        if (this._moving) {
            window.requestAnimationFrame(this._render.bind(this));
        }
    },

    _onMouseDown : function (ev) {
        this._pageStartX = ev.pageX;
        this._rollerBandStartX = this._getRollerBandX();
        
        this._ownerDoc.on("mousemove", this._onMouseMove, this);
        this._ownerDoc.on("touchmove", this._onMouseMove, this);

        this._ownerDoc.on("mouseup", this._onMouseUp, this);
        this._ownerDoc.on("touchend", this._onMouseUp, this);
    },

    _onMouseMove : function (ev) {
        var pageDeltaX = ev.pageX - this._pageStartX;
        if (!this._moving) {
            if (Math.abs(pageDeltaX) < this._MOVE_TRESHOLD) {
                return;
            }
            this._moving = true;
            this._render();
        }
        this._rollerBandX = this._rollerBandStartX + pageDeltaX;
    },

    _onMouseUp : function (ev) {
        this._preventClick = this._moving; // prevent click if roller band was moved
        if (this._moving) {
            this._moving = false;
        }
        WinMain.doc.un('mousemove', this._onMouseMove);
        WinMain.doc.un('touchmove', this._onMouseMove);

        WinMain.doc.un('mouseup', this._onMouseUp);
        WinMain.doc.un('touchend', this._onMouseUp);
    },

    _setRollerBandX : function (rollerBandX) {
        this._rollerBand.style.set("left", rollerBandX + "px");
    },

    _getRollerBandX : function () {
        return parseInt(this._rollerBand.style.get('left'));
    },

    toString : function () {
        return "js.widget.Panorama";
    }
};
$extends(js.widget.Panorama, js.dom.Element);
