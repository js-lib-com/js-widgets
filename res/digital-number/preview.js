$package("js.widget.test");

js.widget.test.Page = function () {
    this.$super();
    var digitalNumber = WinMain.doc.getByCssClass("digital-number");
    var counter = 0;

    js.util.Timer(100, function() {
        digitalNumber.setValue(counter++);
    });
};
$extends(js.widget.test.Page, js.ua.Page);
