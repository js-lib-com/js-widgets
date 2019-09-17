$package('js.widget');

/**
 * Geographical map based on Google Maps API.
 * <h6>Events</h6>
 * Custom events fired by geographical map.
 * <p>
 * <table style="border-collapse:collapse;" border="1">
 * <tr>
 * <td><b>Type
 * <td><b>Trigger
 * <td><b>Event Parameter
 * <tr>
 * <td>marker-click
 * <td>click on map marker
 * <td>{@link js.widget.GeoMap.Location} object designated by the clicked marker</td>
 * </table>
 * 
 * @author Iulian Rotaru
 * @constructor Construct geographical map instance.
 * @param Document ownerDoc owner document,
 * @param Node node native node.
 */
js.widget.GeoMap = function (ownerDoc, node) {
    this.$super(ownerDoc, node);

    /**
     * Map options. These options are used by defaults but part of them . Note that not all Google map options are
     * supported.
     * 
     * @type js.widget.GeoMap.Options
     */
    this._options = new js.widget.GeoMap.Options();

    if (this._config.mapType) {
        this._options.mapTypeControl = true;
    }
    if (this._config.streetView) {
        this._options.streetViewControl = true;
    }
    if (this._config.zoom) {
        this._options.zoom = this._config.zoom;
    }

    /**
     * Custom events. See class description for supported custom events.
     * 
     * @type js.event.CustomEvents
     */
    this._events = this.getCustomEvents();
    this._events.register("marker-click");

    /**
     * Google map instance.
     * 
     * @type google.maps.Map
     */
    this._map = null;

    /**
     * Markers storage.
     * 
     * @type Array
     */
    this._markers = [];
};

js.widget.GeoMap.prototype = {
    /**
     * Default zoom level for empty map.
     * 
     * @type Number
     */
    EMPTY_MAP_ZOOM : 1,

    /**
     * Default zoom level for map with a single location.
     * 
     * @type Number
     */
    ONE_LOCATION_ZOOM : 8,

    /**
     * Custom view setter for template engine. This method is invoked by template engine and is responsible for dynamic
     * content injection. It has a single, type variant argument: array, object, null or undefined. If <code>null</code>
     * or <code>undefined</code>, created map is empty. Otherwise this method expect
     * {@link js.widget.GeoMap.Location} objects and created map will be populated with location markers.
     * <p>
     * If there are more than one location, map compute locations boundaries and adjust zoom level accordingly. For one
     * or no location zoom adjustment is not possible and map uses default values, see {@link #ONE_LOCATION_ZOOM} and
     * {@link #EMPTY_MAP_ZOOM}.
     * 
     * @param Object locations array or a single instance of {@link js.widget.GeoMap.Location} object(s), null and
     *        undefined accepted.
     */
    setObject : function (locations) {
        locations = this._normalizeLocations(locations);
        this._markers.length = 0;

        switch (locations.length) {
        case 0:
            this._createEmptyMap();
            break;

        case 1:
            this._createOnePlaceMap(locations[0]);
            break;

        default:
            this._createManyPlacesMap(locations);
        }
    },

    /**
     * Create empty map. Uses {@link #EMPTY_MAP_ZOOM} for zoom level, centered on (0, 0) geographical coordinates.
     */
    _createEmptyMap : function () {
        this._options.zoom = this.EMPTY_MAP_ZOOM;
        this._options.center = new google.maps.LatLng(0, 0);
        this._map = new google.maps.Map(this._node, this._options);
    },

    /**
     * Create map and a location mark. Uses {@link #ONE_LOCATION_ZOOM} for zoom level, centered on given location
     * coordinates.
     * 
     * @param js.widget.GeoMap.Location location location object.
     */
    _createOnePlaceMap : function (location) {
        this._options.zoom = this.ONE_LOCATION_ZOOM;
        this._options.center = new google.maps.LatLng(location.latitude, location.longitude);
        this._map = new google.maps.Map(this._node, this._options);
        this._markers = [ new js.widget.GeoMap.Marker(this, location) ];
    },

    /**
     * Create the map and populate it with location markers. Compute bounds of the given locations and adjust map zoom
     * level to fit.
     * 
     * @param Array locations array of {@link js.widget.GeoMap.Location} objects.
     */
    _createManyPlacesMap : function (locations) {
        var bounds, marker;

        bounds = new google.maps.LatLngBounds();
        this._map = new google.maps.Map(this._node, this._options);

        locations.forEach(function (location) {
            marker = new js.widget.GeoMap.Marker(this, location);
            this._markers.push(marker);
            bounds.extend(marker.getPosition());
        }, this);

        google.maps.event.addListener(this._map, 'bounds_changed', function () {
            if (this._map.getZoom() > this.ONE_PLACE_ZOOM) {
                this._map.setZoom(this.ONE_PLACE_ZOOM);
            }
        }.bind(this));
        this._map.fitBounds(bounds);
    },

    /**
     * Click handler for all this map markers. This handler is invoked on any marker click. It just fires
     * <code>marker-click</code> custom event with {@link js.widget.GeoMap.Location} object designated by clicked
     * marker.
     * 
     * @param js.widget.GeoMap.Marker marker target marker object.
     */
    _onMarkerClick : function (marker) {
        this._events.fire("marker-click", marker.getLocation());
    },

    /**
     * Get rid of undefined, null or empty locations. Empty location is one with both latitude and longitude set to
     * zero. This assumption is not strictly correct because zero latitude and longitude is in fact a valid coordinate;
     * anyway is somewhere into Atlantic.
     * <p>
     * Return empty array if <code>locations</code> is null or undefined.
     * 
     * @param Object locations array of locations or single location object. It should have <code>latitude</code> and
     *        <code>longitude</code> properties, from which at least one should be not zero.
     * @return Array normalized locations. Note that this method returns an array of locations even if supplied argument
     *         is and object.
     */
    _normalizeLocations : function (locations) {
        var normalizedLocations, it, location;

        normalizedLocations = [];
        it = new js.lang.Uniterator(locations);
        while (it.hasNext()) {
            location = it.next();
            if (location && (location.latitude || location.longitude)) {
                normalizedLocations.push(location);
            }
        }
        return normalizedLocations;
    },

    /**
     * String representation of this geographical map instance.
     * 
     * @type String
     */
    toString : function () {
        return "js.widget.GeoMap";
    }
};
$extends(js.widget.GeoMap, js.dom.Element);

/**
 * Geographical map options. These options are the defaults used by {@link js.widget.GeoMap} class.
 * 
 * @author Iulian Rotaru
 * @constructor Construct map options instance.
 */
js.widget.GeoMap.Options = function () {
    /**
     * The initial enabled/disabled state of the Map type control. Default to false.
     * 
     * @type Boolean
     */
    this.mapTypeControl = false;

    /**
     * The initial enabled/disabled state of the Scale control. Default to false.
     * 
     * @type Boolean
     */
    this.scaleControl = false;

    /**
     * The initial enabled/disabled state of the Street View Pegman control. This control is part of the default UI, and
     * should be set to false when displaying a map type on which the Street View road overlay should not appear (e.g. a
     * non-Earth map type). Default to false.
     * 
     * @type Boolean
     */
    this.streetViewControl = false;

    /**
     * The enabled/disabled state of the Rotate control. Default to false.
     * 
     * @type Boolean
     */
    this.rotateControl = false;

    /**
     * The enabled/disabled state of the Pan control. Default to false.
     * 
     * @type Boolean
     */
    this.panControl = false;

    /**
     * The initial Map mapTypeId. Defaults to ROADMAP.
     * 
     * @type google.maps.MapTypeId
     */
    this.mapTypeId = google.maps.MapTypeId.ROADMAP;

    /**
     * If false, disables scroll wheel zooming on the map. The scroll wheel is disabled by default.
     * 
     * @type Boolean
     */
    this.scrollwheel = false;

    /**
     * The enabled/disabled state of the Zoom control. Zoom control is enabled by default.
     * 
     * @type Boolean
     */
    this.zoomControl = true;
};
$extends(js.widget.GeoMap.Options, Object);

/**
 * A location has geographical coordinates and address and is represented on map as a marker sign.
 * 
 * @author Iulian Rotaru
 * @constructor Construct location instance.
 */
js.widget.GeoMap.Location = function () {
    /**
     * Location geographical latitude, default value 0.
     * 
     * @type Number
     */
    this.latitude = 0;

    /**
     * Location geographical longitude, default value 0.
     * 
     * @type Number
     */
    this.longitude = 0;

    /**
     * Location address, default to empty string.
     * 
     * @type String
     */
    this.address = "";
};

js.widget.GeoMap.Location.prototype = {
    /**
     * String representation of this location instance.
     * 
     * @type String
     */
    toString : function () {
        return "js.widget.GeoMap.Location";
    }
};
$extends(js.widget.GeoMap.Location, Object);

/**
 * Map marker represent a {@link js.widget.GeoMap.Location} on the map.
 * 
 * @author Iulian Rotaru
 * @constructor Construct map marker instance.
 * @param js.widget.GeoMap geoMap parent map,
 * @param js.widget.GeoMap.Location location location to be represented by this marker.
 */
js.widget.GeoMap.Marker = function (geoMap, location) {
    /**
     * Location reference.
     * 
     * @type js.widget.GeoMap.Location
     */
    this._location = location;

    var opts = {
        map : geoMap._map,
        position : new google.maps.LatLng(location.latitude, location.longitude),
        draggable : false,
        title : location.address
    };
    google.maps.Marker.call(this, opts);

    google.maps.event.addListener(this, "click", function () {
        geoMap._onMarkerClick(this);
    }.bind(this));
};

js.widget.GeoMap.Marker.prototype = {
    /**
     * Get the location object represented by this marker.
     * 
     * @return js.widget.GeoMap.Location this marker location.
     */
    getLocation : function () {
        return this._location;
    },

    /**
     * String representation of this marker instance.
     * 
     * @type String
     */
    toString : function () {
        return "js.widget.GeoMap.Marker";
    }
};
$extends(js.widget.GeoMap.Marker, google.maps.Marker);
