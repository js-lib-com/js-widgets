$package("js.widget.test");

js.widget.test.Page = function () {
    this.$super();
    this._panorama = WinMain.doc.getByCssClass("js-widget-panorama");

    var it = this._panorama.findByCssClass("section").it();
    while(it.hasNext()) {
        this._panorama.addClickListener(it.next(), function(ev) {
            alert(ev.target.getAttr("name"))
        });
    }
    
    var icon = this._panorama.getByTag("img");
    this._panorama.addClickListener(icon, function(ev) {
        alert(ev.target.getAttr("name"))
    });
};

js.widget.test.Page.prototype = {};
$extends(js.widget.test.Page, js.ua.Page);
