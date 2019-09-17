$package('js.tests.dom');

$include('js.dom.Captcha');
$include('js.dom.Anchor');
$include('js.dom.Image');

js.tests.dom.Captcha =
{
    before: function() {
        this._loadChallenge = js.dom.Captcha.prototype._loadChallenge;
        this._loadChallengeProbe = 0;
        var _this = this;
        js.dom.Captcha.prototype._loadChallenge = function() {
            _this._loadChallengeProbe++;
        };
        var html = '' +
        '<fieldset class="invalid" data-class="js.dom.Captcha">' +
        '	<p><span class="value">astronaut</span> <a class="load-challenge"></a></p>' +
        '	<div class="images"></div>' +
        '</fieldset>';
        document.getElementById('scratch-area').innerHTML = html;
        this._doc = new js.dom.Document(document);
        this._node = document.querySelector('#scratch-area fieldset');
        this._el = this._doc.getByCss('#scratch-area fieldset');
    },

    after: function() {
        js.dom.Captcha.prototype._loadChallenge = this._loadChallenge;
        var n = document.getElementById('scratch-area');
        while (n.firstChild) {
            n.removeChild(n.firstChild);
        }
        this._doc = null;
    },

    testConstructor: function() {
        assertEquals(1, this._loadChallengeProbe);
        assertEquals('span', this._el._value._node.nodeName.toLowerCase());
        assertEquals('div', this._el._images._node.nodeName.toLowerCase());
        assertSize(0, this._el._images._node.childNodes);
        assertNull(this._el._response);

        var loadChallenge = this._el.getByCssClass('load-challenge');
        assertEquals('click', loadChallenge._domEvents._handlers[0].type);
        assertEquals(js.dom.Captcha.prototype._loadChallenge, loadChallenge._domEvents._handlers[0].listener);
    },

    testReset: function(context) {
        this._el._images._node.innerHTML = '<img class="selected" />';
        this._el._response = {};
        assertEquals(this._el, this._el.reset());
        assertEmpty(this._node.getAttribute('class'));
        assertEmpty(this._node.querySelector('img').getAttribute('class'));
        assertNull(this._el._response);
    },

    testValid: function() {
        this._node.setAttribute('class', '');
        assertFalse(this._node.getAttribute('class'));
        assertFalse(this._el.isValid());
        assertEquals('invalid', this._node.getAttribute('class'));
        this._el._response = {};
        assertTrue(this._el.isValid());
        assertFalse(this._node.getAttribute('class'));
    },

    testIsCorrect: function(context) {
        context.push('js.net.RMI');
        var captcha = this._el;
        var probe = 0;

        js.net.RMI = function(url, response, callback, scope) {
            this.setMethod = function(className, methodName) {
                assertEquals('js.web.captcha.Captcha', className);
                assertEquals('verifyChallengeResponse', methodName);
                probe += 1;
            };

            this.setParameters = function(param) {
                assertEquals('Q1W2E3R4T5', param);
                probe += 2;
            };

            this.exec = function(callback, scope) {
                assertEquals(captcha._onResponseVerified, callback);
                assertEquals(captcha, scope);
                probe += 4;
            };
        };

        this._el._response = 'Q1W2E3R4T5';
        function callback() {
        };
        assertEquals(this._el, this._el.isCorrect(callback));
        assertEquals(7, probe);
        assertEquals(callback, this._el._callback);
        assertEquals(window, this._el._scope);

        assertAssertion(this._el, 'isCorrect');
        this._el._response = null;
        assertAssertion(this._el, 'isCorrect', callback);
    },

    testOnResponseVerified: function(context) {
        var challenge =
        {
            value: 'conundrum',
            images: ['captcha-resource.xsp?token=983aa14ed173493b9f08b41dd4592e6e']
        };

        context.push('js.dom.Captcha.prototype._onChallengeLoaded');
        js.dom.Captcha.prototype._onChallengeLoaded = function(_challenge) {
            assertEquals(challenge, _challenge);
        };

        this._el._response = 'response';
        this._el._onResponseVerified(challenge);
        assertNull(this._el._response);
        assertEquals('invalid', this._node.getAttribute('class'));

        var callbackProbe = 0;
        this._el._callback = function() {
            callbackProbe++;
        };
        this._el._onResponseVerified();
        assertEquals(1, callbackProbe);
    },

    testOnChallengeLoaded: function() {
        this._el._onChallengeLoaded(
        {
            value: 'conundrum',
            images: ['captcha-resource.xsp?token=983aa14ed173493b9f08b41dd4592e6e']
        });
        assertEquals('conundrum', this._el._value._node.firstChild.nodeValue);

        var images = this._el._images._node.childNodes;
        assertSize(1, images);
        assertEquals('captcha-resource.xsp?token=983aa14ed173493b9f08b41dd4592e6e', images.item(0).getAttribute('src'));

        var image = this._el.getByTag('img');
        assertEquals('click', image._domEvents._handlers[0].type);
        assertEquals(js.dom.Captcha.prototype._onCaptchaImageClick, image._domEvents._handlers[0].listener);
    },

    testOnCaptchaImageClick: function(context) {
        this._el._images._node.innerHTML = '<img src="captcha-resource.xsp?token=983aa14ed173493b9f08b41dd4592e6e" /><img class="selected" />';
        this._el._onCaptchaImageClick(
        {
            target: this._el.getByTag('img')
        });
        assertFalse(this._node.getAttribute('class'));
        assertEquals('selected', this._node.querySelectorAll('img').item(0).getAttribute('class'));
        assertFalse(this._node.querySelectorAll('img').item(1).getAttribute('class'));
        assertEquals('983aa14ed173493b9f08b41dd4592e6e', this._el._response);
    }
};
TestCase.register('js.tests.dom.Captcha');
