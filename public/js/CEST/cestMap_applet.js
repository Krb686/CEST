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
        this.displayType = config.displayType || '2.5D';
        
        
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
                        
        //GUI
        this.gui = new dat.GUI();
        
        
        parameters = 
        {
            a: 200, // numeric
            b: 200, // numeric slider
            c: "Hello, GUI!", // string
            d: false, // boolean (checkbox)
            e: "#ff8800", // color (hex)
            f: function() { alert("Hello!") },
            g: function() { alert( parameters.c ) },
            v : 0,    // dummy value, only type is important
            w: "...", // dummy value, only type is important
            x: 50, y: 0, z: 0,
            display:'2.5D',
            material: "Texture"
        };
        
        /*
        // gui.add( parameters )
        this.gui.add( parameters, 'a' ).name('Number');
        this.gui.add( parameters, 'b' ).min(128).max(256).step(16).name('Slider');
        this.gui.add( parameters, 'c' ).name('String');
        this.gui.add( parameters, 'd' ).name('Boolean');
        
        this.gui.addColor( parameters, 'e' ).name('Color');
        
        var numberList = [1, 2, 3];
        this.gui.add( parameters, 'v', numberList ).name('List');
        
        var stringList = ["One", "Two", "Three"];
        this.gui.add( parameters, 'w', stringList ).name('List');
        
        this.gui.add( parameters, 'f' ).name('Say "Hello!"');
        this.gui.add( parameters, 'g' ).name("Alert Message");
        
        
        var folder1 = this.gui.addFolder('Coordinates');
        folder1.add( parameters, 'x' );
        folder1.add( parameters, 'y' );
        */
        
        
        var displayChanger = this.gui.add(parameters, 'display', ['2.5D', '3D']).name('Display Type').listen();
        var that = this;
        displayChanger.onChange(function(value){
            that.changeDisplay(value);
        });
        
        
        var cubeMaterial = this.gui.add(parameters, 'material', [ "Texture", "Wireframe" ] ).name('Material Type').listen();
        cubeMaterial.onChange(function(value){
            console.log('hey');
            updateBuilding();   
        });
        
        //folder1.close();
        this.gui.open();
        
        //Setup jquery event listener to make tabs for popups
        $(window).load(function() {
            this.cest.map.on('popupopen', function() {
                $( ".detail-popup-info" ).tabs();
            });
            this.cest.visible = true;
            /*
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
            */
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
        var data = data[0].devices;
        console.log(data);
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
    },
    changeDisplay: function(value){
        if(value != this.displayType){
            if(value == '2.5D'){
                //
                $('#map').css("display","block");
                $('#3dContainer').css("display", "none");
                this.displayType = '2.5D';
            } else if (value == '3D'){
                //
                $('#map').css("display","none");
                $('#3dContainer').css("display", "block");
                this.displayType = '3D';
            }
        }
    }
}


