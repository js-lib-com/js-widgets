$package('js.widget');

$import('js.widget.Box');
$import('js.lang.Types');
$import('js.event.Key');
$import('js.net.XHR');

/**
 * A dialog is a box with a form and optionally submit, reset and cancel buttons.
 * 
 * @constructor Construct a dialog widget.
 * 
 * @param js.dom.Document ownerDoc, this dialog parent document
 * @param Node node, wrapped DOM node
 */
js.widget.Dialog = function (ownerDoc, node) {
    this.$super(ownerDoc, node);

    this._form = this.getByTag('form');
    this._progress = this.getByCssClass('progress');
    this.findByTag('input').on('keypress', this._onKeyPress, this);

    var submit = this.getByCss('button[type="submit"]');
    if (submit === null) {
        submit = this.getByCss('.submit');
    }
    if (submit !== null) {
        submit.on('click', this._onSubmit, this);
    }
    var reset = this.getByCss('button[type="reset"]');
    if (reset === null) {
        reset = this.getByCss('.reset');
    }
    if (reset !== null) {
        reset.on('click', this._reset, this);
    }
};

js.widget.Dialog.prototype = {
    /**
     * Open dialog. This method actually supports two overloads: with and without initialization value.
     * 
     * @param Object value, optional initialization value
     * @param Function callback, function to be executed on dialog submission
     * @param Object scope, callback execution scope, if missing uses global scope
     * @return js.widget.Dialog this dialog.
     */
    open : function () {
        var idx = 0, value = undefined;
        if (!js.lang.Types.isFunction(arguments[0])) {
            idx++;
            value = arguments[0];
        }
        this._callback = arguments[idx++];
        this._scope = arguments[idx] || window;
        if (typeof value !== 'undefined') {
            $assert(value !== null);
            this._set(value);
        }
        else {
            this._reset();
        }
        this.removeCssClass('hidden');
        return this;
    },

    /**
     * Submit on enter.
     * 
     * @param js.event.Event ev, key press event
     */
    _onKeyPress : function (ev) {
        if (ev.key === js.event.Key.ENTER) {
            ev.halt();
            this._onSubmit(ev);
        }
    },

    _onSubmit : function (ev) {
        if (!this._form.isValid()) {
            return;
        }
        var action = this._form.getAttr('action');
        if (!action) {
            this.addCssClass('hidden');
            this._callback.call(this._scope, this._get());
            return;
        }

        var method = this._form.getAttr('method').toUpperCase();
        this._xhr = new js.net.XHR(method, action);
        if (this._progress) {
            this._xhr.on('progress', this._onProgress, this);
            this._progress.start();
        }
        this._xhr.on('load', this._onLoad, this);
        this._xhr.on('loadend', this._onLoadEnd, this);
        this._form.normalize();
        this._xhr.send(this._form);
    },

    _onProgress : function (progress) {
        this._progress.update(progress);
    },

    _onLoad : function (res) {
        this.addCssClass('hidden');
        if (this._callback) {
            this._callback.call(this._scope, res);
        }
    },

    _onCancel : function (ev) {
        this.addCssClass('hidden');
        if (this._xhr) {
            this._xhr.abort();
        }
    },

    _onLoadEnd : function () {
        delete this._xhr;
    },

    _get : function () {
        // html form does not support getter
        return js.dom.ODM.get(this, this._obj);
    },

    _set : function (obj) {
        this._obj = obj;
        js.dom.ODM.set(this, obj);
        this._form.set(obj);
    },

    _reset : function () {
        js.dom.ODM.reset(this);
        this._form.reset();
    }
};
$extends(js.widget.Dialog, js.widget.Box);
