$package('js.widget');

$import('js.dom.Element');
$import('js.util.Timeout');

/**
 * Box widget.
 *
 * @constructor
 * Construct a box widget.
 *
 * @param js.dom.Document ownerDoc, this box owner document
 * @param Node node, wrapped DOM node
 */
js.widget.Box = function(ownerDoc, node) {
    this.$super(ownerDoc, node);

    /**
     * Document body. Internally body element used to register mouse events listernes.
     * @type js.dom.Element
     */
    this._body = ownerDoc.getByTag('body');

    var cancel = this.getByCssClass('cancel');
    if (cancel !== null) {
        cancel.on('click', this._onCancel, this);
    }

    var caption = this.getByCssClass('caption');
    if (caption !== null) {
        caption.on('mousedown', this._onCaptionMouseDown, this);
        caption.on('mouseup', this._onCaptionMouseUp, this);

        this._timeout = new js.util.Timeout(10);
        this._timeout.setCallback(this._onTimeout, this);
    }

    this._mouseMoveEvent = null;
};

js.widget.Box.prototype =
{
    _onCancel: function(ev) {
        this.addCssClass('hidden');
    },

    _onCaptionMouseDown: function(ev) {
        ev.halt();
        var pos = this.style.getPosition();
        this._startX = pos[0];
        this._startY = pos[1];
        this._mouseStartX = ev.pageX;
        this._mouseStartY = ev.pageY;
        this._body.un('mousemove', this._onCaptionMouseMove);
        this._timeout.start();
    },

    _onTimeout: function() {
        this.addCssClass('moving');
        this._body.on('mousemove', this._onCaptionMouseMove, this);
    },

    _onCaptionMouseMove: function(ev) {
        ev.halt();
        var dx = ev.pageX - this._mouseStartX;
        var dy = ev.pageY - this._mouseStartY;
        this.style.setPosition([this._startX + dx, this._startY + dy]);
    },

    _onCaptionMouseUp: function(ev) {
        ev.halt();
        this._timeout.stop();
        this._body.un('mousemove', this._onCaptionMouseMove);
        this._mouseMoveEvent = null;
        this.removeCssClass('moving');
    }
};
$extends(js.widget.Box, js.dom.Element);
