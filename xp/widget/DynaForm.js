$package('js.widget');

$import('js.dom.Form');
$import('js.lang.IllegalStateException');
$import('js.lang.Types');

/**
 * Extends a HTML form with dynamic controls. A dynamic control is one created by script at
 * run time but not created at form design. It is especially useful for collection on objects
 * of the same type. Also, if form have submit and/or reset button(s) register click events.
 *
 * Note that this class expect form action and method to be properly set but enforce encoding
 * to multipart.
 *
 * @constructor
 * Construct a dynamic form.
 *
 * @param js.dom.Document ownerDoc, this dynamic form parent document
 * @param Node node, wrapped DOM node
 */
js.widget.DynaForm = function(ownerDoc, node) {
    this.$super(ownerDoc, node);
    this.setEnctype('multipart/form-data');
    this._dynaSets = this.findByCss('[data-js-widget="js.widget.DynaSet"]');
    this._dynaSetsMap = {};
    var it = this._dynaSets.it(), dynaSet;
    while (it.hasNext()) {
        dynaSet = it.next();
        this._dynaSetsMap[js.util.Strings.toHyphenCase(dynaSet.name)] = dynaSet;
    }
};

js.widget.DynaForm.prototype =
{
    set: function(obj) {
        this.reset();
        for (var p in obj) {
            this._push(p, obj[p]);
        }
        return this;
    },

    reset: function() {
        var it = this._dynaSets.it();
        while (it.hasNext()) {
            it.next().reset();
        }
        this.$super('reset');
        return this;
    },

    _beforeSubmit: function() {
        var it = this._dynaSets.it();
        while (it.hasNext()) {
            it.next().beforeSubmit();
        }
    },

    _add: function(name, value, guard) {
        if (typeof guard === 'undefined') {
            guard = 0;
        }
        if (guard === 8) {
            throw new js.lang.IllegalStateException('js.widget.DynaForm._add', 'too many recursive iterations on dynamic form processing');
        }

        name = js.util.Strings.toHyphenCase(name);
        if (js.lang.Types.isArray(value)) {
            var array = value;
            var dynaSet = this._dynaSetsMap[name];
            if (typeof dynaSet !== 'undefined') {
                for (var i = 0; i < array.length; i++) {
                    dynaSet.addItem();
                    guard++;
                    arguments.callee.call(dynaSet, name + '.' + i, array[i], guard);
                    guard--;
                }
            }
        }
        else if (js.lang.Types.isObject(value) && !js.lang.Types.isDate(value)) {
            for (var p in value) {
                guard++;
                arguments.callee.call(this, name + '.' + p, value[p], guard);
                guard--;
            }
        }
        else {
            var el = this.getByCss('[name="?"]', name);
            if (el !== null) {
                el.set(value);
            }
        }
    }
};
$extends(js.widget.DynaForm, js.dom.Form);
