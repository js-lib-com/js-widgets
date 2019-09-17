$package("js.widget");

/**
 * Basic list of items with picture and name. This class is a low level control designed to integrate into more complex
 * views rather than being used stand alone. A list item is an UI element with picture, label and tooltip created from a
 * {@link js.widget.ListControl.Value} object. List control has {@link #setObject(Array)} method, responsible for item
 * elements creation.
 * <p>
 * List control interface is oriented on value object. User code add, remove, update, select and retrieve value objects
 * and rendering logic takes care to keep item elements in sync.
 * 
 * <p>
 * To use <code>js.widget.ListControl</code> one needs to import it into project library, default name being
 * <code>list-control</code>, then reference it, see <code>&lt;div wood:widget="list-control" ... /&gt;</code>
 * element from sample layout.
 * 
 * <pre>
 *  &lt;div class="users-list" data-class="com.example.UsersList"&gt;
 *      &lt;h1 class="caption"&gt;Users List&lt;/h1&gt;
 *      &lt;ul&gt;
 *          &lt;li data-action="add"&gt;Add&lt;/li&gt;
 *          &lt;li data-action="edit"&gt;Edit&lt;/li&gt;
 *          &lt;li data-action="remove"&gt;Remove&lt;/li&gt;
 *      &lt;/ul&gt;
 *      &lt;div wood:widget="list-control" data-list="." /&gt;
 *  &lt;/div&gt;
 * </pre>
 * 
 * <h5>Custom Layout</h5>
 * It is also possible to create custom layout with arbitrary complexity in which case generic behavior provided by this
 * class is enacted. Also layout style is inherited but of course should be augmented with styles for item content. In
 * order to reuse list control logic, custom layout should agree on next constrains:
 * <ul>
 * <li>container element should have <code>js-widget-listcontrol</code> CSS class,
 * <li>container element should implement list control class, see <code>data-class="js.widget.ListControl"</code>,
 * <li>list element should have <code>list</code> CSS class,
 * <li>list element should be the root of list values, see <code>data-list="."</code>,
 * <li>list item element should have <code>item</code> CSS class.
 * </ul>
 * <p>
 * 
 * <pre>
 *  &lt;div class="js-widget-listcontrol objects-list" data-class="js.widget.ListControl"&gt;
 *      &lt;ul class="list" data-list="."&gt;
 *          &lt;li class="item" data-id="id"&gt;
 *              &lt;a data-href="link" target="_blank"&gt;&lt;img class="picture" data-src="picture" /&gt;&lt;/a&gt;
 *              &lt;dl&gt;
 *                  &lt;dt&gt;Owner&lt;/dt&gt;
 *                  &lt;dd data-text="owner"&gt;&lt;/dd&gt;
 *                  &lt;dt&gt;Name&lt;/dt&gt;
 *                  &lt;dd data-text="name"&gt;&lt;/dd&gt;
 *                  &lt;dt&gt;Kind&lt;/dt&gt;
 *                  &lt;dd data-text="kind"&gt;&lt;/dd&gt;
 *                  &lt;dt&gt;ID&lt;/dt&gt;
 *                  &lt;dd data-text="id"&gt;&lt;/dd&gt;
 *              &lt;/dl&gt;
 *          &lt;/li&gt;
 *      &lt;/ul&gt;
 *      &lt;br clear="all" /&gt;
 *  &lt;/div&gt;
 * </pre>
 * 
 * For custom layout, value object is user defined. Is developer responsibility to ensure item layout and value object
 * are consistent. Anyway, <code>id</code> property should be present, for properly value object handling by this list
 * control logic.
 * 
 * <h5>Pagination</h5>
 * There is no intrinsic support for pagination provided by list control; one needs to code extra-logic to add it, see
 * sample code.
 * <p>
 * 
 * <pre>
 *  &lt;div&gt;
 *      &lt;div wood:widget="list-control"&gt;&lt;/div&gt;
 *      &lt;ul wood:widget="paging"&gt;&lt;/ul&gt;
 *  &lt;/div&gt;
 * </pre>
 * 
 * <pre>
 *  Page = function () {
 *      this._request = {
 *          pageIndex : 0,
 *          pageSize : this.PAGE_SIZE
 *      };
 *
 *      this._listControl = this.getByClass(js.widget.ListControl);
 *
 *      this._paging = this.getByClass(js.widget.Paging);
 *      this._paging.setPageSize(this.PAGE_SIZE);
 *      this._paging.on("change", this._onPagingChange, this);
 *      this._onPagingChange(0);
 *  };
 *
 *  Page.prototype = {
 *      PAGE_SIZE : 10,
 *
 *      _onPagingChange : function (pageIndex) {
 *          this._request.pageIndex = pageIndex;
 *          js.widget.Controller.loadListPage(this._request, this._onPagingResponse, this);
 *      },
 *
 *      _onPagingResponse : function (response) {
 *          this._listControl.setObject(response.items);
 *          this._paging.setItemsCount(response.total);
 *      }
 *  };
 * </pre>
 * 
 * <h5>Events</h5>
 * Custom events fired by list control. All events have a single argument, namely {@link js.widget.ListControl.Event}.
 * <p>
 * <table style="border-collapse:collapse;" border="1">
 * <tr>
 * <td><b>Type
 * <td><b>Trigger
 * <tr>
 * <td>item-click
 * <td>mouse click on list item
 * <tr>
 * <td>item-dblclick
 * <td>mouse double click on list item
 * <tr>
 * <td>item-select
 * <td>list item selection state was changed</table>
 * 
 * @author Iulian Rotaru
 * 
 * @constructor Construct list control instance.
 * @param Document ownerDoc owner document,
 * @param Node node native node.
 */
js.widget.ListControl = function(ownerDoc, node) {
	this.$super(ownerDoc, node);

	/**
	 * Underlying list element.
	 * 
	 * @type js.dom.Element
	 */
	this._listElement = this.getByCssClass("list");

	/**
	 * List control values storage. This is an array of {@link js.widget.ListControl.Value} objects storing this list
	 * control values.
	 * 
	 * @type Array
	 */
	this._values = [];

	/**
	 * Selected values cache. This cache stores references of {@link js.widget.ListControl.Value} object from values
	 * storage and is kept updated by selection handling methods.
	 * 
	 * @type Array
	 * @see #select(js.widget.ListControl.Value,Boolean...)
	 * @see #deselect(js.widget.ListControl.Value)
	 * @see #deselectAll()
	 */
	this._selectedValues = [];

	/**
	 * List control custom events. Current implementation supports next events:
	 * <ul>
	 * <li>item-click - mouse click on list item,
	 * <li>item-dblclick = mouse double click on list item,
	 * <li>item-select - list item selection state was changed.
	 * </ul>
	 * <p>
	 * All custom events have a single parameter, an instance of <code>DataEvent</code>, see
	 * {@link #_fireEvent(String, js.dom.Element)}.
	 * 
	 * @type js.event.CustomEvents
	 */
	this._events = this.getCustomEvents();
	this._events.register("item-click", "item-dblclick", "item-select");

	/**
	 * Custom click handler, default to null. List control has own logic for mouse click processing but is allowed to
	 * override it, see {@link #setClickHandler}. Anyway, if custom click handler returns boolean true, this list
	 * control logic is executed after custom click handler.
	 * 
	 * @type Function
	 */
	this._clickHandler = null;

	/**
	 * Auto-select strategy controls how list items are selected, default to
	 * {@link js.widget.ListControl.Select#NONE NONE}.
	 * 
	 * @type js.widget.ListControl.Select
	 */
	this._autoSelect = js.widget.ListControl.Select.NONE;

	this.on("click", this._onClick, this);
	this.on("dblclick", this._onDoubleClick, this);
};

js.widget.ListControl.prototype = {
	/**
	 * Set auto-select strategy.
	 * 
	 * @param js.widget.ListControl.Select autoSelect auto-select strategy.
	 * @see #_autoSelect
	 */
	setAutoSelect : function(autoSelect) {
		this._autoSelect = autoSelect;
	},

	/**
	 * Set custom mouse click event handler.
	 * 
	 * @param Function handler custom mouse click event handler,
	 * @param Object scope handler execution scope.
	 */
	setClickHandler : function(handler, scope) {
		this._clickHandler = handler.bind(scope || window);
	},

	/**
	 * Create this list control items, an item element for every value from given value objects array.
	 * 
	 * @param Array values to load into this list view.
	 * @return js.widget.ListControl this object.
	 * @assert <code>values</code> parameter is not undefined or null.
	 */
	setObject : function(values) {
		$assert(values, "js.widget.ListControl#setObject", "Values parameter is undefined or null.");
		this._values = values;
		this._listElement.setObject(this._values);
		this.show(values.length);
		return this;
	},

	/**
	 * Add value(s) to list. This method accepts a variable number of value objects. Value(s) is(are) added to internal
	 * storage and UI updated.
	 * 
	 * @param js.widget.ListControl.Value... value variable number of value objects.
	 * @return js.widget.ListControl this object.
	 * @assert <code>value</code> parameter is not undefined or null.
	 * @assert value object <code>id</code> is present.
	 * @see #_values
	 */
	add : function(value) {
		$assert(value, "js.widget.ListControl#add", "Value parameter is undefined or null.");
		$assert(value.id, "js.widget.ListControl#add", "Value ID is missing.");

		this._values.push.apply(this._values, arguments);

		// private access to templates engine implementation
		var itemTemplate = this._listElement.getUserData("item-template");

		var itemElement = itemTemplate.clone(true);
		itemElement.setUserData("value", value);
		itemElement.setObject(value);
		this._listElement.addChild(itemElement);

		// ensure list control is visible; it can be hidden if setObject got empty array
		this.show();
		return this;
	},

	/**
	 * Update value object. Locate value from list control values storage, using <code>id</code> as search key, and
	 * update properties. If this list does not contain a value object with specified <code>id</code> this method does
	 * nothing. Ensure value is deselected.
	 * 
	 * @param js.widget.ListControl.Value value value object.
	 * @return js.widget.ListControl this object.
	 * @assert <code>value</code> parameter is not undefined or null.
	 * @assert value object <code>id</code> is present.
	 */
	update : function(value) {
		$assert(value, "js.widget.ListControl#update", "Value parameter is undefined or null.");
		$assert(value.id, "js.widget.ListControl#update", "Value ID is missing.");

		var index = this._getValueIndex(this._values, value.id);
		if (index !== -1) {
			this._values[index] = value;
			this._listElement.getByIndex(index).setObject(value);
		}
		return this.deselect(value);
	},

	/**
	 * Remove value object. Locate value by <code>id</code> and remove it; this method uses actually only
	 * <code>id</code> property from given <code>value</code> argument. If this list does not contain a value object
	 * with specified <code>id</code> this method does nothing.
	 * 
	 * @param js.widget.ListControl.Value value value object to remove.
	 * @return js.widget.ListControl this object.
	 * @assert <code>value</code> parameter is not undefined or null.
	 * @assert value object <code>id</code> is present.
	 */
	remove : function(value) {
		$assert(value, "js.widget.ListControl#remove", "Value parameter is undefined or null.");
		$assert(value.id, "js.widget.ListControl#remove", "Value ID is missing.");

		// remove value reference from selected values cache, if exists
		var selectedIndex = this._getValueIndex(this._selectedValues, value.id);
		if (selectedIndex !== -1) {
			this._selectedValues.splice(selectedIndex, 1);
		}

		var index = this._getValueIndex(this._values, value.id);
		if (index !== -1) {
			this._values.splice(index, 1);
			this._listElement.getChildren().item(index).remove();
		}
		return this;
	},

	/**
	 * Remove all selected values. If no value is selected this method does nothing.
	 * 
	 * @return js.widget.ListControl this object.
	 */
	removeSelected : function() {
		this._selectedValues.forEach(function(value) {
			var index = this._getValueIndex(this._values, value.id);
			this._values.splice(index, 1);
			this._listElement.getByIndex(index).remove();
		}, this);
		this._selectedValues.length = 0;
		return this;
	},

	/**
	 * Select value object. Locate item element that is displaying the value object and set <code>selected</code> CSS
	 * class accordingly <code>selected</code> flag. Also update selected values cache, {@link #_selectedValues}.
	 * Argument <code>selected</code> is optional with default value to true.
	 * <p>
	 * This method uses actually only <code>id</code> property from given <code>value</code> object. If this control
	 * list does not contain a value object with specified <code>id</code> this method does nothing.
	 * 
	 * @param js.widget.ListControl.Value value value object to select,
	 * @param Boolean... selected optional selected flag, default to true.
	 * @return js.widget.ListControl this object.
	 * @assert <code>value</code> parameter is not undefined or null.
	 * @assert value object <code>id</code> is present.
	 */
	select : function(value, selected) {
		$assert(value, "js.widget.ListControl#select", "Value parameter is undefined or null.");
		$assert(value.id, "js.widget.ListControl#select", "Value ID is missing.");

		if (typeof selected === "undefined") {
			selected = true;
		}

		var index;
		if (selected) {
			// on selected add value reference to selected values cache
			index = this._getValueIndex(this._values, value.id);
			if (index !== -1) {
				this._selectedValues.push(this._values[index]);
			}
		}
		else {
			// on deselected remove value reference from selected values cache
			index = this._getValueIndex(this._selectedValues, value.id);
			if (index !== -1) {
				this._selectedValues.splice(index, 1);
				// prepare index for item element getter
				index = this._getValueIndex(this._values, value.id);
			}
		}

		// if value was processed update item element CSS class and fire event
		if (index !== -1) {
			var item = this._listElement.getByIndex(index);
			item.addCssClass("selected", selected);
			this._fireEvent("item-select", item);
		}
		return this;
	},

	/**
	 * Deselect value object. Locate item element that is displaying the value object and remove <code>selected</code>
	 * CSS class mark. Also remove value reference from selected values cache, {@link #_selectedValues}.
	 * <p>
	 * This method uses actually only <code>id</code> property from given <code>value</code> object. If selected
	 * values cache does not contain a value object with specified <code>id</code> this method does nothing.
	 * 
	 * @param js.widget.ListControl.Value value value object to select.
	 * @return js.widget.ListControl this object.
	 * @assert <code>value</code> parameter is not undefined or null.
	 * @assert value object <code>id</code> is present.
	 */
	deselect : function(value) {
		return this.select(value, false);
	},

	/**
	 * Deselect all this control list values. Traverses all list control values and remove selected mark. Also empty
	 * selected values cache.
	 * 
	 * @return js.widget.ListControl this object.
	 * @see #_selectedValues
	 */
	deselectAll : function() {
		this._selectedValues.length = 0;
		this._listElement.getChildren().forEach(function(child) {
			child.removeCssClass("selected");
		}, this);
		return this;
	},

	/**
	 * Test if there is at least one value object selected.
	 * 
	 * @return Boolean true if there is at least one value object selected.
	 */
	hasSelection : function() {
		return this._selectedValues.length !== 0;
	},

	/**
	 * Get selected value or null. Returns selected value object or null if no selection made.
	 * <p>
	 * Note that this getter returns value object not the item element element displaying it.
	 * 
	 * @return js.widget.ListControl.Value selected object value or null.
	 */
	getValue : function() {
		return this._selectedValues.length > 0 ? this._selectedValues[0] : null;
	},

	/**
	 * Get selected values array, possible empty. Returns an array of {@link js.widget.ListControl.Value} value objects.
	 * Similar to {@link #getValue()} counterpart this getter returns value objects not item elements.
	 * 
	 * @return Array selected values.
	 */
	getValues : function() {
		return this._selectedValues;
	},

	/**
	 * Get selected value objects id. Returns an array of numeric values filled with <code>id</code> property of all
	 * selected value objects.
	 * 
	 * @return Array selected value objects id.
	 */
	getSelectedIds : function() {
		return this._selectedValues.map(function(value) {
			return value.id;
		});
	},

	/**
	 * Get value object displayed by list control item.
	 * 
	 * @param js.dom.Element item list control item.
	 * @return js.widget.ListControl.Value item value object.
	 */
	getItemValue : function(item) {
		// TODO ensure all items have user data properly initialized or replace the logic for value data storage
		return item.getUserData();
	},

	/**
	 * Clear list content and reset internal state.
	 * 
	 * @return js.widget.ListControl this object.
	 */
	reset : function() {
		this._values.length = 0;
		this._selectedValues.length = 0;

		// do not use removeChildren() because, if called before setObject, will remove item template
		// when list setObject is called for the first time, item template is stored on list user defined data
		// on a list, item template is first child that is cloned to populate the list

		this._listElement.setObject(this._values);
		return this;
	},

	/**
	 * Get the index of value object identified by given <code>id</code>. Returned index value is offset into this
	 * list control values array. Returns -1 if there is no object value with requested <code>id</code>.
	 * 
	 * @param Array values array of {@link js.widget.ListControl.Value} object,
	 * @param Number id value object id.
	 * @return Number value object index or -1 if not found.
	 * @see #_values
	 */
	_getValueIndex : function(values, id) {
		return values.findIndex(function(value) {
			return value.id === id;
		});
	},

	/**
	 * Default mouse click handler. This handler just detect click event on item element and fires
	 * <code>item-click</code> event. If custom layout include anchor elements this click handler applies default
	 * browser behavior.
	 * <p>
	 * If custom click handler is registered, see {@link setClickHandler(Function, Object)}, it is first executed. If
	 * custom click handler returns boolean true continue with this handler execution.
	 * 
	 * @param js.event.Event ev mouse click event.
	 */
	_onClick : function(ev) {
		if (this._clickHandler) {
			if (this._clickHandler(ev) !== true) {
				return;
			}
		}

		// execute default click handler logic only if custom click handler returns boolean true

		var anchor = ev.target.getParentByTag("a");
		if (anchor !== null && anchor.getHref()) {
			return;
		}

		ev.halt();
		var item = ev.target.getParentByCssClass("item");
		if (item !== null) {
			switch (this._autoSelect) {
			case js.widget.ListControl.Select.CLICK:
				this._toggleSelect(item);
				break;

			case js.widget.ListControl.Select.CTRL_CLICK:
				if (ev.ctrlKey) {
					this._toggleSelect(item);
				}
				break;

			default:
				this._fireEvent("item-click", item);
			}
		}
	},

	/**
	 * Mouse double click handler. Fires <code>item-dblclick</code> event if double click mouse event was triggered by
	 * and item element or one of its descendants.
	 * 
	 * @param js.event.Event ev mouse double click event.
	 */
	_onDoubleClick : function(ev) {
		var item = ev.target.getParentByCssClass("item");
		if (item !== null) {
			if (this._autoSelect === js.widget.ListControl.Select.DBLCLICK) {
				this._toggleSelect(item);
			}
			else {
				this._fireEvent("item-dblclick", item);
			}
		}
	},

	/**
	 * Toggle item selection state.
	 * 
	 * @param js.dom.Element item item to change selection state.
	 */
	_toggleSelect : function(item) {
		var itemValue = item.getUserData();
		var selected = this._selectedValues.findIndex(function(value) {
			return value.id === itemValue.id;
		}) !== -1;
		this.select(itemValue, !selected);
	},

	/**
	 * Fire custom event on item element. All list control custom events have a single argument, see
	 * {@link js.widget.ListControl.Event}. This utility method creates event data instance and delegates
	 * {@link js.event.CustomEvents#fire(String, Object...)}.
	 * 
	 * @param String event custom event name,
	 * @param js.dom.Element item item element triggering the event.
	 */
	_fireEvent : function(event, item) {
		this._events.fire(event, new js.widget.ListControl.Event(item));
	},

	/**
	 * Class string representation.
	 * 
	 * @return String class qualified name.
	 */
	toString : function() {
		return "js.widget.ListControl"
	}
};
$extends(js.widget.ListControl, js.dom.Element);

/**
 * Event data sent by all list control events.
 * 
 * @author Iulian Rotaru
 * @constructor Construct event data instance.
 * @type js.dom.Element target event target element.
 */
js.widget.ListControl.Event = function(target) {
	/**
	 * Item element triggering the event.
	 * 
	 * @type js.dom.Element
	 */
	this.target = target;

	/**
	 * Value object displayed by item element.
	 * 
	 * @type js.widget.ListControl.Value
	 */
	this.value = target.getUserData();

	/**
	 * Value selected state.
	 * 
	 * @type Boolean
	 */
	this.selected = target.hasCssClass("selected");
};
$extends(js.widget.ListControl.Event, Object);

/**
 * Value object displayed by list control item.
 * 
 * @author Iulian Rotaru
 * @constructor Construct empty value object.
 */
js.widget.ListControl.Value = function() {
	/**
	 * Unique ID, usually database ID. This value is used to locate value into list control values storage and is
	 * mandatory.
	 * 
	 * @type Number
	 */
	this.id = 0;

	/**
	 * Value object name.
	 * 
	 * @type String
	 */
	this.name = null;

	/**
	 * Value object picture.
	 * 
	 * @type String
	 */
	this.picture = null;

	/**
	 * Value object description used as tooltip.
	 * 
	 * @type String
	 */
	this.description = null;
};
$extends(js.widget.ListControl.Value, Object);

/**
 * Item auto-select strategy.
 * 
 * @author Iulian Rotaru
 */
js.widget.ListControl.Select = {
	/**
	 * No auto-select.
	 * 
	 * @type Number
	 */
	NONE : 0,

	/**
	 * Select list item on single click.
	 * 
	 * @type Number
	 */
	CLICK : 1,

	/**
	 * Select list item on single click while keeping control key pressed.
	 * 
	 * @type Number
	 */
	CTRL_CLICK : 2,

	/**
	 * Select list item on double click.
	 * 
	 * @type Number
	 */
	DBLCLICK : 3
};
