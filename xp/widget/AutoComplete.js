$package('js.widget');

$import('js.dom.Element');
$import('js.net.RPC');
$import('js.lang.Thread');
$import('js.event.Key');

/**
 * Auto-complete.
 *
 * @constructor
 *
 * @param js.dom.Document ownerDoc
 * @param Node node
 */
js.widget.AutoComplete = function(ownerDoc, node) {
    this.$super(ownerDoc, node);
    this.on('keyup', this._onKeyUp, this);

    var width = this.style.getWidth() - 7;
    var position = this.style.getPosition();
    var left = position[0] + 3;
    var top = position[1] + this.style.getHeight() + 4;

    this._container = ownerDoc.createElement('div').addCssClass('js-auto-complete').style.set(
    {
        'left': left + 'px',
        'top': top + 'px',
        'width': width + 'px'
    });

    this._content = ownerDoc.createElement('div').addCssClass('content').style.set(
    {
        'width': width + 'px'
    });

    this._list = ownerDoc.createElement('ul');
    this._list.on('click', this._onClick, this);
    ownerDoc.getByTag('body').addChild(this._container.addChild(this._content.addChild(this._list)).addCssClass('hidden'));

    this._rpc = null;
    this._arguments = [];
};

js.widget.AutoComplete.prototype =
{
    setMethod: function(method) {
        this._rpc = new js.net.RPC(method);
        this._rpc.setCallback(this._onSuggestions, this);
        //this._rpc.on('success', this._onSuggestions, this);
        //this._rpc.on('cancel', this._onCancel, this);
        //this._rpc.on('error', this._onError, this);
    },

    setArguments: function() {
        this._arguments = $arguments(arguments);
    },

    get: function() {
        return this._node.value;
    },

    _onKeyUp: function(ev) {
        if (ev.key === js.event.Key.ESCAPE) {
            this._rpc.abort();
            this._container.addCssClass('hidden');
            return;
        }
        this._dirty = true;
        if (!this._rpc.processing) {
            this._getSuggestion();
        }
    },

    _getSuggestion: function() {
        this._dirty = false;
        var value = this._node.value;
        if (value) {
            this._rpc.setArguments(value);
            for (var i = 0; i < this._arguments.length; i++) {
                this._rpc.addArguments(this._arguments[i]);
            }
            this._rpc.send();
        }
        else {
            this._container.addCssClass('hidden');
        }
    },

    _onSuggestions: function(suggestions) {
        this._list.removeChildren();
        for (var i = 0; i < suggestions.length; i++) {
            this._list.addChild(this._ownerDoc.createElement('li').setText(suggestions[i]));
        }
        this._container.removeCssClass('hidden');
        // this.focus();
        if (this._dirty) {
            // we still are in ready state handler of previous rpc transaction
            // we need to broke this 'recursive' call with an asynchronous one
            js.lang.Thread.run(this._getSuggestion, this);
        }
    },

    _onClick: function(ev) {
        if (ev.target.getTag() === 'li') {
            this._node.value = ev.target.get();
            this._container.addCssClass('hidden');
        }
    }
};
$extends(js.widget.AutoComplete, js.dom.Element);
