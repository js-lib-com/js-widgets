CountryCodeDlg = function(container) {
	this.init();
};

CountryCodeDlg.prototype = {
	ID_DIALOG : 'country.code.dialog',
	ID_CANCEL : 'country.code.cancel',
	ID_SEARCH : 'country.code.search',
	ID_PROGRESS : 'country.code.progress',
	ID_LATITUDE : 'country.code.latitude',
	ID_LONGITUDE : 'country.code.longitude',
	ID_X_AXIS : 'country.code.map.x',
	ID_Y_AXIS : 'country.code.map.y',
	ID_MOUSE_CAPTURE : 'country.code.map.capture',

	ID_LIST : 'country.code.list',
	LIST_SIZE : 16,
	ID_LIST_CODE : 'country.list.code',
	ID_LIST_COUNTRY : 'country.list.name',

	init : function() {
		WorldMap.init();
		this._dlg = Dom.getById(this.ID_DIALOG);
		Keyboard.setListener(this._dlg, this._onKeyDown, this);
		this._search = Dom.getById(this.ID_SEARCH);
		this._progress = Dom.getById(this.ID_PROGRESS);
		this._latitude = Dom.getById(this.ID_LATITUDE);
		this._longitude = Dom.getById(this.ID_LONGITUDE);
		this._x_axis = Dom.getById(this.ID_X_AXIS);
		this._y_axis = Dom.getById(this.ID_Y_AXIS);

		this._rows = [];
		var ccTable = Dom.getById(this.ID_LIST);
		var ccRows = Dom.getByTag(ccTable, 'tr');
		for ( var i = ccRows.length - 1; i >= 0; i--) {
			var cells = Dom.getChildren(ccRows[i]);
			var codeEl = cells[0];
			var countryEl = cells[1];
			Event.click(codeEl, this._onItemClick, this, codeEl);
			this._rows.push( {
				code : codeEl,
				country : countryEl
			});
		}

		this._anim = new Anim.Dialog(this._dlg, {
			top : [ 700, 350 ],
			left : [ 300, 100 ],
			width : [ 0, 658 ],
			height : [ 0, 350 ],
			opacity : [ 0, 0.9 ]
		});
		this._anim.addListener('afteropen', this._onOpenComplete, this);
		this._anim.addListener('afterclose', this._onCloseComplete, this);

		Event.click(this.ID_CANCEL, this._onCancel, this);
		Event.keyup(this._search, this._onSearch, this);

		var mouse_capture = Dom.getById(this.ID_MOUSE_CAPTURE);
		Event.mousemove(mouse_capture, this._onMouseMove, this);
		Event.click(mouse_capture, this._onMapClick, this);
		this._moveEventsCount = 0;
	},

	open : function(callback, scope) {
		this._callback = callback;
		this._scope = scope;

		this._frozen = true;
		this._search.value = '';
		Dom.removeClass(this._x_axis, 'selected');
		Dom.removeClass(this._y_axis, 'selected');

		Dom.removeClass(this._dlg, 'hidden');
		this._anim.open();
	},

	_onOpenComplete : function() {
		this._frozen = false;
		this._search.focus();
	},

	_onCloseComplete : function() {
		Dom.addClass(this._dlg, 'hidden');
		this._callback.call(this._scope, this._selectedCountryCode);
	},

	_onCancel : function() {
		this._onKeyDown(Keyboard.ESCAPE);
	},

	_onKeyDown : function(keynum) {
		if (keynum != Keyboard.ESCAPE)
			return;
		this._selectedCountryCode = null;
		this._anim.close();
	},

	_onSearch : function(e) {
		var v = this._search.value;
		this._frozen = v.length;
		var items = [];
		if (v.length) {
			v = v.toLowerCase();
			for ( var i = 0; i < CountryCodes.length && items.length < 16; i++) {
				var cc = CountryCodes[i];
				var c = cc.country.toLowerCase();
				var j = 0;
				for (; j < v.length; j++) {
					if (v.charAt(j) !== c.charAt(j))
						break;
				}
				if (j == v.length)
					items.push(cc);
			}
		}

		var fn = items.length == 1 ? 'addClass' : 'removeClass';
		Dom[fn](this._x_axis, 'selected');
		Dom[fn](this._y_axis, 'selected');
		Dom.setStyle(this._progress, 'width', 16 * items.length + 'px');

		if (items.length == 1) {
			Dom.setStyle(this._x_axis, 'top', items[0].y + 'px');
			Dom.setStyle(this._y_axis, 'left', items[0].x + 'px');
			this._latitude.innerHTML = WorldMap.getLatitude(items[0].y);
			this._longitude.innerHTML = WorldMap.getLongitude(items[0].x);
		}

		this._addItems(items);
	},

	_onMouseMove : function(e) {
		if (this._frozen)
			return;
		if (this._moveEventsCount++ % 3)
			return;
		this._updateItems(e);
	},

	_onMapClick : function(e) {
		this._frozen = !this._frozen;
		if (!this._frozen)
			this._updateItems(e);
		var fn = this._frozen ? 'addClass' : 'removeClass';
		Dom[fn](this._x_axis, 'selected');
		Dom[fn](this._y_axis, 'selected');
	},

	_onItemClick : function(ev, link) {
		this._selectedCountryCode = link.innerHTML;
		this._anim.close();
	},

	_updateItems : function(e) {
		if (!this._xoffset) {
			var mouse_capture = Dom.getById(this.ID_MOUSE_CAPTURE);
			var pos = Dom.getXY(mouse_capture);
			this._xoffset = pos[0];
			this._yoffset = pos[1];
		}
		var x = e.pageX - this._xoffset;
		var y = e.pageY - this._yoffset;

		Dom.setStyle(this._x_axis, 'top', y + 'px');
		Dom.setStyle(this._y_axis, 'left', x + 'px');
		this._latitude.innerHTML = WorldMap.getLatitude(y);
		this._longitude.innerHTML = WorldMap.getLongitude(x);

		var x0 = x - 9;
		var y0 = y - 8;
		var x1 = x + 9;
		var y1 = y + 8;

		var items = [];
		do {
			for ( var i = 0; i < CountryCodes.length && items.length < 16; i++) {
				var cc = CountryCodes[i];
				if (cc.x < x0)
					continue;
				if (cc.y < y0)
					continue;
				if (cc.x > x1)
					continue;
				if (cc.y > y1)
					continue;
				items.push( {
					country : cc.country,
					code : cc.code
				});
			}
			x0 -= 3;
			x1 += 3;
			y0 -= 1;
			y1 += 1;
		} while (!items.length);
		this._addItems(items);

		Dom.setStyle(this._progress, 'width', 16 * items.length + 'px');
		// this._progress.set(items.length);
	},

	_addItems : function(items) {
		var i = 0;
		for (; i < items.length; i++) {
			this._rows[i].code.innerHTML = '+' + items[i].code;
			this._rows[i].country.innerHTML = items[i].country;
		}
		for (; i < this.LIST_SIZE; i++) {
			this._rows[i].code.innerHTML = '';
			this._rows[i].country.innerHTML = '';
		}
	}
};

WorldMap = {
	_ecuator : 110,
	_greenwich : 180,
	_references : { // four cardinal points references degree / pixel
		N : [ 64, 89 ],
		S : [ 54, 81 ],
		W : [ 120, 134 ],
		E : [ 175, 213 ]
	},
	_xlabels : [ 'W', 'E' ],
	_ylabels : [ 'N', 'S' ],

	init : function() {
		// compute degree per pixel ratio for each cardinal point
	this._dppN = this._references.N[0] / this._references.N[1];
	this._dppS = this._references.S[0] / this._references.S[1];
	this._dppW = this._references.W[0] / this._references.W[1];
	this._dppE = this._references.E[0] / this._references.E[1];
},

	getLatitude : function(y) {
		var yidx = y < this._ecuator ? 0 : 1; // 0:N, 1:S
	y = Math.abs(y - this._ecuator);
	y = Math.round(y * (yidx ? this._dppS : this._dppN));
	return this._pad(y) + '&deg;' + Math.round(10 + 50 * Math.random()) + ' '
			+ this._ylabels[yidx];
},

getLongitude : function(x) {
	var xidx = x < this._greenwich ? 0 : 1; // 0:W, 1:E
	x = Math.abs(x - this._greenwich);
	x = Math.round(x * (xidx ? this._dppE : this._dppW));
	return this._pad(x) + '&deg;' + Math.round(10 + 50 * Math.random()) + ' '
			+ this._xlabels[xidx];
},

_pad : function(v) {
	v = String(v);
	var count = 3 - v.length;
	while (count--)
		v = '0' + v;
	return v;
}
};

CountryCodes = [ {
	code : '93',
	country : 'Afghanistan',
	y : 64.0,
	x : 259.0
}, {
	code : '355',
	country : 'Albania',
	y : 52.0,
	x : 204.0
}, {
	code : '213',
	country : 'Algeria',
	y : 71.0,
	x : 183.0
}, {
	code : '1684',
	country : 'American Samoa',
	y : 131.0,
	x : -9.0
}, {
	code : '376',
	country : 'Andorra',
	y : 51.0,
	x : 181.0
}, {
	code : '244',
	country : 'Angola',
	y : 128.0,
	x : 201.0
}, {
	code : '1264',
	country : 'Anguilla',
	y : 84.0,
	x : 109.0
}, {
	code : '672',
	country : 'Antarctica',
	y : 245.0,
	x : 180.0
}, {
	code : '1268',
	country : 'Antigua',
	y : 86.0,
	x : 111.0
}, {
	code : '54',
	country : 'Argentina',
	y : 161.0,
	x : 108.0
}, {
	code : '374',
	country : 'Armenia',
	y : 54.0,
	x : 234.0
}, {
	code : '297',
	country : 'Aruba',
	y : 93.0,
	x : 102.0
}, {
	code : '61',
	country : 'Australia',
	y : 150.0,
	x : 341.0
}, {
	code : '43',
	country : 'Austria',
	y : 44.0,
	x : 195.0
}, {
	code : '994',
	country : 'Azerbaijan',
	y : 54.0,
	x : 237.0
}, {
	code : '1242',
	country : 'Bahamas',
	y : 76.0,
	x : 95.0
}, {
	code : '973',
	country : 'Bahrain',
	y : 73.0,
	x : 240.0
}, {
	code : '880',
	country : 'Bangladesh',
	y : 76.0,
	x : 289.0
}, {
	code : '1246',
	country : 'Barbados',
	y : 91.0,
	x : 114.0
}, {
	code : '375',
	country : 'Belarus',
	y : 36.0,
	x : 214.0
}, {
	code : '32',
	country : 'Belgium',
	y : 40.0,
	x : 184.0
}, {
	code : '501',
	country : 'Belize',
	y : 86.0,
	x : 81.0
}, {
	code : '229',
	country : 'Benin',
	y : 97.0,
	x : 182.0
}, {
	code : '1441',
	country : 'Bermuda',
	y : 65.0,
	x : 108.0
}, {
	code : '975',
	country : 'Bhutan',
	y : 72.0,
	x : 289.0
}, {
	code : '591',
	country : 'Bolivia',
	y : 135.0,
	x : 107.0
}, {
	code : '387',
	country : 'Bosnia and Herzegovina',
	y : 48.0,
	x : 201.0
}, {
	code : '267',
	country : 'Botswana',
	y : 143.0,
	x : 209.0
}, {
	code : '55',
	country : 'Brazil',
	y : 125.0,
	x : 118.0
}, {
	code : '1284',
	country : 'British Virgin Islands',
	y : 84.0,
	x : 108.0
}, {
	code : '673',
	country : 'Brunei',
	y : 104.0,
	x : 318.0
}, {
	code : '359',
	country : 'Bulgaria',
	y : 50.0,
	x : 210.0
}, {
	code : '226',
	country : 'Burkina Faso',
	y : 91.0,
	x : 177.0
}, {
	code : '257',
	country : 'Burundi',
	y : 114.0,
	x : 216.0
}, {
	code : '855',
	country : 'Cambodia',
	y : 91.0,
	x : 307.0
}, {
	code : '237',
	country : 'Cameroon',
	y : 101.0,
	x : 194.0
}, {
	code : '1',
	country : 'Canada',
	y : 26.0,
	x : 73.0
}, {
	code : '238',
	country : 'Cape Verde',
	y : 87.0,
	x : 153.0
}, {
	code : '1345',
	country : 'Cayman Islands',
	y : 83.0,
	x : 90.0
}, {
	code : '236',
	country : 'Central African Republic',
	y : 100.0,
	x : 205.0
}, {
	code : '235',
	country : 'Chad',
	y : 89.0,
	x : 203.0
}, {
	code : '56',
	country : 'Chile',
	y : 155.0,
	x : 100.0
}, {
	code : '86',
	country : 'China',
	y : 61.0,
	x : 307.0
}, {
	code : '618',
	country : 'Christmas Island',
	y : 125.0,
	x : 307.0
}, {
	code : '61',
	country : 'Cocos-Keeling Islands',
	y : 128.0,
	x : 296.0
}, {
	code : '57',
	country : 'Colombia',
	y : 104.0,
	x : 99.0
}, {
	code : '269',
	country : 'Comoros',
	y : 128.0,
	x : 233.0
}, {
	code : '243',
	country : 'Democratic Republic of the Congo',
	y : 110.0,
	x : 210.0
}, {
	code : '242',
	country : 'Republic of the Congo',
	y : 111.0,
	x : 198.0
}, {
	code : '682',
	country : 'Cook Islands',
	y : 141.0,
	x : 2.0
}, {
	code : '506',
	country : 'Costa Rica',
	y : 96.0,
	x : 86.0
}, {
	code : '225',
	country : 'Cote d\'Ivoire',
	y : 98.0,
	x : 174.0
}, {
	code : '385',
	country : 'Croatia',
	y : 47.0,
	x : 198.0
}, {
	code : '53',
	country : 'Cuba',
	y : 80.0,
	x : 90.0
}, {
	code : '357',
	country : 'Cyprus',
	y : 61.0,
	x : 220.0
}, {
	code : '420',
	country : 'Czech Republic',
	y : 41.0,
	x : 198.0
}, {
	code : '45',
	country : 'Denmark',
	y : 32.0,
	x : 192.0
}, {
	code : '253',
	country : 'Djibouti',
	y : 94.0,
	x : 232.0
}, {
	code : '1767',
	country : 'Dominica',
	y : 89.0,
	x : 111.0
}, {
	code : '1809',
	country : 'Dominican Republic',
	y : 83.0,
	x : 101.0
}, {
	code : '670',
	country : 'East Timor',
	y : 122.0,
	x : 332.0
}, {
	code : '593',
	country : 'Ecuador',
	y : 113.0,
	x : 94.0
}, {
	code : '20',
	country : 'Egypt',
	y : 72.0,
	x : 216.0
}, {
	code : '503',
	country : 'El Salvador',
	y : 91.0,
	x : 81.0
}, {
	code : '240',
	country : 'Equatorial Guinea',
	y : 107.0,
	x : 192.0
}, {
	code : '291',
	country : 'Eritrea',
	y : 89.0,
	x : 227.0
}, {
	code : '372',
	country : 'Estonia',
	y : 27.0,
	x : 211.0
}, {
	code : '251',
	country : 'Ethiopia',
	y : 98.0,
	x : 226.0
}, {
	code : '500',
	country : 'Falkland Islands (Malvinas)',
	y : 186.0,
	x : 114.0
}, {
	code : '298',
	country : 'Faroe Islands',
	y : 23.0,
	x : 172.0
}, {
	code : '679',
	country : 'Fiji Islands',
	y : 137.0,
	x : 200.0
}, {
	code : '358',
	country : 'Finland',
	y : 21.0,
	x : 211.0
}, {
	code : '33',
	country : 'France',
	y : 44.0,
	x : 182.0
}, {
	code : '594',
	country : 'French Guiana',
	y : 104.0,
	x : 120.0
}, {
	code : '689',
	country : 'French Polynesia',
	y : 132.0,
	x : 23.0
}, {
	code : '241',
	country : 'Gabonese Republic',
	y : 111.0,
	x : 193.0
}, {
	code : '220',
	country : 'Gambia',
	y : 91.0,
	x : 162.0
}, {
	code : '995',
	country : 'Georgia',
	y : 51.0,
	x : 232.0
}, {
	code : '49',
	country : 'Germany',
	y : 39.0,
	x : 190.0
}, {
	code : '233',
	country : 'Ghana',
	y : 98.0,
	x : 177.0
}, {
	code : '350',
	country : 'Gibraltar',
	y : 59.0,
	x : 174.0
}, {
	code : '30',
	country : 'Greece',
	y : 55.0,
	x : 206.0
}, {
	code : '299',
	country : 'Greenland',
	y : 9.0,
	x : 135.0
}, {
	code : '1473',
	country : 'Grenada',
	y : 93.0,
	x : 111.0
}, {
	code : '590',
	country : 'Guadeloupe',
	y : 87.0,
	x : 111.0
}, {
	code : '1671',
	country : 'Guam',
	y : 91.0,
	x : 355.0
}, {
	code : '502',
	country : 'Guatemala',
	y : 89.0,
	x : 79.0
}, {
	code : '224',
	country : 'Guinea',
	y : 94.0,
	x : 168.0
}, {
	code : '245',
	country : 'Guinea-Bissau',
	y : 93.0,
	x : 163.0
}, {
	code : '592',
	country : 'Guyana',
	y : 103.0,
	x : 114.0
}, {
	code : '509',
	country : 'Haiti',
	y : 83.0,
	x : 99.0
}, {
	code : '504',
	country : 'Honduras',
	y : 89.0,
	x : 83.0
}, {
	code : '852',
	country : 'Hong Kong',
	y : 79.0,
	x : 318.0
}, {
	code : '36',
	country : 'Hungary',
	y : 44.0,
	x : 204.0
}, {
	code : '354',
	country : 'Iceland',
	y : 19.0,
	x : 159.0
}, {
	code : '91',
	country : 'India',
	y : 82.0,
	x : 273.0
}, {
	code : '62',
	country : 'Indonesia',
	y : 117.0,
	x : 326.0
}, {
	code : '98',
	country : 'Iran',
	y : 65.0,
	x : 244.0
}, {
	code : '964',
	country : 'Iraq',
	y : 64.0,
	x : 233.0
}, {
	code : '353',
	country : 'Ireland',
	y : 36.0,
	x : 171.0
}, {
	code : '972',
	country : 'Israel',
	y : 66.0,
	x : 221.0
}, {
	code : '39',
	country : 'Italy',
	y : 51.0,
	x : 194.0
}, {
	code : '1876',
	country : 'Jamaica',
	y : 84.0,
	x : 94.0
}, {
	code : '81',
	country : 'Japan',
	y : 59.0,
	x : 347.0
}, {
	code : '962',
	country : 'Jordan',
	y : 66.0,
	x : 223.0
}, {
	code : '7',
	country : 'Kazakhstan',
	y : 43.0,
	x : 262.0
}, {
	code : '254',
	country : 'Kenya',
	y : 108.0,
	x : 226.0
}, {
	code : '686',
	country : 'Kiribati',
	y : 108.0,
	x : 390.0
}, {
	code : '850',
	country : 'Korea North',
	y : 54.0,
	x : 334.0
}, {
	code : '82',
	country : 'Korea South',
	y : 58.0,
	x : 334.0
}, {
	code : '965',
	country : 'Kuwait',
	y : 69.0,
	x : 234.0
}, {
	code : '996',
	country : 'Kyrgyz Republic',
	y : 52.0,
	x : 271.0
}, {
	code : '856',
	country : 'Laos',
	y : 84.0,
	x : 307.0
}, {
	code : '371',
	country : 'Latvia',
	y : 30.0,
	x : 210.0
}, {
	code : '961',
	country : 'Lebanon',
	y : 64.0,
	x : 222.0
}, {
	code : '266',
	country : 'Lesotho',
	y : 153.0,
	x : 214.0
}, {
	code : '231',
	country : 'Liberia',
	y : 101.0,
	x : 169.0
}, {
	code : '218',
	country : 'Libya',
	y : 75.0,
	x : 200.0
}, {
	code : '423',
	country : 'Liechtenstein',
	y : 44.0,
	x : 190.0
}, {
	code : '370',
	country : 'Lithuania',
	y : 32.0,
	x : 209.0
}, {
	code : '352',
	country : 'Luxembourg',
	y : 41.0,
	x : 187.0
}, {
	code : '853',
	country : 'Macau',
	y : 79.0,
	x : 317.0
}, {
	code : '389',
	country : 'Macedonia ',
	y : 52.0,
	x : 206.0
}, {
	code : '261',
	country : 'Madagascar',
	y : 140.0,
	x : 237.0
}, {
	code : '265',
	country : 'Malawi',
	y : 129.0,
	x : 221.0
}, {
	code : '60',
	country : 'Malaysia',
	y : 107.0,
	x : 316.0
}, {
	code : '960',
	country : 'Maldives',
	y : 105.0,
	x : 268.0
}, {
	code : '223',
	country : 'Mali Republic',
	y : 86.0,
	x : 175.0
}, {
	code : '356',
	country : 'Malta',
	y : 61.0,
	x : 197.0
}, {
	code : '692',
	country : 'Marshall Islands',
	y : 97.0,
	x : 384.0
}, {
	code : '596',
	country : 'Martinique',
	y : 90.0,
	x : 111.0
}, {
	code : '222',
	country : 'Mauritania',
	y : 82.0,
	x : 166.0
}, {
	code : '230',
	country : 'Mauritius',
	y : 140.0,
	x : 249.0
}, {
	code : '269',
	country : 'Mayotte Island',
	y : 128.0,
	x : 234.0
}, {
	code : '52',
	country : 'Mexico',
	y : 78.0,
	x : 66.0
}, {
	code : '691',
	country : 'Federated States of Micronesia',
	y : 101.0,
	x : 372.0
}, {
	code : '1808',
	country : 'Midway Islands',
	y : 71.0,
	x : -17.0
}, {
	code : '373',
	country : 'Moldova',
	y : 44.0,
	x : 215.0
}, {
	code : '377',
	country : 'Monaco',
	y : 50.0,
	x : 188.0
}, {
	code : '976',
	country : 'Mongolia',
	y : 46.0,
	x : 307.0
}, {
	code : '382',
	country : 'Montenegro',
	y : 51.0,
	x : 203.0
}, {
	code : '1664',
	country : 'Montserrat',
	y : 87.0,
	x : 110.0
}, {
	code : '212',
	country : 'Morocco',
	y : 65.0,
	x : 174.0
}, {
	code : '258',
	country : 'Mozambique',
	y : 137.0,
	x : 222.0
}, {
	code : '264',
	country : 'Namibia',
	y : 143.0,
	x : 200.0
}, {
	code : '674',
	country : 'Nauru',
	y : 110.0,
	x : 382.0
}, {
	code : '977',
	country : 'Nepal',
	y : 71.0,
	x : 282.0
}, {
	code : '31',
	country : 'Netherlands',
	y : 37.0,
	x : 186.0
}, {
	code : '599',
	country : 'Netherlands Antilles',
	y : 93.0,
	x : 104.0
}, {
	code : '687',
	country : 'New Caledonia',
	y : 141.0,
	x : 380.0
}, {
	code : '64',
	country : 'New Zealand',
	y : 171.0,
	x : 391.0
}, {
	code : '505',
	country : 'Nicaragua',
	y : 91.0,
	x : 85.0
}, {
	code : '227',
	country : 'Niger',
	y : 87.0,
	x : 189.0
}, {
	code : '234',
	country : 'Nigeria',
	y : 96.0,
	x : 189.0
}, {
	code : '683',
	country : 'Niue',
	y : 138.0,
	x : -8.0
}, {
	code : '672',
	country : 'Norfolk Island',
	y : 153.0,
	x : 383.0
}, {
	code : '1670',
	country : 'Northern Mariana Islands',
	y : 89.0,
	x : 356.0
}, {
	code : '47',
	country : 'Norway',
	y : 23.0,
	x : 192.0
}, {
	code : '968',
	country : 'Oman',
	y : 80.0,
	x : 249.0
}, {
	code : '92',
	country : 'Pakistan',
	y : 68.0,
	x : 265.0
}, {
	code : '680',
	country : 'Palau',
	y : 100.0,
	x : 343.0
}, {
	code : '507',
	country : 'Panama',
	y : 97.0,
	x : 90.0
}, {
	code : '675',
	country : 'Papua New Guinea',
	y : 119.0,
	x : 358.0
}, {
	code : '595',
	country : 'Paraguay',
	y : 144.0,
	x : 115.0
}, {
	code : '51',
	country : 'Peru',
	y : 125.0,
	x : 95.0
}, {
	code : '63',
	country : 'Philippines',
	y : 91.0,
	x : 328.0
}, {
	code : '48',
	country : 'Poland',
	y : 37.0,
	x : 204.0
}, {
	code : '351',
	country : 'Portugal',
	y : 55.0,
	x : 171.0
}, {
	code : '1787',
	country : 'Puerto Rico',
	y : 84.0,
	x : 106.0
}, {
	code : '974',
	country : 'Qatar',
	y : 75.0,
	x : 242.0
}, {
	code : '40',
	country : 'Romania',
	y : 46.0,
	x : 210.0
}, {
	code : '7',
	country : 'Russia',
	y : 26.0,
	x : 301.0
}, {
	code : '250',
	country : 'Rwandese Republic',
	y : 113.0,
	x : 216.0
}, {
	code : '685',
	country : 'Samoa',
	y : 129.0,
	x : -12.0
}, {
	code : '378',
	country : 'San Marino',
	y : 50.0,
	x : 194.0
}, {
	code : '239',
	country : 'Sao Tome and Principe',
	y : 108.0,
	x : 188.0
}, {
	code : '966',
	country : 'Saudi Arabia',
	y : 75.0,
	x : 234.0
}, {
	code : '221',
	country : 'Senegal',
	y : 90.0,
	x : 164.0
}, {
	code : '381',
	country : 'Serbia',
	y : 48.0,
	x : 205.0
}, {
	code : '248',
	country : 'Seychelles Republic',
	y : 116.0,
	x : 246.0
}, {
	code : '232',
	country : 'Sierra Leone',
	y : 98.0,
	x : 167.0
}, {
	code : '65',
	country : 'Singapore',
	y : 108.0,
	x : 305.0
}, {
	code : '421',
	country : 'Slovak Republic',
	y : 43.0,
	x : 203.0
}, {
	code : '386',
	country : 'Slovenia',
	y : 46.0,
	x : 197.0
}, {
	code : '677',
	country : 'Solomon Islands',
	y : 122.0,
	x : 373.0
}, {
	code : '252',
	country : 'Somali Democratic Republic',
	y : 96.0,
	x : 239.0
}, {
	code : '27',
	country : 'South Africa',
	y : 153.0,
	x : 209.0
}, {
	code : '34',
	country : 'Spain',
	y : 54.0,
	x : 175.0
}, {
	code : '94',
	country : 'Sri Lanka',
	y : 100.0,
	x : 278.0
}, {
	code : '249',
	country : 'Sudan',
	y : 89.0,
	x : 216.0
}, {
	code : '597',
	country : 'Suriname',
	y : 104.0,
	x : 117.0
}, {
	code : '268',
	country : 'Swaziland',
	y : 149.0,
	x : 217.0
}, {
	code : '46',
	country : 'Sweden',
	y : 23.0,
	x : 198.0
}, {
	code : '41',
	country : 'Switzerland',
	y : 44.0,
	x : 189.0
}, {
	code : '963',
	country : 'Syria',
	y : 61.0,
	x : 226.0
}, {
	code : '886',
	country : 'Taiwan',
	y : 78.0,
	x : 327.0
}, {
	code : '992',
	country : 'Tajikistan',
	y : 55.0,
	x : 266.0
}, {
	code : '255',
	country : 'Tanzania',
	y : 119.0,
	x : 222.0
}, {
	code : '66',
	country : 'Thailand',
	y : 89.0,
	x : 301.0
}, {
	code : '1868',
	country : 'Trinidad & Tobago',
	y : 94.0,
	x : 111.0
}, {
	code : '216',
	country : 'Tunisia',
	y : 62.0,
	x : 190.0
}, {
	code : '90',
	country : 'Turkey',
	y : 55.0,
	x : 222.0
}, {
	code : '993',
	country : 'Turkmenistan',
	y : 54.0,
	x : 253.0
}, {
	code : '1649',
	country : 'Turks and Caicos Islands',
	y : 80.0,
	x : 100.0
}, {
	code : '688',
	country : 'Tuvalu',
	y : 122.0,
	x : 396.0
}, {
	code : '256',
	country : 'Uganda',
	y : 108.0,
	x : 218.0
}, {
	code : '380',
	country : 'Ukraine',
	y : 41.0,
	x : 218.0
}, {
	code : '971',
	country : 'United Arab Emirates',
	y : 76.0,
	x : 245.0
}, {
	code : '44',
	country : 'United Kingdom',
	y : 34.0,
	x : 177.0
}, {
	code : '1',
	country : 'United States of America',
	y : 57.0,
	x : 71.0
}, {
	code : '598',
	country : 'Uruguay',
	y : 159.0,
	x : 117.0
}, {
	code : '998',
	country : 'Uzbekistan',
	y : 52.0,
	x : 257.0
}, {
	code : '678',
	country : 'Vanuatu',
	y : 134.0,
	x : 383.0
}, {
	code : '58',
	country : 'Venezuela',
	y : 98.0,
	x : 106.0
}, {
	code : '84',
	country : 'Vietnam',
	y : 87.0,
	x : 309.0
}, {
	code : '808',
	country : 'Wake Island',
	y : 83.0,
	x : 382.0
}, {
	code : '681',
	country : 'Wallis and Futuna ',
	y : 129.0,
	x : -16.0
}, {
	code : '967',
	country : 'Yemen',
	y : 89.0,
	x : 238.0
}, {
	code : '260',
	country : 'Zambia',
	y : 132.0,
	x : 216.0
}, {
	code : '263',
	country : 'Zimbabwe',
	y : 140.0,
	x : 216.0
} ];

window.onload = function() {
	var dlg = new CountryCodeDlg();
	dlg.open( function() {

	});
};
