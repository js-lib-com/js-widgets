$package("js.widget.test");
$declare("js.widget.Controller");

js.widget.test.Page = function () {
    this.$super();

    this._request = {
        pageIndex : 0,
        pageSize : this.PAGE_SIZE
    };

    this._list = WinMain.doc.getByCss(".preview>.list");

    this._paging = WinMain.doc.getByCss(".preview>.paging");
    this._paging.setPageSize(this.PAGE_SIZE);
    this._paging.on("change", this._onPagingChange, this);
};

js.widget.test.Page.prototype = {
    PAGE_SIZE : 3,

    _onPagingChange : function (pageIndex) {
        // var request = this._paging.getRequest();
        // request.pageIndex = pageIndex;
        // or maybe better to create 'update' event with request as argument

        this._request.pageIndex = pageIndex;
        js.widget.Controller.loadListPage(this._request, this._onPagingResponse, this);
    },

    _onPagingResponse : function (response) {
        this._list.setObject(response.items);
        this._paging.setItemsCount(response.total);
    }
};
$extends(js.widget.test.Page, js.ua.Page);

items = [ {
    id : 1,
    name : "Hard Working Ant",
    picture : "res/list-ctrl/sample/ant.png",
    description : "hard working ant",
}, {
    id : 2,
    name : "Nice, Stubord Ass",
    picture : "res/list-ctrl/sample/ass.png",
    description : "nice, stubord ass",
}, {
    id : 3,
    name : "Little, Bussy Bee",
    picture : "res/list-ctrl/sample/bee.png",
    description : "little, bussy bee",
}, {
    id : 4,
    name : "Singing Beast",
    picture : "res/list-ctrl/sample/beetle.png",
    description: "singing beast",
}, {
    id : 5,
    name : "A Bug's Life",
    picture : "res/list-ctrl/sample/bug.png",
    description: "a bug's life",
}, {
    id : 6,
    name : "Nice Pussy",
    picture : "res/list-ctrl/sample/cat.png",
    description: "nice pussy",
}, {
    id : 7,
    name : "It's a Hard Life",
    picture : "res/list-ctrl/sample/ox.png",
    description: "it's a hard life",
}, {
    id : 8,
    name : "He is the Champion",
    picture : "res/list-ctrl/sample/rooster.png",
    description: "he is the champion",
} ];

js.widget.Controller.loadListPage = function (request, callback, scope) {
    var start, end;
    start = request.pageIndex * request.pageSize;
    end = start + request.pageSize;
    callback.call(scope, {
        total : items.length,
        items : items.slice(start, end)
    });
};
