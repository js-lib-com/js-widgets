$package('js.widget');

$import('js.dom.Element');

js.widget.DefsListCtrl = function(ownerDoc, node) {
	this.$super(ownerDoc, node);

	this._termTemplate = new js.widget.Template(this.getFirstChild());
	this._termTemplate.on('click', this._onTermClick, this);
	this._termProperty = this._getProperty(this._termTemplate, 'term');

	this._defTemplate = new js.widget.Template(this.getFirstChild());
	this._defProperty = this._getProperty(this._defTemplate, 'definition');

	this.reset();
};

js.widget.DefsListCtrl.prototype = {
	set : function(defs) {
		for ( var i = 0; i < defs.length; i++) {
			this.addChild(this._termTemplate.create(defs[i][this._termProperty]));
			this.addChild(this._defTemplate.create(defs[i][this._defProperty]));
		}
	},

	get : function() {
		var a = [];
		var el = this.getFirstChild();
		while (el !== null) {
			var term = el.get(), def = null;
			el = el.getNextSibling();
			if (el !== null) {
				def = el.get();
				el = el.nextSibling();
			}

			var item = {};
			item[this._termProperty] = term;
			item[this._defProperty] = def;
			a.push(item);
		}
		return a;
	},

	reset : function() {
		this.removeChildren();
	},

	_onTermClick : function(ev) {
		ev.target.getNextSibling().toogleHidden();
	},

	/**
	 * Get this widget related object property name.
	 * 
	 * @param js.dom.Element el
	 * @param String defaultValue, value to be returned if none found, optional.
	 */
	_getProperty : function(el, defaultValue) {
		var classes = el._node.className.split(' ');
		for ( var i = 0, cls; classes.length; i++) {
			cls = classes[i];
			if (cls.charAt(0) === '$' && cls.indexOf('@') === -1) {
				return cls.substr(1);
			}
		}
		return defaultValue;
	}
};
$extends(js.widget.DefsListCtrl, js.dom.Element);
