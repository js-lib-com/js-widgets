$package("js.widget");

/**
 * Audio player.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct audio player instance.
 * @param Document ownerDoc owner document,
 * @param Node node native node.
 */
js.widget.AudioPlayer = function (ownerDoc, node) {
    this.$super(ownerDoc, node);

    this._playing = false;
    this._audio = ownerDoc.createElement("audio");
    this.addChild(this._audio);
    this._audio = this._audio._node;
    this._audio.addEventListener("canplay", this._onCanPlay.bind(this));

    this._cursor = this.getByCssClass("cursor");
    this._cursor.on("click", this._onCursor, this);

    this._playerWidth = this.style.getWidth() - this._cursor.style.getWidth();
    this._cursor.style.setLeft(0);

    this._timer = new js.util.Timer(100, this._onTimer, this);

    this._volume = this.getByCssClass("volume");
    this._volume.on("input", this._onVolumeChange, this);
};

js.widget.AudioPlayer.prototype = {
    play : function (audioURL) {
        this._audio.setAttribute("src", audioURL);
    },

    _onCanPlay : function (ev) {
        this._scaleFactor = this._playerWidth / this._audio.duration;
        this._play();
    },

    _play : function () {
        if (this._playing) {
            this.pause();
        }
        this._audio.play();
        this._timer.start();
        this._playing = true;
        this._cursor.removeCssClass("paused");
    },

    pause : function () {
        if (this._playing) {
            this._audio.pause();
            this._timer.stop();
            this._playing = false;
            this._cursor.addCssClass("paused");
        }
    },

    _onCursor : function (ev) {
        if (this._playing) {
            this.pause();
        }
        else {
            this._play();
        }
    },

    _onTimer : function (ev) {
        this._cursor.style.setLeft(Math.round(this._scaleFactor * this._audio.currentTime));
    },

    _onVolumeChange : function (volume) {
        $debug("volumne", volume)
        this._audio.volume = volume / 100;
    },

    toString : function () {
        return "js.widget.AudioPlayer";
    }
};
$extends(js.widget.AudioPlayer, js.dom.Element);