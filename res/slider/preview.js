WinMain.on("load", function () {
    var inputPreview = WinMain.doc.getByTag("h1");
    var changePreview = WinMain.doc.getByTag("h2");

    var slider = WinMain.doc.getByCssClass("js-widget-slider");

    slider.on("input", function (value) {
        inputPreview.setText(value.toString());
    }, this);
    slider.on("change", function (value) {
        changePreview.setText(value.toString());
    }, this);
    
    slider.setValue(100);
});
