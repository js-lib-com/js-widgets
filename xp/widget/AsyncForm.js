$package('js.widget');

$import('js.widget.DynaForm');
$import('js.net.Method');
$import('js.net.XHR');

/**
 * Asynchronous files upload. Internally uses {@link js.net.XHR} class to actually transport the form.
 * <pre>
 *		var upload = new js.rpc.Upload();
 *		upload.setForm(form);
 *		upload.setCallback(callback, scope);
 *		upload.start();
 * </pre>
 *
 * Although the form may have arbitrary controls it is recommended to use js.rpc upload only for files, but the form may have
 * multiple <em>file</em> inputs. For non-file controls use Ctrl package.
 *
 * @constructor
 * Construct an asynchronous form.
 *
 * @param js.dom.Document ownerDoc, this asynchronous form parent document,
 * @param Node node, wrapped DOM node.
 */
js.widget.AsyncForm = function(ownerDoc, node) {
    this.$super(ownerDoc, node);
    var constants = js.widget.AsyncForm;
    this.bind('.' + constants.PROGRESS_MARK, constants.PROGRESS_CLASS);

    /**
     * Upload progress indicator.
     * @type js.widget.AsyncForm.Progress
     */
    this._progress = this.getByCssClass(constants.PROGRESS_MARK);

    // abort handling was originally implemented in synchronous form but after learning
    // that most browsers - actually all but Opera - doesn't process click events while
    // uploading is in progress I moved it here
    var abort = this.getByCssClass('abort');
    if (abort !== null) {
        abort.on('click', this.abort, this);
    }
};

/**
 * Mark class to identify progress control.
 */
js.widget.AsyncForm.PROGRESS_MARK = 'progress';

/**
 * Default progress implementation.
 */
js.widget.AsyncForm.PROGRESS_CLASS = 'js.widget.TextProgress';

js.widget.AsyncForm.prototype =
{
    /**
     * Set asynchronous form callback. This callback is invoked at form upload complete
     * with the object returned by server as the only argument.
     *
     * @param Function callback, callback function invoked on upload completed,
     * @param Object scope, optional callback scope or global scope if missing.
     * @return js.widget.AsyncForm this object.
     */
    setCallback: function(callback, scope) {
        this._callback = callback;
        this._scope = scope || window;
        return this;
    },

    /**
     * Abort this upload transaction.
     *
     * @return js.widget.AsyncForm this object.
     */
    abort: function() {
        if (this._progress) {
            this._progress.abort();
        }
        if (this._xhr) {
            this._xhr.abort();
        }
        return this;
    },

    /**
     * Override form submission with asynchronous logic.
     */
    _submit: function() {
        var method = js.net.Method[this.getAttr('method').toUpperCase()];
        var url = this.getAttr('action');
        this._xhr = new js.net.XHR(method, url);
        if (this._progress !== null) {
            this._xhr.on('progress', this._onProgress, this);
            this._progress.start();
        }
        this._xhr.on('load', this._onLoad, this);
        this._xhr.on('loadend', this._onLoadEnd, this);
        this._xhr.send(this);
    },

    _onProgress: function(progressEvent) {
        this._progress.update(progressEvent);
    },

    _onLoad: function(res) {
        if (this._callback) {
            this._callback.call(this._scope, res);
        }
    },

    _onLoadEnd: function() {
        if (this._progress) {
            this._progress.stop();
        }
        delete this._xhr;
    }
};
$extends(js.widget.AsyncForm, js.widget.DynaForm);

/**
 * Upload progress control.
 */
js.widget.AsyncForm.Progress =
{
    /**
     * Start upload. This method is invoked just after upload start
     * Implementation should prepare internal state for new upload
     * session. This
     */
    start: function() {
    },

    /**
     * Stop upload.
     */
    stop: function() {
    },

    /**
     * Update this progress control.
     *
     * @param js.net.ProgressEvent progress, progress event.
     * @return js.widget.AsyncForm.Progress this object.
     */
    update: function(progress) {
    },

    /**
     * Abort upload prematurely.
     */
    abort: function() {
    }
};
