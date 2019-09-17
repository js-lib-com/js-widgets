WinMain.on("load", function () {
    var content = WinMain.doc.getById("content");
    content.setObject({
        name : "Stories Heroes",
        picture : "res/list-control/sample/ox.png",
        heroes : [ {
            id : 1,
            name : "Hard Working Ant",
            picture : "res/list-control/sample/ant.png",
            description : "hard working ant",
            link: "http://google.com"
        }, {
            id : 2,
            name : "Nice, Stubord Ass",
            picture : "res/list-control/sample/ass.png",
            description : "nice, stubord ass"
        }, {
            id : 3,
            name : "Little, Bussy Bee",
            picture : "res/list-control/sample/bee.png",
            description : "little, bussy bee"
        }, {
            id : 4,
            name : "Singing Beast",
            picture : "res/list-control/sample/beetle.png",
            description : "singing beast"
        } ]
    });

    return;

    var list = WinMain.doc.getByCssClass("js-widget-listview");

    list.setObject([ {
        id : 1,
        name : "Hard Working Ant",
        picture : "res/list-control/sample/ant.png"
    }, {
        id : 2,
        name : "Nice, Stubord Ass",
        picture : "res/list-control/sample/ass.png"
    }, {
        id : 3,
        name : "Little, Bussy Bee",
        picture : "res/list-control/sample/bee.png"
    }, {
        id : 4,
        name : "Singing Beast",
        picture : "res/list-control/sample/beetle.png"
    }, {
        id : 5,
        name : "A Bug's Life",
        picture : "res/list-control/sample/bug.png"
    }, {
        id : 6,
        name : "Nice Pussy",
        picture : "res/list-control/sample/cat.png"
    }, {
        id : 7,
        name : "It's a Hard Life",
        picture : "res/list-control/sample/ox.png"
    }, {
        id : 8,
        name : "He is the Champion",
        picture : "res/list-control/sample/rooster.png"
    } ]);

    list.on("item-hover", function (item) {
        $debug("item-hover", item.getUserData("value").name);
    });

    list.on("item-click", function (item) {
        $debug("item-click", item.getUserData("value").name);
    });
});