$package('js.widget');

$import('js.event.EventsPublisher');
$import('js.dom.Element');
$import('js.widget.Template');
$import('js.net.RPC');
$import('js.lang.Types');
$import('js.util.List');
$import('js.dom.Node');
$import('js.dom.NodeList');

/**
 * List control. This list control fires a number of events all with the same event object as parameter. For now event
 * has only two properties: target, the element from this list generating the event and value which is the object
 * associated to the element.
 * 
 * @constructor Construct list control instance.
 * 
 * @param js.dom.Document ownerDoc this list control parent document
 * @param Node node wrapped DOM node.
 */
js.widget.ListCtrl = function(ownerDoc, node) {
	this.$super(ownerDoc, node);

	var templateNode = js.dom.Node.getElementsByClassName(this._node, js.widget.ListCtrl.CLASS_TEMPLATE);
	templateNode = templateNode.length > 0 ? templateNode.item(0) : js.dom.Node.firstElementChild(node);
	$assert(templateNode !== null);

	// if this list contains simple elements, like a list of images, there is
	// no attempt to bind a view widget but uses specific standard HTML element
	if (js.dom.Node.hasChildren(templateNode)) {
		// js.dom.Node.bind(templateNode, 'js.widget.View');
	}

	/**
	 * This list control template.
	 * 
	 * @type js.widget.Template
	 */
	this._template = new js.widget.Template(ownerDoc.getElement(templateNode));
	if (this._template.getByCss('input[type="checkbox"]') !== null) {
		this.getMultiSelection = this._getMultiChecked;
		this.deselect = this._uncheck;
	}
	else {
		/**
		 * Selected items.
		 * 
		 * @type js.util.List
		 */
		this._selectedItems = new js.util.List();
		this._template.on('click', this._onItemClick, this);
		this._template.on('mouseover', this._onItemMouseOver, this);
	}

	/**
	 * Custom events.
	 * 
	 * @type js.event.CustomEvents
	 */
	this._events = this.getCustomEvents();
	this._events.register('before-add', 'item-click', 'item-hover', 'item-selected');
	this.reset();
};

/**
 * Mark class to identify list control template.
 * 
 * @type String
 */
js.widget.ListCtrl.CLASS_TEMPLATE = 'template';

js.widget.ListCtrl.CLASS_SELECTED = 'selected';

js.widget.ListCtrl.prototype = {
	load : function(remoteMethod) {
		var rpc = new js.net.RPC(remoteMethod);
		rpc.setArguments($arguments(arguments, 1));
		rpc.setCallback(this.set, this);
		rpc.send();
	},

	/**
	 * Set list value.
	 * 
	 * @param Array values, data collection to set this list value to.
	 */
	set : function(values) {
		if (!js.lang.Types.isArray(values)) {
			values = [ values ];
		}
		this.reset();
		return this.addAll(values);
	},

	/**
	 * Get list value. Returns an array with this list values; if optional index is present returns only requested item
	 * value.
	 * 
	 * @param Number... index, optional index.
	 * @return Array an array initialized with this list items values.
	 * @assert if <em>index</em> argument is present it should be a {@link Number} and its positive value less than
	 *         this list size.
	 */
	get : function(index) {
		$assert(typeof index === 'undefined' || (js.lang.Types.isNumber(index) && index >= 0 && index < this.size()));
		if (js.lang.Types.isNumber(index)) {
			return this.getChildren().item(index).get();
		}
		var a = [];
		var it = this.getChildren().it();
		while (it.hasNext()) {
			a.push(it.next().get());
		}
		return a;
	},

	/**
	 * Add all values.
	 * 
	 * @param Object values to add.
	 * @return js.widget.ListCtrl this object.
	 */
	addAll : function(values) {
		var it = new js.lang.Uniterator(values);
		while (it.hasNext()) {
			this.add(it.next());
		}
		return this;
	},

	/**
	 * Remove all this list items.
	 * 
	 * @return js.widget.ListCtrl this object.
	 */
	clear : function() {
		if (this._selectedItems) {
			this._selectedItems.clear();
		}
		this.removeChildren();
		return this;
	},

	/**
	 * Reset all this list items content.
	 * 
	 * @return js.widget.ListCtrl this object.
	 */
	reset : function() {
		if (this._selectedItems) {
			this._selectedItems.clear();
		}
		this.getChildren().call('reset');
		return this;
	},

	/**
	 * Add a value to this list.
	 * 
	 * @param Object value, a value to be added to this list.
	 */
	add : function(value) {
		if (value) {
			var child = this._template.create();
			child.setUserData('value', value);
			this._fireEvent('before-add', child, value);
			this.addChild(child.setValue(value));
		}
		return this;
	},

	size : function() {
		return js.dom.Node.childElementCount(this._node);
	},

	isEmpty : function() {
		return !this.hasChildren();
	},

	hasSelection : function() {
		return !this._selectedItems.isEmpty();
	},

	getMultiSelection : function() {
		return this._ownerDoc.getEList(new js.dom.NodeList(this._selectedItems.toArray()));
	},

	_getMultiChecked : function() {
		var it = this.findByCss('input:checked').it();
		var nodeList = new js.dom.NodeList();
		while (it.hasNext()) {
			nodeList.push(it.next().getParent()._node);
		}
		return this._ownerDoc.getEList(nodeList);
	},

	getSelection : function() {
		return this._ownerDoc.getElement(this._selectedItems.get(0));
	},

	deselect : function() {
		this._selectedItems.clear(function(node) {
			this._ownerDoc.getElement(node).removeCssClass(js.widget.ListCtrl.CLASS_SELECTED);
		}, this);
	},

	_uncheck : function() {
		var it = this.getChildren().it();
		while (it.hasNext()) {
			it.next().getByCss('input[type="checkbox"]').reset();
		}
	},

	/**
	 * 
	 * @param Object ev
	 * @param Object el
	 */
	_onItemClick : function(ev, el) {
		this._fireEvent('item-click', el);
		if (!ev.ctrlKey) {
			return;
		}
		ev.halt();
		if (this._selectedItems.contains(el._node)) {
			el.removeCssClass(js.widget.ListCtrl.CLASS_SELECTED);
			this._selectedItems.remove(el._node);
			return;
		}
		el.addCssClass(js.widget.ListCtrl.CLASS_SELECTED);
		this._selectedItems.add(el._node);
		this._fireEvent('item-selected', el);
	},

	/**
	 * On item mouse over event handler. This handler is registered by js.widget.Template class which add as parameter
	 * the item generating this event.
	 * 
	 * @param Object ev
	 * @param Object item
	 */
	_onItemMouseOver : function(ev, item) {
		this._fireEvent('item-hover', item);
	},

	/**
	 * Internal helper used to fire events. All events have the save event object as parameter. Event target is this
	 * list child element generating the event and value is element associated object.
	 * 
	 * @param String type, event type,
	 * @param js.dom.Element element, target element,
	 * @param Object... value, optional event value, default to element value.
	 */
	_fireEvent : function(type, element, value) {
		if (typeof value === 'undefined') {
			value = element.getUserData('value');
		}
		this._events.fire(type, {
			target : element,
			value : value
		});
	},

	/**
	 * Add item listener.
	 * 
	 * @param String selectors
	 * @param String type
	 * @param Function listener
	 * @param Object scope
	 * @param Object arg
	 */
	addItemListener : function(selectors, type, listener, scope, arg) {
		var it = this.getChildren().it();
		while (it.hasNext()) {
			it.next().getByCss(selectors).on(type, listener, scope, arg);
		}
		this._template.addItemListener.apply(this._template, arguments);
	},

	/**
	 * Returns a string representation of the object.
	 * 
	 * @return String object string representation.
	 */
	toString : function() {
		return 'js.widget.ListCtrl';
	}
};
$extends(js.widget.ListCtrl, js.dom.Element);
$mixin(js.widget.ListCtrl, js.event.EventsPublisher);
