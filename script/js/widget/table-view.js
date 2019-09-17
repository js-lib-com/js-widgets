$package("js.widget");

/**
 * Table view for ordered collection of objects of the same kind. Every value object from collection, aka item, is
 * mapped to a table row whereas item properties are mapped to table columns. It is user code responsibility to describe
 * column labels and item properties mapping, see sample code below.
 * <h5>Layout Description</h5>
 * <p>
 * Table view component define 3 editable points where user should inject its code: <code>heading</code>,
 * <code>content</code> and <code>paging</code>; last is optional. Also table view component supports configuration
 * properties, see <a href="#properties">properties</a>.
 * 
 * <pre>
 *   &lt;table data-class="js.widget.TableView" data-cfg="order-by:true;page-size:20;"&gt;
 *      &lt;tr&gt;
 *          &lt;th&gt;ID&lt;/th&gt;
 *          &lt;th&gt;Name&lt;/th&gt;
 *          &lt;th&gt;Birth Date&lt;/th&gt;
 *      &lt;/tr&gt;
 *      &lt;tr&gt;
 *          &lt;td data-text="id"&gt;&lt;/td&gt;
 *          &lt;td data-text="name"&gt;&lt;/td&gt;
 *          &lt;td data-text="birthDate" data-format="js.format.ShortDate"&gt;&lt;/td&gt;
 *      &lt;/tr&gt;
 *      &lt;tr&gt;
 *          &lt;td w:widget="lib/table-paging"&gt;&lt;/td&gt;
 *      &lt;/tr&gt;
 *   &lt;/table&gt;
 * </pre>
 * 
 * Table view <code>heading</code> is used to define column labels. Label can be plain text or string ID. Internally,
 * for <code>content</code>, table view uses {@link js.widget.TableView}; only a row is described, the others are
 * created at runtime using defined row as template - see {@link js.dom.template.Template} engine. Note that value
 * formatter is supported.
 * <p>
 * Paging is supported, but optional, and by default is not enabled. User code should define <code>paging</code>
 * injection point from table view component - see sample layout. As result from example, one should only declare a
 * paging component; usually {@link js.widget.TablePaging} component is used but there is no restriction on that. Custom
 * paging is allowed, provided it extends {@link js.widget.Paging} class.
 * 
 * <h5><a name="properties">Configuration Properties</a></h5>
 * Configuration properties are defined using <code>data-cfg</code> custom data attribute, see sample code from layout
 * description. Property name are dashed CSS like but camel case is also supported. Almost all properties have related
 * setter, if user code prefer imperative instead declarative coding style. Current implementation recognizes next
 * properties:<table>
 * <tr>
 * <td><b>Name
 * <td><b>Sample Value
 * <td><b>Default value
 * <td><b>Description
 * <td><b>Setter
 * <tr>
 * <td>loader
 * <td>js.app.Controller#getPersons
 * <td>null
 * <td>data source loader is a qualified method name, both class and method name separated by pound (#)
 * <td>{@link #setLoader(Object, String, Object...)}
 * <tr>
 * <td>page-size
 * <td>20
 * <td>0
 * <td>the number of items loaded and displayed at once, that is, in a single table view page
 * <td>{@link #setPageSize(Number)}
 * <tr>
 * <td>multi-select
 * <td>true
 * <td>false
 * <td>if true, allows multiple table rows/items selection
 * <td>{@link #enableMultiSelect}
 * <tr>
 * <td>order-by
 * <td>true
 * <td>false
 * <td>enable table view sort by clicking on column heading
 * <td>{@link #enableOrderBy}
 * <tr>
 * <td>preload
 * <td>true
 * <td>false
 * <td>automatically call {@link #load} after application page initialization
 * <td>N/A </table>
 * 
 * <h5>Data Source</h5>
 * Usually this table view loads items from remote data sources, most common being relational databases, but local data
 * sources are also supported. Interaction with data source is delegated to a configurable loader method with below
 * signature:
 * <p>
 * 
 * <pre>
 *  Response loader(Request request, Object... args);
 * </pre>
 * 
 * For data source request and response see {@link js.widget.TableView.Request}, respective
 * {@link js.widget.TableView.Response} classes. Optional arguments are application specific and supplied by
 * {@link #setLoader(Object,String,Object...)}.
 * <p>
 * There is also a low level method to set table view items, see {@link #setObject(Array)}. It is usable on very simple
 * tables without page size, paging, filter or order by; in such a case, application code is responsible for loading
 * items from data source.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct table view instance.
 * @param Document ownerDoc owner document,
 * @param Node node native node.
 */
js.widget.TableView = function(ownerDoc, node) {
	this.$super(ownerDoc, node);
	this.addCssClass(this._CSS_CLASS);

	/**
	 * On an disabled table view check boxes events are not processed.
	 * 
	 * @type Boolean
	 */
	this._disabled = false;

	/**
	 * The loader method used in conjunction with {@link #_loaderClass}. Loader method is actually invoked to load this
	 * table view items. Returned items from {@link js.widget.TableView.Response} are passed as they are to this table
	 * body, that uses {@link js.widget.TableView#setObject} internally. It is application code responsibility to ensure
	 * items returned from data source have meaning to this table columns.
	 * <p>
	 * Loader method should accept at least a {@link js.widget.TableView.Request} parameter; optional application
	 * specific parameters are allowed but request parameter should be the first. This method returns a
	 * {@link js.widget.TableView.Response} object.
	 * 
	 * @type Function
	 */
	this._loader = null;

	/**
	 * Optional application specific arguments for loader method, or null. If present these arguments are passed to
	 * loader method after {@link js.widget.TableView.Request} parameter.
	 * 
	 * @type Array
	 */
	this._arguments = null;

	/**
	 * Currently selected check box or null if no selection.
	 * 
	 * @type js.dom.Checkbox
	 */
	this._activeCheckbox = null;

	/**
	 * Page size is the amount of items loaded and displayed at once. This value is initialized by
	 * {@link #setPageSize(Number)}.
	 * 
	 * @type Number
	 */
	this._pageSize = 0;

	/**
	 * Table body.
	 * 
	 * @type js.dom.Element
	 */
	this._tbody = null;

	/**
	 * Optional table view paging. By default table view is not configured with paging. To enable it one should insert
	 * paging layout into table footer; recommended paging implementation is {@link js.widget.TablePaging} but custom
	 * paging is allowed.
	 * <p>
	 * Here is a paging layout sample using <code>table-paging</code> component.
	 * 
	 * <pre>
	 *  &lt;tfoot&gt;
	 *      &lt;tr data-inject="paging"&gt;
	 *          &lt;td data-ref="lib/table-paging" data-cfg="auto-hide:false;"&gt;&lt;/td&gt;
	 *      &lt;/tr&gt;
	 *  &lt;/tfoot&gt;
	 * </pre>
	 * 
	 * @type js.widget.Paging
	 */
	this._paging = null;

	if (this._config.loader) {
		var parts = this._config.loader.split('#');
		this._loaderClass = js.lang.OPP.get(window, parts[0]);
		$assert(typeof this._loaderClass !== "undefined", "js.widget.TableView#TableView", "Undefined loader class %s.", parts[0]);

		this._loader = this._loaderClass[parts[1]];
		$assert(js.lang.Types.isFunction(this._loader), "js.widget.TableView#TableView", "Invalid loader method %s.", parts[1]);
	}

	// user defined table layout may not explicitly declare <thead>, <tbody> and <tfoot> elements
	// HTML5 specs requires browser to inject <tbody> if first child is <tr>
	var firstChild = this.getFirstChild(), thead;
	if (firstChild.getTag() === "tbody") {
		// here <table> has a single <tbody> element that on its turn has 2 or 3 <tr> elements, as follows:
		// 1. mandatory row for table head - create <thead> element and move <tr> there
		// 2. mandatory row for table body - leave <tr> element where it is
		// 3. optional row for table foot used for paging - create <tfoot> element and move <tr> there

		this._tbody = firstChild;
		var rowsCount = js.dom.Node.childElementCount(this._tbody.getNode());
		$assert(rowsCount <= 3, "js.widget.TableView#TableView", "Invalid table component layout. Too many rows: %d.", rowsCount);

		thead = this._ownerDoc.createElement("thead");
		this.addChildFirst(thead);
		thead.addChild(this._tbody.getFirstChild());

		if (rowsCount == 3) {
			var tfoot = this._ownerDoc.createElement("tfoot");
			this.addChildFirst(tfoot);
			tfoot.addChild(this._tbody.getLastChild());
		}
	}
	else {
		this._tbody = this.getByTag("tbody");
		$assert(this._tbody !== null, "js.widget.TableView#TableView", "Invalid component usage. Missing table body.");
	}
	this._tbody.setAttr("data-list", ".");

	var theadCells = thead.getFirstChild().getChildren();
	var tbodyCells = this._tbody.getFirstChild().getChildren();
	$assert(theadCells.size() === tbodyCells.size(), "js.widget.TableView#TableView", "Invalid component usage. Table head and body have different number of cells.");
	var td, text;
	for (i = 0; i < theadCells.size(); i++) {
		td = theadCells.item(i);
		td.addCssClass(this._CSS_ORDER_BY);
		td.setUserData(this._FIELD_NAME_KEY, tbodyCells.item(i).getAttr("data-text"));

		text = td.getText();
		td.removeChildren();
		td.addChild(ownerDoc.createElement("span").setText(text));
	}

	/**
	 * Table header element currently used for table view sort.
	 * 
	 * @type js.dom.Element
	 */
	this._currentColumnHeader = theadCells.item(0);
	if (this._config.orderBy) {
		/**
		 * Order by icon displayed on current column header. It position can be adjusted depending on {@link #_CSS_DESC},
		 * see sample CSS code:
		 * 
		 * <pre>
		 *  .js-widget-tableview thead td.desc img {
		 *      transform: rotate(180deg);
		 *  }
		 * </pre>
		 * 
		 * @type js.dom.Image
		 */
		this._orderByIcon = this._ownerDoc.createElement("img", "src", this._ORDER_BY_ICON);
		this._currentColumnHeader.addChild(this._orderByIcon);
	}

	var theadTR = thead.getByTag("tr");
	$assert(theadTR !== null, "js.widget.TableView#TableView", "Invalid component usage. Missing row from table head.");
	var masterCheckboxTD = ownerDoc.createElement("th");
	theadTR.addChildFirst(masterCheckboxTD);

	/**
	 * Master check box is on table header and use to (de)select all rows.
	 * 
	 * @type js.dom.Checkbox
	 */
	this._masterCheckbox = null;
	if (this._config.multiSelect) {
		this._masterCheckbox = ownerDoc.createElement("input", "type", "checkbox").addCssClass(this._CSS_ITEM_SELECTOR).addCssClass("master");
		masterCheckboxTD.addChild(this._masterCheckbox);
	}

	var tbodyTR = this._tbody.getByTag("tr");
	$assert(tbodyTR !== null, "js.widget.TableView#TableView", "Invalid component usage. Missing row from table body.");

	tbodyTR.setAttr("data-id", "id");
	var checkbox = ownerDoc.createElement("input", "type", "checkbox").addCssClass(this._CSS_ITEM_SELECTOR);
	tbodyTR.addChildFirst(ownerDoc.createElement("td").addChild(checkbox));

	// register mouse click event on entire table and uses event delegation on click handler
	this.on("click", this._onClick, this);

	/**
	 * Currently selected values array, possible empty.
	 * 
	 * @type Array
	 */
	this._selectedValues = [];

	/**
	 * Table view events. Current implementation supports next events:<table>
	 * <tr>
	 * <td><b>Event Name
	 * <td><b>Parameter
	 * <td><b>Description
	 * <tr>
	 * <td><code>selection-update
	 * <td>array of selected items, possible empty
	 * <td>fired whenever table view selection is changed - including when cleared, for both row and master check box 
	 * <tr>
	 * <td><code>items-loaded
	 * <td>array of loaded items
	 * <td>fired just after table view update - see {@link #setObject(Array)}</table>
	 * <tr>
	 * <td><code>item-click
	 * <td>click on a table row but not on item selector
	 * <td>fired after click on row has detected with object value</table>
	 * 
	 * @type js.event.CustomEvents
	 */
	this._events = this.getCustomEvents();
	this._events.register("selection-update", "items-loaded", "item-select", "item-deselect", "item-click");

	/**
	 * Current table view loading filter, or null. It is initialized at first page load then paging mechanism reuse it.
	 * 
	 * @type Object
	 */
	this._filter = null;

	/**
	 * Optional table view paging. By default table view is not configured with paging. To enable it one should insert
	 * paging layout into table footer; recommended paging implementation is {@link js.widget.TablePaging} but custom
	 * paging is allowed.
	 * <p>
	 * Here is a paging layout sample using <code>table-paging</code> component.
	 * 
	 * <pre>
	 *  &lt;tr data-inject="paging"&gt;
	 *      &lt;td data-widget="lib/table-paging" data-cfg="auto-hide:false;"&gt;&lt;/td&gt;
	 *  &lt;/tr&gt;
	 * </pre>
	 * 
	 * @type js.widget.Paging
	 */
	this._paging = this.getByCss("tfoot td");
	if (this._paging == null) {
		this._paging = js.widget.TableView.NoPaging;
	}
	this._paging.setAttr("colspan", tbodyTR.getChildren().size().toString());
	this._paging.on("change", this._load, this);
	this._paging.setItemsCount(0);

	if (this._config.pageSize) {
		this.setPageSize(this._config.pageSize);
	}
	if (this._config.preload) {
		this.load();
	}
};

js.widget.TableView.prototype = {
	/**
	 * CSS class for table view used for style rules selector.
	 * 
	 * @type String
	 */
	_CSS_CLASS : "js-widget-tableview",

	/**
	 * User data key for the name of item property attached to column. Column property name is used by
	 * {@link js.widget.TableView.OrderBy}.
	 * 
	 * @type String
	 */
	_FIELD_NAME_KEY : "column-field",

	/**
	 * CSS mark class for check box used to select table row, both individual row and master selector - see
	 * {@link #_CSS_MASTER_SELECTOR}.
	 * 
	 * @type String
	 */
	_CSS_ITEM_SELECTOR : "item-selector",

	/**
	 * CSS mark class for master selector, that is, the check box from table header.
	 * 
	 * @type String
	 */
	_CSS_MASTER_SELECTOR : "master",

	/**
	 * Resource name for image used to visualize the column used for table sort.
	 * 
	 * @type String
	 */
	_ORDER_BY_ICON : "@image/order-by-icon",

	/**
	 * CSS mark class for column used to sort the table.
	 * 
	 * @type String
	 */
	_CSS_ORDER_BY : "order-by",

	/**
	 * CSS mark class for column sorted descendant.
	 * 
	 * @type String
	 */
	_CSS_DESC : "desc",

	/**
	 * CSS mark class for selected table row. Application code may use this CSS class to create visual hints for
	 * selected rows.
	 * 
	 * @type String
	 */
	_CSS_SELECTED : "selected",

	data : function() {
		var data = [];
		this._tbody.getChildren().forEach(function(tr) {
			data.push(tr.getUserData());
		}, this);
		return data;
	},

	enable : function() {
		this._disabled = false;
	},

	disable : function() {
		this._disabled = true;
	},

	/**
	 * Set parameters for data source loader. Items from data source are loaded calling a loader method; this setter
	 * initialize loader class, method and optional arguments. Anyway, loader method first parameter is always a request
	 * object, see {@link js.widget.TableView.Request}; optional arguments set by this method follows after request.
	 * 
	 * @param Object classReference loader class instance or stub for remote class,
	 * @param String methodName loader method name,
	 * @param Object... args optional arguments required by laoder method.
	 * @return js.widget.TableView this object.
	 * @assert class reference and method name parameters are of proper type and method is an existing function.
	 */
	setLoader : function(classReference, methodName) {
		$assert(js.lang.Types.isObject(classReference), "js.widget.TableView#setLoader", "Class reference argument is not an object.");
		$assert(js.lang.Types.isString(methodName), "js.widget.TableView#setLoader", "Method name argument is not a string.");

		this._loaderClass = classReference;
		this._loader = classReference[methodName];
		$assert(js.lang.Types.isFunction(this._loader), "js.widget.TableView#setLoader", "Loader method |%s#%s| is not a function.", classReference, methodName);

		if (arguments.length > 2) {
			this._arguments = $args(arguments, 2);
		}
		return this;
	},

	/**
	 * Set the page size, that is, amount of items loaded at once. This value is used by
	 * {@link js.widget.TableView.Request} when load items from data source. It is active no matter table view has
	 * paging or not.
	 * <p>
	 * This method can be explicitly invoked by user code or automatic if table view is configured with
	 * <code>page-size</code> parameter. See class description for configuration parameters.
	 * 
	 * @param Number pageSize page size.
	 * @return js.widget.TableView this object.
	 * @assert given argument is a strict positive number.
	 */
	setPageSize : function(pageSize) {
		$assert(js.lang.Types.isNumber(pageSize) && pageSize > 0, "js.widget.TableView.setPageSize", "Page size is not a positive number.");

		this._pageSize = pageSize;
		this._paging.setPageSize(pageSize);
		return this;
	},

	/**
	 * Enable multiple row selection. By default multiple selection is not active.
	 * 
	 * @return js.widget.TableView this object.
	 */
	enableMultiSelect : function() {
		this._config.multiSelect = true;
		return this;
	},

	/**
	 * Enable table view sorting when click on column header. By default order by is not active.
	 * 
	 * @return js.widget.TableView this object.
	 */
	enableOrderBy : function() {
		this._config.orderBy = true;
		return this;
	},

	/**
	 * Load table view items from data source using configured loader method. Given <code>filter</code> parameter is
	 * stored into {@link #_filter} property for further use by paging mechanism. If <code>filter</code> parameter is
	 * not supplied filtering mechanism is disabled, including for paging.
	 * <p>
	 * If table view is configured with paging this method perform the initial loading, i.e. loading of page 0.
	 * 
	 * @param Object... filter optional filter.
	 * @return js.widget.TableView this object.
	 */
	load : function(filter) {
		this._filter = typeof filter !== "undefined" ? filter : null;
		this._paging.reset();
		this._load(0);
		return this;
	},

	/**
	 * Low level table view items setter. This method set preloaded items directly into this table view body; all given
	 * items are loaded and there is no attempt to limit large items array.
	 * <p>
	 * This method is designed to be called by paging mechanism but is public so that application code can use it, in
	 * particular cases. When called from application code this method does not consider table view page size, filter or
	 * order by, if any.
	 * <p>
	 * Fires <code>items-loaded</code> event after items completely displayed.
	 * 
	 * @param Array items items to display.
	 * @return js.widget.TableView this object.
	 * @assert given <code>items</code> parameter is an array.
	 */
	setObject : function(items) {
		$assert(js.lang.Types.isArray(items), "js.widget.TableView#setObject", "Items parameter is not an array.");

		this._activeCheckbox = null;
		this._selectedValues.length = 0;
		this._setMasterCheck(false);
		this._tbody.setObject(items);

		this._tbody.getChildren().forEach(function(tr) {
			var checkbox = tr.getByCss("input[type='checkbox']");
			checkbox.enable(tr.getUserData().enabled);
		}, this);

		this._events.fire("items-loaded", items);
		return this;
	},

	add : function(value) {
		$assert(value, "js.widget.TableView#add", "Value parameter is undefined or null.");
		$assert(value.id, "js.widget.TableView#add", "Value ID is missing.");

		// private access to templates engine implementation
		var itemTemplate = this._tbody.getUserData("item-template");

		var itemElement = itemTemplate.clone(true);
		itemElement.setUserData("value", value);
		itemElement.setObject(value);
		this._tbody.addChild(itemElement);

		return this;
	},

	addAll : function(values) {
		values.forEach(function(value) {
			this._add(value);
		}, this);
	},

	remove : function(value) {
		$assert(value, "js.widget.TableView#remove", "Value parameter is undefined or null.");
		$assert(value.id, "js.widget.TableView#remove", "Value ID is missing.");

		var tr = this._ownerDoc.getById(value.id);
		if (tr) {
			tr.remove();
		}
	},

	removeAll : function(items) {
		items.forEach(function(item) {
			this._remove(item);
		}, this);
	},

	/**
	 * Clear table view content and hide paging, if exist.
	 * 
	 * @return js.widget.TableView this object.
	 */
	clear : function() {
		this._tbody.setObject([]);
		this._paging.hide();
		return this;
	},

	update : function(value) {
		$assert(value, "js.widget.TableView#update", "Value parameter is undefined or null.");
		$assert(value.id, "js.widget.TableView#update", "Value ID is missing.");

		var children = this._tbody.getChildren();
		for (var i = 0, v, c; i < children.size(); ++i) {
			c = children.item(i);
			v = c.getUserData("value");
			if (v.id === value.id) {
				c.setUserData("value", value);
				c.setObject(value);
			}
		}
		return this;
	},

	/**
	 * Deselect all this table values. Uncheck all checkboxes and empty selected values cache.
	 * 
	 * @return js.widget.TableView this object.
	 * @see #_selectedValues
	 */
	deselectAll : function() {
		this.enable();
		this._selectedValues.length = 0;
		this._activeCheckbox = null;
		if (this._masterCheckbox !== null) {
			this._masterCheckbox.uncheck();
		}
		this._tbody.findByCss("input[type='checkbox']:checked").forEach(function(checkbox) {
			var tr = checkbox.getParentByTag("tr");
			tr.removeCssClass("selected");
			checkbox.uncheck();

			var value = tr.getUserData();
			if (value !== null) {
				this._events.fire("item-deselect", value);
			}
		}, this);
		this._events.fire("selection-update", this._selectedValues);
		return this;
	},

	/**
	 * Get selected value or null. Returns selected value object or null if no selection made.
	 * <p>
	 * Note that this getter returns value object not the item element element displaying it.
	 * 
	 * @return Object selected object value or null.
	 */
	getValue : function() {
		return this._selectedValues.length > 0 ? this._selectedValues[0] : null;
	},

	/**
	 * Get selected values array, possible empty. Returns an array of value objects. Similar to {@link #getValue()}
	 * counterpart this getter returns value objects not item elements.
	 * 
	 * @return Array selected values.
	 */
	getValues : function() {
		return this._selectedValues;
	},

	/**
	 * Test if this table has selected rows. Returns true if there is a selected row. In case of multi-select
	 * configuration returns true if there is at least one selected row.
	 * 
	 * @return Boolean true if this table has selected rows.
	 */
	hasSelected : function() {
		return this._selectedValues.length > 0;
	},

	/**
	 * Remove all selected values. If no value is selected this method does nothing.
	 * 
	 * @return js.widget.TableView this object.
	 */
	removeSelected : function() {
		this._tbody.getChildren().forEach(function(tr) {
			var checkbox = tr.getByCss("input[type='checkbox']");
			if (checkbox.checked()) {
				tr.remove();
			}
		}, this);

		this._activeCheckbox = null;
		this._selectedValues.length = 0;
		return this;
	},

	/**
	 * Table view handler for mouse click event. This handler implements event delegation pattern. Mouse click event is
	 * registered to entire table view and this handler choose the right element using the event target.
	 * 
	 * @param js.event.Event ev mouse click event.
	 */
	_onClick : function(ev) {
		if (this._disabled) {
			ev.halt();
			return;
		}
		var tr, td, checkbox, it, value, orderByIcon;

		if (ev.target.hasCssClass(this._CSS_ITEM_SELECTOR)) {
			// item selector check box is clicked
			checkbox = ev.target;

			if (checkbox.hasCssClass(this._CSS_MASTER_SELECTOR)) {
				this._selectedValues.length = 0;
				it = this.findByCss(".%s:not(.%s)", this._CSS_ITEM_SELECTOR, this._CSS_MASTER_SELECTOR).it();

				if (checkbox.checked()) {
					// master checkbox become checked; select not already selected rows
					while (it.hasNext()) {
						var checkbox = it.next();
						if (checkbox.checked()) {
							// ignore row if already selected
							continue;
						}
						checkbox.check();
						tr = checkbox.getParentByTag("tr");
						tr.addCssClass(this._CSS_SELECTED);
						value = tr.getUserData();
						this._selectedValues.push(value);
						this._events.fire("item-select", value);
					}
				}
				else {
					// master checkbox become unchecked; deselect all selected rows
					while (it.hasNext()) {
						var checkbox = it.next();
						if (!checkbox.checked()) {
							// ignore row if not selected
							continue;
						}
						checkbox.uncheck();
						tr = checkbox.getParentByTag("tr");
						tr.removeCssClass(this._CSS_SELECTED);
						this._events.fire("item-deselect", tr.getUserData());
					}
				}

				this._events.fire("selection-update", this._selectedValues);
				return;
			}

			value = checkbox.getParentByTag("tr").getUserData();
			if (checkbox.checked()) {
				if (this._config.multiSelect) {
					this._selectedValues.push(value);
					if (this._selectedValues.length === this._tbody.getChildrenCount()) {
						this._setMasterCheck(true);
					}
				}
				else {
					this._selectedValues.length = 0;
					this._selectedValues.push(value);
					if (this._activeCheckbox !== null) {
						this._activeCheckbox.uncheck();
						this._activeCheckbox.getParentByTag("tr").removeCssClass(this._CSS_SELECTED);
						this._activeCheckbox = null;
					}
					this._activeCheckbox = checkbox;
				}
				checkbox.getParentByTag("tr").addCssClass(this._CSS_SELECTED);
				this._events.fire("item-select", value);
			}
			else {
				this._selectedValues.length = 0;
				this._activeCheckbox = null;
				this._setMasterCheck(false);
				checkbox.getParentByTag("tr").removeCssClass(this._CSS_SELECTED);
				this._events.fire("item-deselect", value);
			}
			this._events.fire("selection-update", this._selectedValues);
			return;
		}

		if (this._config.orderBy) {
			td = ev.target.getParentByCssClass(this._CSS_ORDER_BY);
			if (td !== null) {
				if (td === this._currentColumnHeader) {
					this._currentColumnHeader.toggleCssClass(this._CSS_DESC);
				}
				else {
					this._currentColumnHeader = td;
					this._currentColumnHeader.addChild(this._orderByIcon);
				}
				this._load(this._paging.getPageIndex());
			}
			return;
		}

		var td = ev.target;
		if (td.hasChildren()) {
			return;
		}
		var tr = ev.target.getParentByTag("tr");
		var value = tr.getUserData();
		if (value) {
			this._events.fire("item-click", value);
		}
	},

	/**
	 * Set master check box checked state.
	 * 
	 * @param Boolean checked master checked state.
	 */
	_setMasterCheck : function(checked) {
		if (this._masterCheckbox !== null) {
			this._masterCheckbox[checked ? "check" : "uncheck"]();
		}
	},

	/**
	 * Load items from data source. Create {@link js.widget.TableView.Request} object with given <code>pageIndex</code>,
	 * add order by and filter, if table view is configured with, then invoke loader method. If present, insert
	 * {@link #_arguments} after request parameter. For order by field name and direction initialization uses
	 * {@link #_currentColumnHeader}.
	 * 
	 * @param Number pageIndex page index to load.
	 * @assert loader class and method are properly initialized, see {@link #setLoader(Object, String, Object...)}.
	 */
	_load : function(pageIndex) {
		$assert(this._loaderClass !== null, "js.widget.TableView#_load", "Null loader class. Please use #setLoader to properly initialize table view instance.");
		$assert(this._loader !== null, "js.widget.TableView#_load", "Null loader method. Please use #setLoader to properly initialize table view instance.");

		var request = {
			pageSize : this._pageSize,
			pageIndex : pageIndex,
		};

		if (this._config.orderBy) {
			request.orderBy = {
				fieldName : this._currentColumnHeader.getUserData(this._FIELD_NAME_KEY),
				direction : this._currentColumnHeader.hasCssClass(this._CSS_DESC) ? "DESC" : "ASC"
			}
		}
		else {
			request.orderBy = {};
		}

		if (this._filter !== null) {
			request.filter = this._filter;
		}
		else {
			request.filter = {};
		}

		var args = [ request ];
		if (this._arguments !== null) {
			for (var i = 0; i < this._arguments.length; i++) {
				args.push(this._arguments[i]);
			}
		}
		args.push(this._onPagingResponse);
		args.push(this);
		this._loader.apply(this._loaderClass, args);
	},

	/**
	 * Handler for data source response. Invoke {@link #setObject(Array)} with response items and update paging total
	 * items and paging count - see {@link js.widget.Paging#setItemsCount(Number)}.
	 * 
	 * @param js.widget.TableView.Response response data source response.
	 */
	_onPagingResponse : function(response) {
		this.setObject(response.items);
		this._paging.setItemsCount(response.total);
	},

	/**
	 * Returns a string representation of the object.
	 */
	toString : function() {
		return "js.widget.TableView";
	}
};
$extends(js.widget.TableView, js.dom.Element);
$preload(js.widget.TableView);

/**
 * No paging placeholder object. This object is used when table view is configured without paging. It supplies
 * no-operations methods to avoid multiple testing for null paging instance.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 */
js.widget.TableView.NoPaging = {
	setAttr : function() {
	},

	on : function() {
	},

	setPageSize : function() {
	},

	reset : function() {
	},

	hide : function() {
	},

	getPageIndex : function() {
		return 0;
	},

	setItemsCount : function() {
	}
};

/**
 * Data source request object used as parameter for data source loader method. Usually data source is remote, that is,
 * stored on server but local data source is allowed.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 */
js.widget.TableView.Request = {
	/**
	 * Page index, 0 being the first page.
	 * 
	 * @type Number
	 */
	pageIndex : 0,

	/**
	 * Page size is the number of items loaded and displayed at once.
	 * 
	 * @type Number
	 */
	pageSize : 0,

	/**
	 * Optional filter criteria used by data source to select only items fulfilling some given condition. Filter is a
	 * name/value hash defined by data source logic. The meaning of defined names and values are data source specific
	 * and are not limited to equality operator; for example, if name is <code>minimAge</code> data source may return
	 * only objects with <code>age</code> greater than given value.
	 * <p>
	 * For a relational data base filter is used to compose the WHERE clause.
	 * 
	 * @type Object
	 */
	filter : {},

	/**
	 * Optional sorting parameter, see {@link js.widget.TableView.OrderBy}.
	 * 
	 * @type js.widget.TableView.OrderBy.
	 */
	orderBy : {}
};

/**
 * Data source response returned by loader method.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 */
js.widget.TableView.Response = {
	/**
	 * Total items from data source. If data source request was including a filter - see
	 * {@link js.widget.TableView.Request#filter}, this property consider only items fulfilling the filter criteria.
	 * 
	 * @type Number
	 */
	total : 0,

	/**
	 * Loaded items.
	 * 
	 * @type Array
	 */
	items : null
};

/**
 * Parameter value used to sort the table view. This class is part of data source request - see
 * {@link js.widget.TableView.Request}.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 */
js.widget.TableView.OrderBy = {
	/**
	 * The name of item property used to sort the table view. Item property name is stored as user data to table header
	 * column, see {@link js.widget.TableView#_FIELD_NAME_KEY}.
	 * 
	 * @type String
	 */
	fieldName : null,

	/**
	 * Sorting direction with two possible values: <em>ASC</em> and <em>DESC</em>.
	 * 
	 * @type String
	 */
	direction : null
};