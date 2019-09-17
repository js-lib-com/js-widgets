$package("js.widget");

/**
 * Image slide show.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * 
 * @constructor Construct image slide show instance.
 * @param js.dom.Element container
 */
js.widget.ImageShow = function (container) {
    $assert(container instanceof js.dom.Element, "js.widget.ImageShow#ImageShow", "Container is not an element.");

    this._ownerDoc = container._ownerDoc;
    if (!container.style.has("position", "absolute", "relative")) {
        container.style.set("position", "relative");
    }

    var styles = {
        "position" : "absolute",
        "left" : "0px",
        "top" : "0px",
        "width" : container.style.getWidth() + "px",
        "height" : container.style.getHeight() + "px",
        "overflow" : "hidden"
    };

    this._img1 = this._ownerDoc.createElement("img");
    this._img1.style.set(styles).set("z-index", "100");
    container.addChild(this._img1);

    this._img2 = this._ownerDoc.createElement("img");
    this._img2.style.set(styles).set("z-index", "200");
    container.addChild(this._img2);
};

js.widget.ImageShow.prototype = {
    start : function () {
        $assert(this.images !== null, "js.widget.ImageShow#start", "Images is null.");
        this._img1.setSrc(this.images[0]);
        this._img2.setSrc(this.images[0]);
        if (!this.transitionDuration) {
            this.transitionDuration = 2000;
        }
        if (!this.slideDuration) {
            this.slideDuration = 2000;
        }

        // temporary image used to ensure image is fully loaded before transition
        // created as element but not added to DOM tree
        this._img = this._ownerDoc.createElement("img");
        this._img.on("load", this._onLoad, this);

        this._timer = js.util.Timeout(this.slideDuration, this._onTick, this);
    },

    stop : function () {
        this._stoped = true;
        this._timer.stop();
    },

    _onTick : function () {
        this._img.setSrc(this.images[js.util.Rand(this.images.length)]);
    },

    _onLoad : function () {
        this._img1.setSrc(this._img2.getSrc());
        this._img2.setSrc(this._img.getSrc());

        var anim = new js.fx.Anim({
            el : this._img2,
            duration : this.transitionDuration,
            style : "opacity",
            from : 0,
            to : 1
        });
        anim.setCallback(this._onComplete, this);
        anim.start();
    },

    _onComplete : function () {
        if (!this._stoped) {
            this._timer.start();
        }
    },

    /**
     * Returns a string representation of the object.
     * 
     * @return String object string representation.
     */
    toString : function () {
        return "js.widget.ImageShow";
    }
};
$extends(js.widget.ImageShow, Object);
