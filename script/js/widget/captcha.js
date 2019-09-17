$package("js.widget");

/**
 * Client side CAPTCHA implementation. Because this class is in fact a widget it relies on HTML code. It needs an
 * element to display CAPTCHA challenge value and an images container; they both are identified by CSS class <b>value</b>
 * respective <b>images</b>. There is also a clickable element with CSS class <b>load-challenge</b> used to load
 * another challenge in case user is not able to solve the riddle.
 * <p>
 * Here is the reference CAPTCHA layout implementation. Fieldset hosting CAPTCHA layout may have <code>data-name</code>
 * attribute. If present, CAPTCHA is automatically tested for validity by parent form and <code>validity</code> CSS
 * class mark updated accordingly.
 * 
 * <pre>
 *  &lt;form&gt;
 *      &lt;fieldset&gt;
 *          ...
 *      &lt;/fieldset&gt;
 *      
 *      &lt;fieldset data-name="captcha" data-class="js.widget.Captcha"&gt;
 *          &lt;p&gt;Click on &lt;span class="value"&gt;astronaut&lt;/span&gt; or &lt;a class="load-challenge"&gt;load&lt;/a&gt; another set.&lt;/p&gt;
 *          &lt;div class="images"&gt;&lt;img src="astronaut.png" /&gt;...&lt;img src="bag.png"/&gt;&lt;/div&gt;
 *      &lt;/fieldset&gt;
 *  &lt;/form&gt;
 * </pre>
 * 
 * <p>
 * Deprecated implementation: challenge response should be send from client together with data to protect. Current
 * solution enables the form submission if challenge response is recognized by server but client can reverse engineer
 * and send the form bypassing form validation.
 * 
 * @author Iulian Rotaru
 * @constructor Construct CAPTCHA instance.
 * 
 * @param js.dom.Document ownerDoc owner document,
 * @param Node node wrapped native node.
 */
js.widget.Captcha = function(ownerDoc, node) {
	$assert(this instanceof js.widget.Captcha, "js.widget.Captcha#Captcha", "Invoked as function.");
	this.$super(ownerDoc, node);

	/**
	 * CAPTCHA instance index.
	 * 
	 * @type Number
	 */
	this._index = js.widget.Captcha.INDEX_SEED++;

	/**
	 * Callback for asynchronous {@link #isCorrect}.
	 * 
	 * @type Function
	 */
	this._callback = null;

	/**
	 * Callback run-time execution scope. Optional, default to global scope.
	 * 
	 * @type Object
	 */
	this._scope = null;

	/**
	 * Challenge value container. It is an element with CSS class <em>value</em> used by this class to display
	 * challenge text value.
	 * 
	 * @type js.dom.Element
	 */
	this._value = this.getByCssClass("value");

	/**
	 * Challenge images container. It is an element with CSS class <em>images</em> used by this class to display
	 * challenge images.
	 * 
	 * @type js.dom.Element
	 */
	this._images = this.getByCssClass("images");
	this._images.removeChildren();

	/**
	 * Validity state of this CAPTCHA instance, updated every time user select a challenge image. This value is then
	 * returned by {@link #isValid()}.
	 * 
	 * @type Boolean
	 */
	this._valid = false;

	this.getByCssClass("load-challenge").on("click", this._loadChallenge, this);
	this._loadChallenge();
};

/**
 * CAPTCHA instance index seed.
 * 
 * @type Number
 */
js.widget.Captcha.INDEX_SEED = 0;

js.widget.Captcha.prototype = {
	/**
	 * Server side CAPTCHA class.
	 * 
	 * @type String
	 */
	_SERVER_CAPTCHA_CLASS : "js.http.captcha.Captcha",

	/**
	 * Mark CSS class to identify invalid state.
	 * 
	 * @type String
	 */
	_CSS_INVALID : "invalid",

	/**
	 * Mark CSS class to identify selected challenge element.
	 * 
	 * @type String
	 */
	_CSS_SELECTED : "selected",

	/**
	 * Override control implementation to return only <code>data-name</code> name.
	 * 
	 * @return String CAPTCHA control name.
	 */
	getName : function() {
		return this.getAttr("data-name");
	},

	/**
	 * CAPTCHA setter does nothing.
	 * 
	 * @return js.widget.Captcha this object;
	 */
	setValue : function() {
		return this;
	},

	/**
	 * CAPTCHA has no value to return.
	 * 
	 * @return Object always return null.
	 */
	getValue : function() {
		return null;
	},

	/**
	 * Reset CAPTCHA control.
	 * 
	 * @return js.widget.Captcha this object.
	 */
	reset : function() {
		this.removeCssClass(this._CSS_INVALID);
		this.findByTag("img").removeCssClass(this._CSS_SELECTED);
		this._valid = false;
		return this;
	},

	/**
	 * Return this CAPTCHA validity state and update CSS mark class. Validity state, see {@link #_valid} is updated
	 * every time user select a challenge image. This method simply return cached value.
	 * 
	 * @return Boolean true if selected image is the correct one.
	 * @see #_valid
	 */
	isValid : function() {
		this.addCssClass(this._CSS_INVALID, !this._valid);
		return this._valid;
	},

	/**
	 * On image click extract challenge token attached to image and test its correctness on server side logic. Challenge
	 * response is verified by {@link #_onResponseVerified(Object)}.
	 */
	_onCaptchaImageClick : function(ev) {
		this.removeCssClass(this._CSS_INVALID);
		this.findByCss("img").removeCssClass(this._CSS_SELECTED);
		var img = ev.target;
		img.addCssClass(this._CSS_SELECTED);

		// SRC is something like ...resource.xsp?token=983aa14ed173493b9f08b41dd4592e6e
		// response is token that identify the image, i.e. last 32 chars
		var src = img.getSrc();
		var response = src.substr(src.length - 32);

		var rmi = new js.net.RMI();
		rmi.setMethod(this._SERVER_CAPTCHA_CLASS, "verifyResponse");
		rmi.setParameters(this._index, response);
		rmi.exec(this._onResponseVerified, this);
	},

	/**
	 * Callback invoked by server side challenge response verify. This method gets challenge validity result from
	 * server: if challenge response was correct server returns null. If challenge response was not correct server
	 * returns another challenge to give user another try.
	 * 
	 * @param Object challenge new challenge if response was rejected and null if accepted.
	 */
	_onResponseVerified : function(challenge) {
		// new challenge is sent back by server signal that response was wrong and need to reload challenge
		// if challenge is null response was correct
		// in both cases remove invalid CSS mark class
		this.removeCssClass(this._CSS_INVALID);

		if (challenge) {
			this._valid = false;
			this._onChallengeLoaded(challenge);
		}
		else {
			this._valid = true;
		}
	},

	/**
	 * Handler for user request to load another challenge. This method is executed asynchronously and the actual
	 * challenge is loaded into user interface by {@link #_onChallengeLoaded}.
	 */
	_loadChallenge : function(ev) {
		if (typeof ev !== "undefined") {
			ev.halt();
		}
		var rmi = new js.net.RMI();
		rmi.setMethod(this._SERVER_CAPTCHA_CLASS, "getChallenge");
		rmi.setParameters(this._index);
		rmi.exec(this._onChallengeLoaded, this);
	},

	/**
	 * Load another challenge on user interface. Challenge is provided by server side logic on user request to load new
	 * challenge or when select an incorrect response.
	 */
	_onChallengeLoaded : function(challenge) {
		this._value.setValue(challenge.value);
		this._images.removeChildren();
		for (var i = 0, images = challenge.images, img; i < images.length; i++) {
			img = this._ownerDoc.createElement("img").setSrc(images[i]);
			img.on("click", this._onCaptchaImageClick, this);
			this._images.addChild(img);
		}
	},

	/**
	 * Returns a string representation of the object.
	 * 
	 * @return String object string representation.
	 */
	toString : function() {
		return "js.widget.Captcha";
	}
};
$extends(js.widget.Captcha, js.dom.Control);
$preload(js.widget.Captcha);
