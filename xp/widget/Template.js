$package('js.widget');

/**
 * List item template.
 *
 * @constructor
 * Construct a list item template.
 *
 * @param js.dom.Element fragment
 */
js.widget.Template = function(fragment) {
    this._fragment = fragment.remove(false);
    this._events = [];
    this._itemEvents = {};
};

js.widget.Template.prototype =
{
    create: function(obj) {
        var el = this._fragment.clone(true);
        for (var i = 0, j, args; i < this._events.length; i++) {
            args = [];
            for (j = 0; j < this._events[i].length; ++j) {
                args.push(this._events[i][j]);
            }
            args.push(el);
            el.on.apply(el, args);
        }
        if (typeof obj !== 'undefined') {
            el.setValue(obj);
        }
        var elist;
        for (var selectors in this._itemEvents) {
            elist = el.getByCss(selectors);
            elist.on.apply(elist, this._itemEvents[selectors]);
        }
        return el;
    },

    on: function() {
        this._events.push(arguments);
    },

    getByCss: function(cssPath) {
        return this._fragment.getByCss(cssPath);
    },

    addItemListener: function(selectors, type, listener, scope, arg) {
        this._itemEvents[selectors] = $arguments(arguments, 1);
    }
};
