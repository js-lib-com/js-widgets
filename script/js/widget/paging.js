$package("js.widget");

/**
 * Paging control. A paging control offer means to break large amount of data into pages of fixed size, every page
 * possessing an index. This paging control is rather simple: it has a number of buttons with the page index as label
 * and another two for previous and next page. The number of page index buttons visible is limited by component layout
 * to 5.
 * <p>
 * This widget is designed to be used together with a list control. Paging control generates <code>change</code>
 * events with currently selected page index and external logic is used to load data page from server and update
 * attached list.
 * 
 * <pre>
 *  &lt;div class="list-view"&gt;
 *      &lt;div class="list" data-ref="lib/list-ctrl"&gt;&lt;/div&gt;
 *      &lt;ul class="paging" data-ref="lib/paging"&gt;&lt;/ul&gt;
 *  &lt;/div&gt;
 * </pre>
 * 
 * Into script, get paging control instance, set its page size and register change event listener. When paging changes a
 * request for a new page is made and on server response updates list control and paging items count.
 * 
 * <pre>
 *  this._list = WinMain.doc.getByCss(".list");
 *  this._paging = WinMain.doc.getByCss(".paging");
 *  this._paging.setPageSize(PAGE_SIZE).on("change", this._onPagingChange, this);
 *  . . .
 *  _onPagingChange : function (pageIndex) {
 *      var request = {
 *          pageIndex: pageIndex,
 *          pageSize: PAGE_SIZE
 *      };
 *      js.widget.Controller.loadListPage(request, this._onPagingResponse, this);
 *  },
 *  . . .
 *  _onPagingResponse : function (response) {
 *      this._list.setObject(response.items);
 *      this._paging.setItemsCount(response.total);
 *  }
 * </pre>
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct this paging control instance.
 * @param js.dom.Document ownerDoc owner document,
 * @param Node node built-in {@link Node} instance.
 */
js.widget.Paging = function (ownerDoc, node) {
    this.$super(ownerDoc, node);

    /**
     * Page size. This is the maximum number of items a page may have. If widget configuration does not specify a value
     * uses {@link #_DEF_PAGE_SIZE}.
     * 
     * @type Number
     */
    this._pageSize = this._config.pageSize || this._DEF_PAGE_SIZE;

    /**
     * Index of currently active page.
     * 
     * @type Number
     */
    this._pageIndex = 0;

    /**
     * Pages count.
     * 
     * @type Number
     */
    this._pagesCount = 0;

    /**
     * Total items count.
     * 
     * @type Number
     */
    this._itemsCount = 0;

    /**
     * Custom events. Current implementation supports only <code>change</code> event fired after user interface
     * updated, with current page index as argument.
     * 
     * @type js.event.CustomEvents
     */
    this._events = this.getCustomEvents();
    this._events.register(this._CHANGE_EVENT);

    // by default auto hide is active
    if (typeof this._config.autoHide === "undefined") {
        this._config.autoHide = true;
    }

    /**
     * Previous page button.
     * 
     * @type js.dom.Element
     */
    this._previousButton = this.getByCssClass(this._CSS_PREVIOUS_BUTTON);
    $assert(this._previousButton !== null, "js.widget.Paging#Paging", "Invalid paging layout. Missing previous page button.");
    this._previousButton.on("click", this._onPreviousButtonClick, this);

    /**
     * Next page button.
     * 
     * @type js.dom.Element
     */
    this._nextButton = this.getByCssClass(this._CSS_NEXT_BUTTON);
    $assert(this._nextButton !== null, "js.widget.Paging#Paging", "Invalid paging layout. Missing next page button.");
    this._nextButton.on("click", this._onNextButtonClick, this);

    /**
     * Index elements list. These are the elements used for page index interaction.
     * 
     * @type js.dom.EList
     */
    this._indexElements = this.findByCssClass(this._CSS_PAGE_INDEX);
    this._indexElements.on("click", this._onIndexElementClick, this);

    /**
     * Callback for animation frame request. This constant is in fact {@link #_render} method bound to this instance.
     * 
     * @type Function
     */
    this._FRAME_REQUEST_CALLBACK = this._render.bind(this);
};

js.widget.Paging.prototype = {
    /**
     * Default page size.
     * 
     * @type Number
     */
    _DEF_PAGE_SIZE : 8,

    /**
     * Page index element CSS mark class.
     * 
     * @type String
     */
    _CSS_PAGE_INDEX : "page-index",

    /**
     * Previous page button CSS mark class.
     * 
     * @type String
     */
    _CSS_PREVIOUS_BUTTON : "previous-page",

    /**
     * Next page button CSS mark class.
     * 
     * @type String
     */
    _CSS_NEXT_BUTTON : "next-page",

    /**
     * Disabled element CSS mark class.
     * 
     * @type String
     */
    _CSS_DISABLED : "disabled",

    /**
     * Active element CSS mark class.
     * 
     * @type String
     */
    _CSS_ACTIVE : "active",

    /**
     * Pagination change event name.
     * 
     * @type String
     */
    _CHANGE_EVENT : "change",

    /**
     * Set page size.
     * 
     * @param Number pageSize page size.
     * @return js.widget.Paging this object.
     * @assert page size argument is a strict positive number.
     */
    setPageSize : function (pageSize) {
        $assert(js.lang.Types.isNumber(pageSize) && pageSize > 0, "js.widget.Paging#setPageSize", "Page size is not a positive number.");
        this._pageSize = pageSize;
        return this;
    },

    /**
     * Set total items count.
     * 
     * @param Number itemsCount total items count.
     * @return js.widget.Paging this object.
     * @assert total items count argument is a number positive or zero.
     */
    setItemsCount : function (itemsCount) {
        $assert(js.lang.Types.isNumber(itemsCount) && itemsCount >= 0, "js.widget.Paging#setItemsCount", "Items count is not a positive number.");
        this._itemsCount = itemsCount;
        this._pagesCount = Math.ceil(itemsCount / this._pageSize);
        // if auto hide active display paging control only if there are more than a single page
        // otherwise display paging if there are some items, i.e. more than 0
        if (this._config.autoHide) {
            this.show(this._pagesCount > 1);
        }
        else {
            this.show(itemsCount > 0);
        }
        this._update();
        return this;
    },

    /**
     * Get current selected page index.
     * 
     * @return Number current selected page index.
     */
    getPageIndex : function () {
        return this._pageIndex;
    },

    /**
     * Reset this paging control.
     */
    reset : function () {
        this._pageIndex = 0;
        this._pagesCount = 0;
        this._itemsCount = 0;
    },

    /**
     * Update this paging control graphical elements. This method delegates {@link #_render()} via animation frame
     * request.
     */
    _update : function () {
        window.requestAnimationFrame(this._FRAME_REQUEST_CALLBACK);
    },

    /**
     * Perform the actual graphical elements update. Change paging buttons active state accordingly internal state
     * stored into {@link #_pageIndex}, {@link #_pagesCount} and {@link #_itemsCount}.
     */
    _render : function () {
        var indexElementsCount; // alias for index elements elist size
        var startPage; // page index displayed into first index element
        var visibleIndexElements; // if pages count is less than index elements count not all are visible
        var activeElement; // index element that contains current page index and is marked as active
        var indexValue; // page index value as displayed to user, 1 based
        var i;

        indexElementsCount = this._indexElements.size();
        startPage = 0;
        visibleIndexElements = this._pagesCount;
        if (this._pagesCount > indexElementsCount) {
            startPage = this._pageIndex - Math.floor(indexElementsCount / 2);
            if (startPage < 0) {
                startPage = 0;
            }
            if (startPage + indexElementsCount >= this._pagesCount) {
                startPage = this._pagesCount - indexElementsCount;
            }
            visibleIndexElements = indexElementsCount;
        }

        i = 0;
        // start page is a zero based index but index values is displayed to user and starts with 1
        for (indexValue = startPage + 1; i < visibleIndexElements; i++, indexValue++) {
            this._indexElements.item(i).setText(indexValue.toString()).show().removeCssClass(this._CSS_ACTIVE);
        }
        for (; i < this._indexElements.size(); i++) {
            this._indexElements.item(i).hide().removeCssClass(this._CSS_ACTIVE);
        }

        // mark index element that is active page and disable button if active page is on extreme
        activeElement = this._pageIndex - startPage;
        this._indexElements.item(activeElement).addCssClass(this._CSS_ACTIVE);
        this._enable(this._previousButton, activeElement > 0);
        this._enable(this._nextButton, activeElement < (visibleIndexElements - 1));
    },

    /**
     * Previous page button handler. If {@link #_pageIndex} is not zero decrease it and fire change event.
     * 
     * @param js.event.Event ev mouse click event.
     */
    _onPreviousButtonClick : function (ev) {
        if (this._pageIndex > 0) {
            this._pageIndex--;
            this._fireChangeEvent();
        }
    },

    /**
     * Previous page button handler. If {@link #_pageIndex} is less than pages count increase it and fire change event.
     * 
     * @param js.event.Event ev mouse click event.
     */
    _onNextButtonClick : function (ev) {
        if (this._pageIndex < (this._pagesCount - 1)) {
            this._pageIndex++;
            this._fireChangeEvent();
        }
    },

    /**
     * Previous page button handler. Fire change event with clicked element related page index.
     * 
     * @param js.event.Event ev mouse click event.
     */
    _onIndexElementClick : function (ev) {
        this._pageIndex = Number(ev.target.getText()) - 1;
        this._fireChangeEvent();
    },
    
    _fireChangeEvent : function () {
        this._events.fire(this._CHANGE_EVENT, this._pageIndex);
    },

    _enable : function (el, condition) {
        el[(condition ? "remove" : "add") + "CssClass"](this._CSS_DISABLED);
    },


    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.widget.Paging";
    }
};
$extends(js.widget.Paging, js.dom.Element);

$legacy(typeof window.requestAnimationFrame === "undefined", function () {
    js.widget.Paging.prototype._update = function () {
        this._render();
    }
});