$package('js.widget');

$import('js.dom.Element');
$import('js.net.URL');
$import('js.util.Timer');

// This function is automatically called by the player once it loads
function onYouTubePlayerReady(playerId) {
    js.widget.VideoPlayer._players[playerId]._onReady();
};

js.widget.VideoPlayer = function(ownerDoc, node) {
    this.$super(ownerDoc, node);

    /**
     * Document body. Internally body element used to register mouse events listernes.
     * @type js.dom.Element
     */
    this._body = ownerDoc.getByTag('body');

    this._embeded = false;
    this._transparent = true;
    this._arguments =
    {
        autoplay: true,
        controls: false,
        rel: false,
        showinfo: false,
        fs: true
    };
};

/**
 * Registered players.
 * @type js.util.Map
 */
js.widget.VideoPlayer._players = {};

js.widget.VideoPlayer.prototype =
{
    config: function(cfg) {
        this._embeded = cfg.embeded;
        this._transparent = cfg.transparent;
        this._arguments =
        {
            autoplay: false,
            controls: true,
            autohide: !!cfg.autohide,
            rel: false,
            showinfo: false,
            fs: !!cfg.fullScreen
        };
        if (typeof cfg.borderColor !== 'undefined') {
            this._arguments.border = true;
            this._arguments.color1 = '0x' + cfg.borderColor.substr(1);
        }
        if (typeof cfg.controlsColor !== 'undefined') {
            this._arguments.border = true;
            this._arguments.color2 = '0x' + cfg.controlsColor.substr(1);
        }
    },

    set: function(videoID) {
        this._selfinit(videoID);
    },

    play: function(videoID) {
        this._selfinit(videoID);
        if (this._player) {
            this._play(videoID);
        }
    },

    isPlaying: function() {
        return this._playing;
    },

    pause: function() {
        this._playing = false;
        this._player.pauseVideo();
    },

    stop: function() {
        this._player.stopVideo();
    },

    mute: function() {
        this._player.mute();
    },

    unmute: function() {
        this._player.unMute();
    },

    _selfinit: function(videoID) {
        $assert(js.lang.Types.isString(videoID));
        this._selfinit = js.lang.NOP;

        this._playing = false;
        this._playerId = js.util.ID();
        js.widget.VideoPlayer._players[this._playerId] = this;

        var canvasId = js.util.ID();
        this.getByCssClass('canvas').setAttr('id', canvasId);

        if (!this._embeded) {
            this._logo = this.getByCssClass('logo');
            this._logo.on('mouseover', function(ev) {
                ev.halt();
            });
            this._progress = this.getByCssClass('progress');
            this._cursor = this.getByCssClass('cursor');
            this._cursorOffset = this._progress.style.getPosition()[0] + this._cursor.style.getWidth() / 2;
            this._progressWidth = this._progress.style.getWidth() - this._cursor.style.getWidth();
            this._cursor.on('mousedown', this._onCursorMouseDown, this);
        }

        var width = '100%';
        var height = '100%';
        var flashvars = null;
        var params =
        {
            allowScriptAccess: 'always'
        };
        if (this._arguments.fs) {
            params.allowFullScreen = 'true';
        }
        if (this._transparent) {
            // wmode flash object parameter is essential for z-index
            // otherwise DOM elements will be always displayed behind flash object
            params.wmode = 'transparent';
        }
        var attrs =
        {
            id: this._playerId
        };

        var url;
        this._arguments.version = 3;
        this._arguments.enablejsapi = true;
        this._arguments.playerapiid = this._playerId;
        this._arguments.iv_load_policy = 3;
        this._arguments.modestbranding = true;
        if (this._embeded) {
            url = new js.net.URL('http://www.youtube.com/v/' + videoID, this._arguments);
        }
        else {
            this._videoID = videoID;
            url = new js.net.URL('http://www.youtube.com/apiplayer', this._arguments);
        }
        swfobject.embedSWF(url.value, canvasId, width, height, '8', null, flashvars, params, attrs);
    },

    _onReady: function() {
        this._player = document.getElementById(this._playerId);
        if (!this._embeded) {
            this._play(this._videoID);
            this._timer = js.util.Timer(100, this._onTimer, this);
        }
    },

    _play: function(videoID) {
        this._playing = true;
        this._player.cueVideoById(videoID);
        this._player.playVideo();
    },

    _onCursorMouseDown: function(ev) {
        ev.halt();
        this._mouseMoving = false;
        this._timer.stop();
        this._body.on('mousemove', this._onCursorMouseMove, this);
        this._body.on('mouseup', this._onCursorMouseUp, this);
    },

    _onCursorMouseUp: function(ev) {
        ev.halt();
        this._body.un('mousemove', this._onCursorMouseMove);
        this._body.un('mouseup', this._onCursorMouseUp);

        if (!this._mouseMoving) {
            if (this._playing) {
                this._cursor.addCssClass('paused');
                this._player.pauseVideo();
                this._timer.stop();
            }
            else {
                this._timer.start();
                this._player.playVideo();
                this._cursor.removeCssClass('paused');
            }
            this._playing = !this._playing;
            return;
        }
        this._mouseMoving = false;

        var left = ev.pageX - this._cursorOffset;
        if (left < 0) {
            left = 0;
        }
        if (left > this._progressWidth) {
            left = this._progressWidth;
        }
        var offsetPercent = 100 * left / this._progressWidth;
        var seconds = offsetPercent * this._player.getDuration() / 100;
        this._player.seekTo(seconds, true);
        this._timer.start();
    },

    _onCursorMouseMove: function(ev) {
        ev.halt();
        this._mouseMoving = true;
        var left = ev.pageX - this._cursorOffset;
        if (left < 0) {
            left = 0;
        }
        if (left > this._progressWidth) {
            left = this._progressWidth;
        }
        this._cursor.style.set('left', left + 'px');
    },

    _onTimer: function() {
        if (this._player) {
            var increment = this._progressWidth / 100;
            if (this._player.getVideoBytesTotal()) {
                var percent = 100 * this._player.getVideoBytesLoaded() / this._player.getVideoBytesTotal();
                var position = -this._progressWidth + increment * percent;
                this._progress.style.set('background-position', position + 'px');
            }
            if (this._player.getDuration()) {
                percent = 100 * this._player.getCurrentTime() / this._player.getDuration();
                position = increment * percent;
                this._cursor.style.set('left', position + 'px');
            }
        }
    }
};
$extends(js.widget.VideoPlayer, js.dom.Element);
