WinMain.on("load", function () {
    var inputPreview = WinMain.doc.getByTag("h1");
    var changePreview = WinMain.doc.getByTag("h2");

    var slidebar = WinMain.doc.getByCssClass("js-widget-slidebar");

    slidebar.on("input", function (value) {
        inputPreview.setText(value.toString());
    }, this);
    slidebar.on("change", function (value) {
        changePreview.setText(value.toString());
    }, this);
});
