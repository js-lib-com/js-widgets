$package('js.widget');

$import('js.dom.Element');

js.widget.Text = function(ownerDoc, node) {
    this.$super(ownerDoc, node);
};

js.widget.Text.prototype =
{
    set: function(text) {
        this.setHTML(text);
    },

    get: function() {
        return this.getHTML();
    }
};
$extends(js.widget.Text, js.dom.Element);
