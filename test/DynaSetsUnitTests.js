$package("js.tests.dom");

$include("js.dom.DynaSets");

js.tests.dom.DynaSetsUnitTests = {
    _doc : null,
    _root : null,

    beforeClass : function () {
        this._doc = new js.dom.Document(document);
        this._root = this._doc.getById("scratch-area");
    },

    after : function () {
        var n = document.getElementById("scratch-area");
        while (n.firstChild) {
            n.removeChild(n.firstChild);
        }
    },

    testSetObjectWithList : function () {
        var html = "" + //
        "<form>" + //
        "   <input name='title' />" + //
        "   <div data-name='persons' data-class='js.dom.DynaSets'>" + //
        "       <fieldset>" + //
        "           <input name='firstName' />" + //
        "           <input name='surname' />" + //
        "       </fieldset>" + //
        "   </div>" + //
        "</form>";
        this._root.setHTML(html);
        var form = this._doc.getByCss("#scratch-area form");
        form.setObject({
            title : "Persons",
            persons : [ {
                firstName : "John",
                surname : "Doe"
            }, {
                firstName : "Maximus",
                surname : "Decimus"
            } ]
        });

        var controls = form.findByTag("input");
        assertEquals(5, controls.size());
        assertEquals("Persons", controls.item(0).getValue());
        assertEquals("John", controls.item(1).getValue());
        assertEquals("firstName", controls.item(1).getAttr("name"));
        assertEquals("Doe", controls.item(2).getValue());
        assertEquals("surname", controls.item(2).getAttr("name"));
        assertEquals("Maximus", controls.item(3).getValue());
        assertEquals("firstName", controls.item(3).getAttr("name"));
        assertEquals("Decimus", controls.item(4).getValue());
        assertEquals("surname", controls.item(4).getAttr("name"));
    },

    testGetObjectWithList : function () {
        var html = "" + //
        "<form>" + //
        "   <input name='title' value='Persons' />" + //
        "   <div data-name='persons' data-class='js.dom.DynaSets'>" + //
        "       <fieldset>" + //
        "           <input name='firstName' />" + //
        "           <input name='surname' />" + //
        "       </fieldset>" + //
        "   </div>" + //
        "</form>";
        this._root.setHTML(html);
        var form = this._doc.getByCss("#scratch-area form");
        form.setObject({
            title : "Persons",
            persons : [ {
                firstName : "John",
                surname : "Doe"
            }, {
                firstName : "Maximus",
                surname : "Decimus"
            } ]
        });

        var object = form.getObject();
        assertEquals("Persons", object.title);
        assertEquals(2, object.persons.length);
        assertEquals("John", object.persons[0].firstName);
        assertEquals("Doe", object.persons[0].surname);
        assertEquals("Maximus", object.persons[1].firstName);
        assertEquals("Decimus", object.persons[1].surname);
    },

    testAddSet : function () {
        var html = "" + //
        "<form>" + //
        "   <div data-name='persons' data-class='js.dom.DynaSets'>" + //
        "       <fieldset>" + //
        "           <input name='firstName' value='John' />" + //
        "           <input name='surname' value='Doe' />" + //
        "       </fieldset>" + //
        "   </div>" + //
        "</form>";
        this._root.setHTML(html);
        var form = this._doc.getByCss("#scratch-area form");
        var dynaSets = form.getByTag("div");
        dynaSets.addSet().addSet();

        var controls = form.findByTag("input");
        assertEquals(4, controls.size());
        assertNull(controls.item(0).getValue());
        assertNull(controls.item(1).getValue());
        assertNull(controls.item(2).getValue());
        assertNull(controls.item(3).getValue());
    }
};
TestCase.register("js.tests.dom.DynaSetsUnitTests");
