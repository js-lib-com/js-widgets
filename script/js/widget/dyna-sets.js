$package("js.widget");

/**
 * Form dynamic sets.
 * 
 * @author Iulian Rotaru
 * @since 1.3
 * @constructor Construct dynamic sets instance.
 * @param js.dom.Document ownerDoc owner document,
 * @param Node node native {@link Node} instance.
 * @assert this element has at least one child, used as template.
 */
js.widget.DynaSets = function (ownerDoc, node) {
    this.$super(ownerDoc, node);
    $assert(this.getFirstChild() !== null, "js.widget.DynaSets#DynaSets", "Invalid dyna sets: missing template child.");

    /**
     * Dynamic set name attribute.
     * 
     * @type String
     */
    this._setname = this.getAttr("data-name");

    this.clear();

    /**
     * Template element.
     * 
     * @type js.dom.Element
     */
    this._template = this.getFirstChild().remove(false);
};

js.widget.DynaSets.prototype = {
    /**
     * Maximum value for set count argument from {@link #reset()} method.
     * 
     * @type Number
     */
    _MAX_RESET_SETS_COUNT : 4,

    /**
     * Mark CSS class to identify optional control.
     * 
     * @type String
     */
    CSS_OPTIONAL : "optional",

    /**
     * Mark CSS class to identify invalid control.
     * 
     * @type String
     */
    CSS_INVALID : "invalid",

    getName : function () {
        return this._setname;
    },

    setValue : function (objects) {
        $assert(js.lang.Types.isArray(objects), "js.widget.DynaSets#setValue", "Values is not an array.");
        this.removeChildren();
        objects.forEach(function (object) {
            var fieldset = this._template.clone(true);
            fieldset.findByCss("[name]").forEach(function (control) {
                var opp = control.getAttr("name");
                var value = js.lang.OPP.get(object, opp);
                if (typeof value !== "undefined") {
                    control.setValue(value);
                }
            });
            this.addChild(fieldset);
        }, this);
    },

    getValue : function (objects) {
        var fieldsets = this.getChildren();
        if (typeof objects === "undefined") {
            objects = new Array(fieldsets.size());
        }
        fieldsets.forEach(function (fieldset, index) {
            var object = objects[index];
            if (typeof object === "undefined") {
                object = {};
                objects[index] = object;
            }
            fieldset.findByCss("[name]").forEach(function (control) {
                var opp = control.getAttr("name");
                js.lang.OPP.set(object, opp, control.getValue());
            });
        });
        return objects;
    },

    /**
     * Reset this dynamic sets, that is, remove its child sets.
     * 
     * @param Number... setsCount optional number of sets count after reset, default to 0.
     * @assert if sets count argument is present it is a number smaller than {@link #_MAX_RESET_SETS_COUNT}.
     */
    reset : function (setsCount) {
        if (typeof setsCount === "undefined") {
            setsCount = 0;
        }
        $assert(js.lang.Types.isNumber(setsCount), "js.widget.DynaSets#reset", "Sets count is not numeric value.");
        $assert(setsCount < this._MAX_RESET_SETS_COUNT, "js.widget.DynaSets#reset", "Sets count value is unreasonable large.");

        this.removeChildren();
        while (setsCount-- > 0) {
            this.addSet();
        }
        return this;
    },

    isEmpty : function () {
        return false;
    },

    addSet : function () {
        return this.addChild(this._template.clone(true));
    },

    getSetsCount : function () {
        return js.dom.Node.childElementCount(this._node);
    },
    /**
     * Reset all controls, excluding hidden inputs. Traverse all controls and invoke {@link js.dom.Control#reset()} for
     * every one. Also remove <code>invalid</code> CSS class. Note that hidden inputs are not affected. This may
     * depart from W3C specifications but is the de facto behavior. Finally, before returning this method takes care to
     * {@link #_autofocus}.
     * 
     * @return js.dom.Element this object.
     */
    reset : function () {
        this._forEachControl(false, function (control) {
            control.removeCssClass(this.CSS_INVALID);
            if (control.reset) {
                control.reset();
            }
        });
        return this._autofocus();
    },

    /**
     * Remove all controls value, including hidden. For each control invoke {@link js.dom.Control#clear}. Also remove
     * <code>invalid</code> mark. Finally, before returning this method takes care to {@link #_autofocus}.
     * 
     * @return js.dom.Element this pointer.
     */
    clear : function () {
        this._forEachControl(true, function (control) {
            control.removeCssClass(this.CSS_INVALID);
            if (control.clear) {
                control.clear();
            }
        });
        return this._autofocus();
    },

    /**
     * Set focus on first element with <code>autofocus</code> attribute. Try to locate an element with
     * <code>autofocus</code> attribute and invoke {@link js.dom.Element#focus} on it. If there are many, select the
     * first and ignore the rest. If no <code>autofocus</code> element found this method silently does nothing.
     * 
     * @return js.dom.Element this pointer.
     */
    _autofocus : function () {
        var autofocusControl = this.getByCss("[autofocus]");
        if (autofocusControl !== null) {
            autofocusControl.focus();
        }
        return this;
    },

    /**
     * Controls validation. For each control, hidden inputs excluded, invoke {@link js.dom.Control#isValid} and add
     * <code>invalid</code> CSS class if control validation fails. An empty control with <code>optional</code> CSS
     * class is considered valid. Anyway, if optional control has value aforementioned validation takes place.
     * 
     * @return Boolean true only if every single child control is valid.
     */
    isValid : function () {
        var controlsValid = true, valid;
        this._forEachControl(false, function (control) {
            valid = false;
            if (control.hasCssClass(this.CSS_OPTIONAL) && control.isEmpty()) {
                // empty optional control is considered valid
                valid = true;
            }
            else {
                // mandatory control is valid if isValid predicate say so or always valid if predicate is missing
                valid = control.isValid ? control.isValid() : true;
            }
            control.addCssClass(this.CSS_INVALID, !valid);
            controlsValid = valid && controlsValid;
        });
        return controlsValid;
    },

    /**
     * Execute callback for each control. This method is just a convenient way to invoke {@link #_scanControls} that
     * will run recursively.
     * 
     * @param Boolean includeHidden flag to include hidden inputs,
     * @param Function callback callback function to execute for each control.
     */
    _forEachControl : function (includeHidden, callback) {
        $assert(js.lang.Types.isElement(this), "js.dom.ControlsList#_forEachControl", "Mixin target is not an element.");
        this._scanControls(this.getNode(), includeHidden, callback);
    },

    /**
     * Scan node for named controls. It is empowered by {@link #_forEachControl} and scan recursively in depth-first
     * order for named controls. For every control found invoke <code>callback</code> with control as argument; uses
     * this mixin target instance as callback scope. Please note that given <code>node</code> is the tree root and is
     * not included into scanning process.
     * 
     * @param Node node native node,
     * @param Boolean includeHidden flag to include hidden inputs,
     * @param Function callback function to execute for each control.
     */
    _scanControls : function (node, includeHidden, callback) {
        function isControl (node) {
            if (!includeHidden && node.attributes.getNamedItem("type") === "hidden") {
                return false;
            }
            return node.hasAttribute("name") || node.hasAttribute("data-name");
        }
        var nodeList = node.children;
        for (var i = 0, n; i < node.children.length; i++) {
            n = node.children.item(i);
            // if is control invoke callback, otherwise continue branch depth-first scanning
            if (isControl(n)) {
                callback.call(this, this._ownerDoc.getElement(n));
            }
            else {
                this._scanControls(n, includeHidden, callback);
            }
        }
    },

    toString : function () {
        return "js.widget.DynaSets";
    }
};
$extends(js.widget.DynaSets, js.dom.Element);
// $implements(js.widget.DynaSets, js.dom.ControlInterface);
