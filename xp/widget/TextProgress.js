$package('js.widget');

$import('js.dom.Element');
$import('js.util.NumberFormat');

js.widget.TextProgress = function(ownerDoc, node) {
    this.$super(ownerDoc, node);

    this.bind('.percent', 'js.format.Number');
    this.bind('.bytes-sent', 'js.format.Number');
    this.bind('.elapsed-time', 'js.format.Number');
    this.bind('.bytes-speed', 'js.format.Number');

    this._percent = this.getByCssClass('percent');
    this._bytesSent = this.getByCssClass('bytes-sent');
    this._elapsedTime = this.getByCssClass('elapsed-time');
    this._bytesSpeed = this.getByCssClass('bytes-speed');
};

js.widget.TextProgress.prototype =
{
    start: function() {
        this._startTime = new Date().getTime();
    },

    setTotal: function(total) {
        this._total = total;
    },

    setValue: function(value) {
        if (this._percent) {
            this._percent.setValue(100 * value / this._total);
        }
        if (this._bytesSent) {
            this._bytesSent.setValue(value);
        }
        var now = new Date().getTime();
        var ellapsed = (now - this._startTime) / 1000;
        var speed = value / ellapsed;
        if (this._elapsedTime) {
            this._elapsedTime.setValue(ellapsed);
        }
        if (this._bytesSpeed) {
            this._bytesSpeed.setValue(speed);
        }
    },

    /**
     * Returns a string representation of the object.
     *
     * @return String object string representation.
     */
    toString: function() {
        return 'js.widget.TextProgress';
    }
};
$extends(js.widget.TextProgress, js.dom.Progress);
