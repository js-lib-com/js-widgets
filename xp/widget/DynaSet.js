$package('js.widget');

$import('js.dom.Element');
$import('js.dom.Node');

/**
 * Dynamic set.
 *
 * @constructor
 * Construct a dynamic set.
 *
 * @param js.dom.Document ownerDoc, this dynamic set parent document
 * @param Node node, wrapped DOM node
 */
js.widget.DynaSet = function(ownerDoc, node) {
    this.$super(ownerDoc, node);
    this.bind('.controls', 'js.widget.ListCtrl');
    this._list = this.getByCssClass('controls');
    this._controller = new js.app.Controller(this);

    var n = this._list._template._fragment.getByCss('[name]').getAttr('name');
    var i = n.indexOf('?');
    $assert(i !== -1);
    this.name = n.substring(0, --i);
};

/**
 * Dynamic set controls mark.
 * @type String
 */
js.widget.DynaSet.CLASS_CONTROLS = 'controls';

js.widget.DynaSet.prototype =
{
    set: function(values) {
        this._list.setValue(values);
    },

    reset: function() {
        this._list.reset();
    },
    addItem: function() {
        this._onAdd();
    },

    beforeSubmit: function() {
        var items = this._list.it(), item, controls, control, index = 0;
        while (items.hasNext()) {
            item = items.next();
            controls = item.findByCss('[name]').it();
            while (controls.hasNext()) {
                control = controls.next();
                control.setAttr('name', control.getAttr('name').replace(js.dom.SymbolMarkup.INDEX, index));
            }
            ++index;
        }
    },

    _onAdd: function() {
        var item = this._list._template.create();
        this._list.addChild(item);
        var index = this._list.size() - 1;
        var controls = item.findByCss('[name]').it(), control;
        while (controls.hasNext()) {
            control = controls.next();
            control.setAttr('name', control.getAttr('name').replace(js.dom.SymbolMarkup.INDEX, index));
        }
    },

    _onRemove: function() {
        this._list.getMultiSelection().remove();
    },

    _onReset: function() {
        this.reset();
    },

    _onClean: function() {
        this._list.getMultiSelection().reset();
    }
};
$extends(js.widget.DynaSet, js.dom.Element);
