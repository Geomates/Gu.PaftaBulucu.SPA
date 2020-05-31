L.Control.QueryCoordinatesTool = L.Control.extend({
    options: {
        position: 'topright'
    },
    initialize: function(options) {
        L.setOptions(this, options);
        this.map    = null;
        this.active = false;
    },
    onAdd: function (map) {
        this.map = map;
        this.active = false;

        this.controlDiv = L.DomUtil.create('div', 'leaflet-control-querycoordinates leaflet-bar');
        this.controlDiv.control   = this;
        this.controlDiv.title     = 'Harita üzerinde bir noktanın paftasını sorgulamak için tıklayın.';
        this.controlDiv.innerHTML = ' ';
        L.DomEvent
            .addListener(this.controlDiv, 'mousedown', L.DomEvent.stopPropagation)
            .addListener(this.controlDiv, 'click', L.DomEvent.stopPropagation)
            .addListener(this.controlDiv, 'click', L.DomEvent.preventDefault)
            .addListener(this.controlDiv, 'click', function () {
                this.control.toggleState();
            });

        this.setStateOff();
        this.controlIcon = L.DomUtil.create('a', 'leaflet-control-querycoordinates-icon', this.controlDiv);

        return this.controlDiv;
    },

    toggleState: function () {
        this.active ? this.setStateOff() : this.setStateOn();
    },

    setStateOn: function () {
        L.DomUtil.addClass(this.controlIcon,'leaflet-control-querycoordinates-active');
        this.active = true;
        this.map.dragging.disable();
        if (!this.options.enableShiftDrag) {
            this.map.boxZoom.addHooks();
        }

        this.map.on('click', this.options.handleClick, this);

        L.DomUtil.addClass(this.map._container,'leaflet-control-querycoordinates-active-map-icon');
    },

    setStateOff: function () {
        if (this.controlIcon)
        {
            L.DomUtil.removeClass(this.controlIcon,'leaflet-control-querycoordinates-active');
        }        
        this.active = false;
        this.map.off('click', this.options.handleClick, this);
        this.map.off('click', this.toggleState, this);
        this.map.dragging.enable();
        L.DomUtil.removeClass(this.map._container,'leaflet-control-querycoordinates-active-map-icon');
    }
});

L.Control.queryCoordinatesTool = function(options) {
    return new L.Control.QueryCoordinatesTool(options);
}