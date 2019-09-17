$package('js.widget');

$import('js.dom.Element');

/**
 * Google geographical map adapter.
 *
 * @constructor
 * Construct a geographical map adapter.
 *
 * @param js.dom.Document ownerDoc, this geographical map parent document
 * @param Node node, wrapped DOM node
 */
js.widget.GeoMapCtrl = function(ownerDoc, node) {
    this.$super(ownerDoc, node);
};

js.widget.GeoMapCtrl.prototype =
{
    set: function(place) {
        if (place && place.latitude && place.longitude) {
            this._location = new google.maps.LatLng(place.latitude, place.longitude);
            this._createMap(6, this._location);
            this._createMarker(this._location);
        }
        else {
            this._location = new google.maps.LatLng(0, 0);
            this._createMap(1, this._location);
            this._createMarker();
        }
        return this;
    },

    get: function() {
        return this._location ? {
            latitude: this._location.lat(),
            longitude: this._location.lng()
        } : null;
    },

    reset: js.lang.NOP,

    locate: function(address) {
        if (!this._geocoder) {
            this._geocoder = new google.maps.Geocoder();
        }

        var _this = this;
        this._geocoder.geocode(
        {
            address: address
        }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                _this._location = results[0].geometry.location;
                _this._createMap(6, _this._location);
                _this._createMarker(_this._location);
            }
        });
    },

    _createMap: function(zoom, location) {
        if (!this._map) {
            this._map = new google.maps.Map(this._node,
            {
                mapTypeControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scaleControl: true,
                scrollwheel: false
            });
        }
        this._map.setZoom(zoom);
        this._map.setCenter(location);
    },

    _createMarker: function(location) {
        if (!this._marker) {
            this._marker = new google.maps.Marker(
            {
                map: this._map
            });
        }
        if (location) {
            this._marker.setPosition(location);
        }
        this._marker.setVisible(typeof location !== 'undefined');
    }
};
$extends(js.widget.GeoMapCtrl, js.dom.Element);
