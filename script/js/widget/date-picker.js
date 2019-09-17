$package("js.widget");

/**
 * Date time picker.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 * @constructor Construct date time picker instance.
 * @param Document ownerDoc owner document,
 * @param Node node native node.
 */
js.widget.DatePicker = function (ownerDoc, node) {
    this.$super(ownerDoc, node);

    this._symbols = new js.format.DateFormatSymbols();
    this._captionView = this.getByCssClass("caption");

    var weekDays = this.findByCssClass("week-day");
    for ( var i = 0; i < weekDays.size(); i++) {
        weekDays.item(i).setText(this._symbols.tinyWeekDays[i]);
    }

    this._daysList = this.findByCss(".month-days .button").removeCssClass("selected").removeCssClass("disabled");
    this.MAX_DAY_CELLS = this._daysList.size();
    this._selectedDay = null;

    this._date = new Date();
    this._date.setHours(0);
    this._date.setMinutes(0);
    this._date.setSeconds(0);
    this._date.setMilliseconds(0);

    this._year = this._date.getFullYear();
    this._month = this._date.getMonth();

    this._previewView = this.getByCssClass("preview");
    this._update();

    this.getByCssClass("left").on("click", this._onPreviousMonth, this);
    this.getByCssClass("right").on("click", this._onNextMonth, this);
    this.getByCssClass("today").on("click", this._onToday, this);
    this.getByCssClass("reset").on("click", this._onReset, this);
    this.getByCssClass("cancel").on("click", this._onCancel, this);

    this._callback = null;
    this._scope = null;
};

js.widget.DatePicker.prototype = {
    setCaption : function (caption) {
        this._captionView.setText(caption);
    },

    // TODO replace callback with custom events
    setCallback : function (callback, scope) {
        this._callback = callback;
        this._scope = scope || window;
    },

    _onPreviousMonth : function (ev) {
        ev.prevent();
        this._month--;
        if (this._month < 0) {
            this._year--;
            this._month = 11;
        }
        this._update();
    },

    _onNextMonth : function (ev) {
        ev.prevent();
        this._month++;
        if (this._month > 11) {
            this._year++;
            this._month = 0;
        }
        this._update();
    },

    _onToday : function (ev) {
        var day;

        ev.prevent();
        this._date = new Date();
        this._year = this._date.getFullYear();
        this._month = this._date.getMonth();
        day = this._date.getDate();

        this._update();

        // TODO need to find element with text and css does not help
        // is a job for xpath but jslib has not implemented yet
        // so need to use brute force
        var it = this.findByCss(":not([disable])").it(), el;
        while (it.hasNext()) {
            el = it.next();
            if (el.getText() == day) {
                this._selectDay(el);
                break;
            }
        }
    },

    _onReset : function (ev) {
        ev.prevent();
        this._call(null);
    },

    _onCancel : function (ev) {
        ev.prevent();
        this._call(undefined);
    },

    _onDayClick : function (ev) {
        ev.prevent();
        this._selectDay(ev.target);
        this._date.setDate(this._selectedDay.getText());
        this._call(this._date);
    },

    _call : function (value) {
        if (this._callback !== null) {
            this._callback.call(this._scope, value);
            this._callback = null;
            this._scope = null;
            this.hide();
        }
    },

    _selectDay : function (day) {
        if (this._selectedDay !== null) {
            this._selectedDay.removeCssClass("selected");
        }
        this._selectedDay = day;
        if (this._selectedDay !== null) {
            this._selectedDay.addCssClass("selected");
        }
    },

    _update : function () {
        window.requestAnimationFrame(this._render.bind(this));
    },

    _render : function () {
        var now, isCurrentMonth, today, todayYear, todayMonth, firstDayIndex, previousMonthDaysCount, monthDaysCount, i, j;

        this._previewView.setText($format("%s, %s", this._symbols.fullMonths[this._month], this._year));

        now = new Date();
        isCurrentMonth = this._year === now.getFullYear() && this._month === now.getMonth();
        today = now.getDate();

        this._date.setFullYear(this._year);
        this._date.setMonth(this._month);
        this._date.setDate(1);
        firstDayIndex = this._date.getDay();

        previousMonthDaysCount = this._getMonthDaysCount(this._year, this._month === 0 ? 11 : this._month - 1);
        monthDaysCount = this._getMonthDaysCount(this._year, this._month);

        // TODO use event dispatching pattern
        this._daysList.call("un", "click", this._onDayClick);

        i = firstDayIndex, j = previousMonthDaysCount;
        while (--i >= 0) {
            this._daysList.item(i).setText(j--).addCssClass("disabled").removeCssClass("today");
        }
        for (i = firstDayIndex, j = 1; j <= monthDaysCount; i++, j++) {
            this._daysList.item(i).setText(j).removeCssClass("disabled")[isCurrentMonth && j === today ? "addCssClass" : "removeCssClass"]("today");
            // TODO use event dispatching pattern
            this._daysList.item(i).on("click", this._onDayClick, this);
        }
        for (j = 1; i < this.MAX_DAY_CELLS; i++, j++) {
            this._daysList.item(i).setText(j).addCssClass("disabled").removeCssClass("today");
        }
        this._selectDay(null);
    },

    _monthDaysCount : [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ],

    _getMonthDaysCount : function (year, month) {
        if (month === 1 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) {
            return 29;
        }
        return this._monthDaysCount[month];
    }
};
$extends(js.widget.DatePicker, js.widget.Box);
