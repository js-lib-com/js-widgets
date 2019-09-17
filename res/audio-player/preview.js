WinMain.on("load", function () {
    var player = WinMain.doc.getByCssClass("js-widget-audioplayer");
    player.play("http://test.bbnet.ro/moby.mp3");
});
