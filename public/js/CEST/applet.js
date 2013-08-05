function CEST(config){
    this.init(config);
}

CEST.prototype = {
    init: function(config){
        this.map = new L.map('map').setView([38.83, -77.305], 15);
        this.devices = [];
    
    
        config = config || {};
        config.tileSource = config.tileSource || 'remote';
        config.style = config.style || '998';
        
        if(config.tileSource == 'local'){
            L.tileLayer('mapfiles/' + config.style +  '/256/{z}/{x}/{y}.png', {
                maxZoom: 18,
                minZoom: 15,
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
            }).addTo(this.map);
        } else if (config.tileSource == 'remote'){
            L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/' + config.style + '/256/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
            }).addTo(this.map);
        }
    
        this.loadPlugins();
        this.loadDevices();
        
        //Setup jquery event listener to make tabs for popups
        $(window).load(function() {
            this.cest.map.on('popupopen', function() {
                $( ".detail-popup-info" ).tabs();
            });
        });
    
    },
    
    loadDevices: function(){
    
        var deviceCount = 5;
    
        //var el = document.createElement('div');
        var popupHTML = "<div class='detail-popup-info'>" + 
                            "<ul>" + 
                                "<li>" + 
                                    "<a href='#tabDevice'>" + 
                                        "<span>Device</span>" + 
                                    "</a>" + 
                                "</li>" + 
                                "<li>" + 
                                    "<a href='#tabInfo'>" + 
                                        "<span>Info</span>" + 
                                    "</a>" + 
                                "</li>" + 
                            "</ul>" + 
                            "<div id='tabDevice'>" + 
                                "<p>Device</p>" + 
                            "</div>" + 
                            "<div id='tabInfo'>" + 
                                "<p>Info</p>" + 
                            "</div>" +
                        "</div>";
                                
    
        var device1 = {
            'name': 'Cisco Wireless Router',
            'type': 'Router',
            'id' : '134de92c178',
            'mfc' : 'Cisco',
            'model' : 'E1000',
            'properties': {
                'ip' : '192.168.1.12',
                'mac' : '22-DC-C4-92-4D-BE',
                'status' : 'Good',
                'location' : {
                    'lat' : 38.82905,
                    'lng' : -77.30622
                }
            }
        };
        
       
        this.devices.push(device1);
        
        
        this.markers = new L.MarkerClusterGroup();
        for(var i=0;i<this.devices.length;i++){
            var device = this.devices[i];
            
            if(device.type == 'Router'){
                var routerIcon = L.AwesomeMarkers.icon({
                    icon: 'icon-signal',
                    color: 'darkred'
                });
                
                var newMarker = new L.Marker([device.properties.location.lat, device.properties.location.lng], {icon:routerIcon});
                newMarker.bindPopup(popupHTML);
                this.markers.addLayer(newMarker);
                
            }
        }
        
        
        this.map.addLayer(this.markers);
    
        
    },
    
    loadPlugins: function(){
    
        //Fullscreen control
        L.control.fullscreen({
          position: 'topleft',
          title: 'Show me the fullscreen !',
          forceSeparateButton: true
        }).addTo(this.map);
        
        //Coordinates control
        L.control.coordinates({
            position:"bottomleft", //optional default "bottomright"
            decimals:5, //optional default 4
            decimalSeperator:".", //optional default "."
            labelTemplateLat:"Latitude: {y}", //optional default "Lat: {y}"
            labelTemplateLng:"Longitude: {x}", //optional default "Lng: {x}"
            enableUserInput:true, //optional default true
            useDMS:false, //optional default false
            useLatLngOrder: true //ordering of labels, default false-> lng-lat
        }).addTo(this.map);
        
        //OSM
        var osmBuildings = new OSMBuildings(this.map).setData(buildingData);
        var featuresLayer = L.geoJson(buildingData);
        featuresLayer.setStyle({stroke:false, fill:false});
        
        //leaflet-search
        this.map.addControl( new L.Control.Search({layer: featuresLayer, propertyName: "name", animateLocation:false, circleLocation:false}) );
    }
}


