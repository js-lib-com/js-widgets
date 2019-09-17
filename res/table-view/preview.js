$package("js.widget.test");
$declare("js.widget.Controller");

js.widget.test.Page = function() {
	this.$super();

	this._filter = this.getByCssClass("filter");

	this._personsPages = this.getByCssClass("persons-pages");
	this._personsPages.setLoader(js.widget.Controller, "loadPage");

	this._personsList = this.getByCssClass("persons-list");
	this._personsList.setObject(persons);

	this.getByCss("button[type=submit]").on("click", this._onSubmit, this);
};

js.widget.test.Page.prototype = {
	_onSubmit : function(ev) {
		ev.prevent();
		if (this._filter.isValid()) {
			this._personsPages.load(this._filter.getObject());
		}
	}
};
$extends(js.widget.test.Page, js.ua.Page);

persons = [ {
	id : 1,
	firstName : "John",
	lastName : "Doe",
	birthYear : "unknown"
}, {
	id : 2,
	firstName : "Mary",
	lastName : "Poppins",
	birthYear : 1920
}, {
	id : 3,
	firstName : "Issac",
	lastName : "Newton",
	birthYear : 1650
}, {
	id : 4,
	firstName : "Albert",
	lastName : "Einstein",
	birthYear : 1880
}, {
	id : 5,
	firstName : "Ludwig",
	lastName : "van Beethowen",
	birthYear : 1760
}, {
	id : 6,
	firstName : "Marie",
	lastName : "Currie",
	birthYear : 1870
}, {
	id : 7,
	firstName : "Mihai",
	lastName : "Eminescu",
	birthYear : 1850
} ];

js.widget.Controller.loadPage = function(request, callback, scope) {
	var start, end;
	start = request.pageIndex * request.pageSize;
	end = start + request.pageSize;
	callback.call(scope, {
		total : persons.length,
		items : persons.slice(start, end)
	});
};
