$package('js.widget');

$import('js.widget.Box');

js.widget.ContextHelp = function(ownerDoc, node) {
    this.$super(ownerDoc, node);
};

js.widget.ContextHelp.prototype =
{
    open: function() {
        this.removeCssClass('hidden');
    }
};
$extends(js.widget.ContextHelp, js.widget.Box);
