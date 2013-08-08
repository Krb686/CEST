function CEST(config){
    
    //private var
    var _resources = {
        icons: {
        
        
        }
    };
    _resources.icons.routerIcon = L.AwesomeMarkers.icon({
        icon: 'icon-bar-chart',
        color: 'darkred'
    });
    
    _resources.icons.tvIcon = L.AwesomeMarkers.icon({
        icon: 'icon-desktop',
        color: 'green'
    });
    
    //privileged method
    this.getResources = function(){
        return _resources;
    }
    
    this.init(config);
}

CEST.prototype = {
    init: function(config){
        this.map = new L.map('map').setView([38.83, -77.305], 15);
    
        config = config || {};
        this.tileSource = config.tileSource || 'remote';
        this.style = config.style || '998';
        this.devices = config.devices || [];
        
        
        if(this.tileSource == 'local'){
            L.tileLayer('mapfiles/' + this.style +  '/256/{z}/{x}/{y}.png', {
                maxZoom: 18,
                minZoom: 15,
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
            }).addTo(this.map);
        } else if (this.tileSource == 'remote'){
            L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/' + this.style + '/256/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
            }).addTo(this.map);
        }
    
        this.markers = new L.MarkerClusterGroup();
        this.map.addLayer(this.markers);
        this.loadPlugins();
        
        this.popupHTML = "<div class='detail-popup-info'>" + 
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
                                "<table class='popupTable'>" + 
                                    "<tr>" + 
                                        "<td>" + 
                                            "<ul>" + 
                                                "<li><b>Cisco E2100L</li>" + 
                                            "</ul" + 
                                        "</td>" + 
                                        "<td>" + 
                                            "<ul>" + 
                                            "</ul" + 
                                        "</td>" +
                                    "</tr>" + 
                                    "<tr>" + 
                                        "<td>" + 
                                            "<ul>" + 
                                                "<li><b>ID: 134de92c178</li>" + 
                                            "</ul" + 
                                        "</td>" + 
                                        "<td class='tdImg'>" + 
                                            "<img class='routerImage' src='/images/cisco_e2100l.gif' style='height:128px;width:128px;text-align:center;'></img>" + 
                                        "</td>" +
                                    "</tr>" + 
                                    "<tr>" + 
                                        "<td>" + 
                                            "<ul>" + 
                                                "<li><b>Enterprise Hall</li>" + 
                                            "</ul" + 
                                        "</td>" + 
                                        "<td>" + 
                                            "<ul>" + 
                                            "</ul" + 
                                        "</td>" +
                                    "</tr>" + 
                                "</table>" + 
                            "</div>" + 
                            "<div id='tabInfo'>" + 
                                "<p>Info</p>" + 
                            "</div>" +
                        "</div>";
        
        //Setup jquery event listener to make tabs for popups
        $(window).load(function() {
            this.cest.map.on('popupopen', function() {
                $( ".detail-popup-info" ).tabs();
            });
            this.cest.visible = true;
            
            setInterval(function(){
                if(this.cest.visible == true){
                    //
                    $('#map').css("display","none");
                    $('#3dContainer').css("display", "block");
                    console.log('made invisible');
                    this.cest.visible = false;
                } else { 
                    //
                    $('#map').css("display","block");
                    $('#3dContainer').css("display", "none");
                    console.log("made visible");
                    this.cest.visible = true;
                }
            }, 5000);
            
        });
    
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
        var searchControl = new L.Control.Search({layer: featuresLayer, propertyName: "name", animateLocation:false, circleLocation:false});
        this.map.addControl(searchControl);
        //this.sampleSearchControl();
    },
    sampleSearchControl: function(){
        var data = buildingData;
        var testLayer = L.geoJson();
        var featuresLayer = new L.geoJson(data);
        this.map.addLayer(featuresLayer);
        var searchControl = new L.Control.Search({layer: featuresLayer, propertyName: 'name', circleLocation:false});
        this.map.addControl( searchControl);
    }, 
    update : function(){
        //
        //general purpose update
    },
    updateDevices: function(data){
        for(var i=0;i<data.length;i++){
            this.devices.push(data[i]);
        }
        
        this.markDevices(data);
    },
    markDevices: function(data){
        var resources = this.getResources();
        
        for(var i=0;i<data.length;i++){
            var device = data[i];
            
            if(device.type == 'Router'){
                var newMarker = new L.Marker([device.properties.location.lat, device.properties.location.lng], {icon:resources.icons.routerIcon});
                var popup = L.popup({maxWidth:385}).setContent(this.popupHTML);
                newMarker.bindPopup(popup);
                this.markers.addLayer(newMarker);
            } else if(device.type == 'Television'){
                var newMarker = new L.Marker([device.properties.location.lat, device.properties.location.lng], {icon:resources.icons.tvIcon});
                var popup = L.popup({maxWidth:385}).setContent(this.popupHTML);
                newMarker.bindPopup(popup);
                this.markers.addLayer(newMarker);
            
            }
        } 
    }
    
    
}


