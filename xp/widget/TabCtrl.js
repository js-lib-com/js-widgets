$package('js.widget');

$import('js.dom.Element');

js.widget.TabCtrl = function(ownerDoc, node) {
    this.$super(ownerDoc, node);
};

js.widget.TabCtrl.prototype =
{
    set: function() {

    }
};

$extends(js.widget.TabCtrl, js.dom.Element);
