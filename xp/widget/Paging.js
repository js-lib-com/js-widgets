$package('js.widget');

$import('js.dom.Element');
$import('js.lang.Types');
$import('js.lang.IllegalArgumentException');
$import('js.net.RPC');

js.widget.Paging = function(ownerDoc, node) {
    this.$super(ownerDoc, node);

    var lis = this.findByTag('li');
    this._previous = lis.item(0);
    this._previous.on('click', this._onPrevious, this);
    this._next = lis.item(lis.size() - 1);
    this._next.on('click', this._onNext, this);

    this._items = [];
    for (var i = 1, item, l = lis.size() - 1; i < l; i++) {
        item = lis.item(i);
        item.on('click', this._onListItem, this);
        this._items.push(item);
    }

    this._request = {};
};

js.widget.Paging.prototype =
{
    CLASS_HIDDEN: 'hidden',
    CLASS_DISABLED: 'disabled',
    CLASS_ACTIVE: 'active',

    /**
     * Attach list to this pagination widget.
     *
     * @param js.widget.ListCtrl list
     */
    setList: function(list, pageSize) {
        $assert(js.lang.Types.isNumber(pageSize));
        this._list = list;
        this._pageIndex = 0;
        this._request.pageSize = pageSize;
        this._request.totalRequested = true;
    },

    /**
     * Bind search criteria.
     *
     * @param js.dom.Element criteria
     * @throws js.lang.IllegalArgumentException is criteria getter is missing.
     */
    setCriteria: function(criteria) {
        if (!js.lang.Types.isFunction(criteria.get)) {
            throw new js.lang.IllegalArgumentException('js.widget.Paging.setList', 'Missing criteria getter.');
        }
        this._criteria = criteria;
    },

    /**
     * Set remote method and optional arguments.
     */
    setRemoteMethod: function(remoteMethod) {
        this._remoteMethod = remoteMethod;
        this._arguments = $arguments(arguments, 1);
    },

    update: function() {
        this._pageIndex = 0;
        this._request.totalRequested = true;
        this._update();
    },

    _update: function() {
        this._previous.addCssClass(this.CLASS_DISABLED);
        this._next.addCssClass(this.CLASS_DISABLED);

        this._request.pageIndex = this._pageIndex;
        if (typeof this._criteria !== 'undefined') {
            this._request.criteria = this._criteria.get();
        }
        var args = [this._request];
        for (var i = 0; i < this._arguments.length; ++i) {
            args.push(this._arguments[i]);
        }

        var rpc = new js.net.RPC(this._remoteMethod);
        rpc.setArguments(args);
        rpc.setCallback(this._onResponse, this);
        rpc.on('timeout', this._onTimeout, this);
        rpc.send();
    },

    _onResponse: function(response) {
        if (this._request.totalRequested) {
            this._request.totalRequested = false;
            this._pagesCount = Math.ceil(response.total / this._request.pageSize);
            this._lastPageIndex = this._pagesCount - 1;
            if (this._pagesCount > 1) {
                this.removeCssClass('hidden');
            }
            else {
                this.addCssClass('hidden');
            }
        }
        this._list.setValue(response.items);

        var items = this._items; // pagination items, elements used to display pages' number
        var pc = this._pagesCount; // pages count
        var il = items.length; // paginations' items length
        var sp = 0; // start page
        var vi = pc; // visible items
        if (pc > il) {
            sp = this._pageIndex - Math.floor(il / 2);
            if (sp < 0) {
                sp = 0;
            }
            if (sp + il >= pc) {
                sp = pc - il;
            }
            vi = il;
        }

        var i = 0;
        for (var p = sp; i < vi; i++, p++) {
            items[i].setText(p);
            items[i].removeCssClass(this.CLASS_HIDDEN);
            items[i].removeCssClass(this.CLASS_ACTIVE);
        }
        for (; i < il; i++) {
            items[i].addCssClass(this.CLASS_HIDDEN);
            items[i].removeCssClass(this.CLASS_ACTIVE);
        }

        var apIdx = this._pageIndex - sp;
        this._previous[(apIdx == 0 ? 'add' : 'remove') + 'CssClass'](this.CLASS_DISABLED);
        this._next[(apIdx == vi - 1 ? 'add' : 'remove') + 'CssClass'](this.CLASS_DISABLED);
        items[apIdx].addCssClass(this.CLASS_ACTIVE);
    },

    _onListItem: function(ev) {
        this._pageIndex = Number(ev.target.get());
        this._update();
    },

    _onPrevious: function(ev) {
        if (this._pageIndex > 0) {
            this._pageIndex--;
            this._update();
        }
    },

    _onNext: function(ev) {
        if (this._pageIndex < this._lastPageIndex) {
            this._pageIndex++;
            this._update();
        }
    },

    _onTimeout: function() {
        this._previous.removeCssClass(this.CLASS_DISABLED);
        this._next.removeCssClass(this.CLASS_DISABLED);
    },

    /**
     * Returns a string representation of the object.
     *
     * @return String object string representation.
     */
	toString: function() {
		return 'js.widget.Paging';
	}
};
$extends(js.widget.Paging, js.dom.Element);
