$package("js.widget");

/**
 * Paging control with layout suitable for table view, but not limited to. Beside <em>next</em> / <em>previous</em>
 * page buttons this paging has buttons to move to <em>first</em> and <em>last</em> page. It also display
 * <em>start</em> and <em>end</em> item from current loaded page and data source <em>total</em> items.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct table paging instance.
 * @param Document ownerDoc owner document,
 * @param Node node native node.
 */
js.widget.TablePaging = function (ownerDoc, node) {
    this.$super(ownerDoc, node);

    /**
     * Text view for page start index.
     * 
     * @type js.dom.Element
     */
    this._startText = this.getByCssClass(this._CSS_START_TEXT);
    $assert(this._startText !== null, "js.widget.TablePaging#TablePaging", "Invalid paging layout. Missing text view for page start index.");

    /**
     * Text view for page end index.
     * 
     * @type js.dom.Element
     */
    this._endText = this.getByCssClass(this._CSS_END_TEXT);
    $assert(this._endText !== null, "js.widget.TablePaging#TablePaging", "Invalid paging layout. Missing text view for page end index.");

    /**
     * Text view for total items.
     * 
     * @type js.dom.Element
     */
    this._totalText = this.getByCssClass(this._CSS_TOTAL_TEXT);
    $assert(this._totalText !== null, "js.widget.TablePaging#TablePaging", "Invalid paging layout. Missing text view for total items.");

    this._firstButton = this.getByCssClass(this._CSS_FIRST_BUTTON);
    $assert(this._firstButton !== null, "js.widget.TablePaging#TablePaging", "Invalid paging layout. Missing first page button.");
    this._firstButton.on("click", this._onFirstButtonClick, this);

    this._lastButton = this.getByCssClass(this._CSS_LAST_BUTTON);
    $assert(this._lastButton !== null, "js.widget.TablePaging#TablePaging", "Invalid paging layout. Missing last page button.");
    this._lastButton.on("click", this._onLastButtonClick, this);
};

js.widget.TablePaging.prototype = {
    _CSS_START_TEXT : "start",
    _CSS_END_TEXT : "end",
    _CSS_TOTAL_TEXT : "total",
    _CSS_FIRST_BUTTON : "first-page",
    _CSS_LAST_BUTTON : "last-page",

    _render : function () {
        this._enable(this._firstButton, this._pageIndex > 0);
        this._enable(this._previousButton, this._pageIndex > 0);
        this._enable(this._nextButton, this._pageIndex < this._pagesCount - 1);
        this._enable(this._lastButton, this._pageIndex < this._pagesCount - 1);

        this._startText.setText(this._pageIndex * this._pageSize + 1);
        this._endText.setText(Math.min((this._pageIndex + 1) * this._pageSize, this._itemsCount));
        this._totalText.setText(this._itemsCount);
    },

    _onFirstButtonClick : function (ev) {
        this._pageIndex = 0;
        this._fireChangeEvent();
    },

    _onLastButtonClick : function (ev) {
        this._pageIndex = this._pagesCount - 1;
        this._fireChangeEvent();
    },

    toString : function () {
        return "js.widget.TablePaging";
    }
};
$extends(js.widget.TablePaging, js.widget.Paging);
