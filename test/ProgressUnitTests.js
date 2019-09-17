$package('js.tests.dom');

$include('js.dom.Progress');

js.tests.dom.Progress =
{
    before: function(html) {
        if (js.ua.Engine.TRIDENT) {
            document.getElementById('scratch-area').innerHTML = '<div id="progress" data-class="js.dom.Progress"></div>';
        }
        else {
            document.getElementById('scratch-area').innerHTML = '<progress id="progress" />';
        }
        var doc = new js.dom.Document(document);
        this.node = document.getElementById('progress');
        this.el = doc.getById('progress');
    },

    after: function() {
        var n = document.getElementById('scratch-area');
        while (n.firstChild) {
            n.removeChild(n.firstChild);
        }
    },

    testProgress: function() {
        assertClass('js.dom.Progress');

        assertEquals(100, this.node.max);
        assertEquals(this.el, this.el.start());
        assertEquals(this.el, this.el.setTotal(200));
        assertEquals(200, this.node.max);
        assertEquals(this.el, this.el.setValue(10));
        assertEquals(10, this.node.value);

        // total should be positive; 0 is silently replaced by 1
        this.el.setTotal(0);
        assertEquals(1, this.node.max);
        this.node.max = 200;

        assertAssertion(this.el, 'setTotal');
        assertAssertion(this.el, 'setTotal', null);
        assertAssertion(this.el, 'setTotal', '');
        assertAssertion(this.el, 'setTotal', '400');
        assertEquals(200, this.node.max);

        assertAssertion(this.el, 'setValue');
        assertAssertion(this.el, 'setValue', null);
        assertAssertion(this.el, 'setValue', '');
        assertAssertion(this.el, 'setValue', '40');
        assertEquals(10, this.node.value);

        $assert.disable();
        this.el.setTotal();
        this.el.setTotal(null);
        this.el.setTotal('');
        assertEquals(1, this.node.max);
        this.el.setTotal('400');
        assertEquals(400, this.node.max);

        this.el.setValue();
        this.el.setValue(null);
        this.el.setValue('');
        assertEquals(0, this.node.value);
        this.el.setValue('40');
        assertEquals(40, this.node.value);
    },

    testGetNumber: function() {
        assertEquals(100, this.el._getNumber(100, 1));
        assertEquals(100, this.el._getNumber('100', 1));
        assertEquals(1, this.el._getNumber(-100, 1));
        assertEquals(1, this.el._getNumber({}, 1));

        assertEquals(100, this.el._getNumber(100, 0));
        assertEquals(100, this.el._getNumber('100', 0));
        assertEquals(0, this.el._getNumber(-100, 0));
        assertEquals(0, this.el._getNumber({}, 0));
    }
};
TestCase.register('js.tests.dom.Progress');
