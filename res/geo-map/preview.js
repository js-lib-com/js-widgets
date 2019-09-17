WinMain.on("load", function () {
    var map1 = WinMain.doc.getById("map1");
    map1.setObject([ {
        address : "Iasi",
        latitude : 47.156944,
        longitude : 27.590278
    }, {
        address : "Bacau",
        latitude : 46.583333,
        longitude : 26.916667
    } ]);

    map1.on("marker-click", function (marker) {
        js.ua.System.alert(marker.getPlace().address);
    }, this)

    var map2 = WinMain.doc.getById("map2");
    map2.setObject([ {
        address : "Iasi",
        latitude : 47.156944,
        longitude : 27.590278
    } ]);

    var map3 = WinMain.doc.getById("map3");
    map3.setObject();
});
