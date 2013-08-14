function CEST_3D(config){
    
    //private object
    var Layer = function(opts){
        if(opts){
            this.zoomLevel = opts.zoomLevel;
            this.rowCount = opts.rowCount;
            this.colCount = opts.colCount;
            this.textures = opts.textures;
            this.materials = opts.materials;
            this.meshes = opts.meshes;
        }
    };
    
    this.createLayer = function(opts){
        return new Layer(opts);
    }
    
    // standard object variables
    this._container;
    this._scene;
    this._camera;
    this._renderer;
    this._controls;
    this._stats;
    this._parameters;
    this._keyboard = new THREEx.KeyboardState();
    this._clock = new THREE.Clock();

    
    // custom object variables
    this._layers = [];
    this._loadedTextureCount = 0;
    this._currentZoomLevel = 17;
    this._visibleMeshes = [];
    this._totalSize = 30000;
    
    //scene objects
    this._buildingArray = [];
    
    //file offsets due to map files selected for demonstration
    this._offsets = 
    {   '15' : {xOffset : 9346, yOffset : 12542},
        '16' : {xOffset : 18692, yOffset : 25084}, 
        '17' : {xOffset : 37384, yOffset : 50168},
        '18' : {xOffset : 74768, yOffset : 100336}
    };
    
    this.init();
}

CEST_3D.prototype = {
    init:function(){
    
        // SCENE
        this._scene = new THREE.Scene();
        
        // CAMERA
        var SCREEN_WIDTH = window.innerWidth; 
        var SCREEN_HEIGHT = window.innerHeight;
        var VIEW_ANGLE = 45; 
        var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT; 
        var NEAR = 0.1; 
        var FAR = 100000;
        
        this._camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
        this._scene.add(this._camera);
        this._camera.position.set(300,5000,0);
        this._camera.lookAt(this._scene.position);
        
        // RENDERER
        if ( Detector.webgl ){
            this._renderer = new THREE.WebGLRenderer( {antialias:true} );
        } else {
            this._renderer = new THREE.CanvasRenderer(); 
        }
        
        this._renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        this._container = document.getElementById( 'ThreeJS' );
        this._container.appendChild( this._renderer.domElement );
        // EVENTS
        THREEx.WindowResize(this._renderer, this._camera);
        THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
        // CONTROLS
        this._controls = new THREE.OrbitControls( this._camera, this._renderer.domElement );
        this._controls.userPanSpeed = 10.0;
        // STATS
        this._stats = new Stats();
        this._stats.domElement.style.position = 'absolute';
        this._stats.domElement.style.bottom = '0px';
        this._stats.domElement.style.zIndex = 100;
        this._container.appendChild( this._stats.domElement );
        // LIGHT
        var light = new THREE.PointLight(0xffffff);
        light.position.set(100,250,100);
        this._scene.add(light);
        
        
        //Layers
        this.makeLayers();
        
        // AXES
        var axes = new THREE.AxisHelper(100);
        this._scene.add( axes );
        
        // SKYBOX 
        var imagePrefix = "images/dawnmountain-";
        var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
        var imageSuffix = ".png";
        var skyGeometry = new THREE.CubeGeometry( 30000, 5000, 30000 );	
        
        var materialArray = [];
        for (var i = 0; i < 6; i++){
            materialArray.push( new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
                side: THREE.BackSide
            }));
        }
        
        var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
        var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
        skyBox.position.set(0, 2000, 0);
        this._scene.add( skyBox );
        ////////////
        // CUSTOM //
        ////////////

        //Custom limiting on orbit control
        this._controls.minPolarAngle = 0;
        this._controls.maxPolarAngle = (Math.PI / 2) - .1;
        this._controls.maxDistance = 24000;
        
        
        //buildings
        this.makeBuildings();
        
        //floorplan
        this.makeFloorPlan();
        
        //make sprites
        this.makeSprites();
       
    },
    
    makeLayers:function(){
    
        //avoid losing reference to this during callback of async functions
        var self = this;
    
        var layerCount = 4;
        
        var mapStartX = (this._totalSize / 2) * -1;
        var mapStartY = (this._totalSize / 2) * -1;
        
        
        var STYLE = '998';

        for(var i=0;i<layerCount;i++){
            //geometry - plane gets smaller with each increased zoom level
            var planeSize = (this._totalSize/3) / Math.pow(2, i);
            
            var geometry = new THREE.PlaneGeometry(planeSize, planeSize, 1, 1);
        
            //zoomLevel associated with each layer
            var zoomLevel = i+15;
            
            var xOffset = this._offsets[zoomLevel].xOffset;
            var yOffset = this._offsets[zoomLevel].yOffset
            
            //rowCount and colCount of grid
            var rowCount = 3 * Math.pow(2, i);
            var colCount = 3 * Math.pow(2, i);
        
            
            var textures = [];
            var materials = [];
            var meshes = [];
            for(var j = 0;j < rowCount;j++){
                var subArrayTextures = [];
                var subArrayMaterials = [];
                var subArrayMeshes = [];
                for(var k = 0;k<colCount;k++){
                    var fileUrl = 'mapfiles/' + STYLE + '/256/' + zoomLevel + '/' + (xOffset+j) + '/' + (yOffset+k) + '.png';
                    //console.log(fileUrl);
                    
                    //create textures
                    var texture = new THREE.ImageUtils.loadTexture(fileUrl, {}, function(){
                        //callback stuff
                        self._loadedTextureCount++;
                        
                        if(self._loadedTextureCount == 765){
                            self.animate(self);
                        }
                        //console.log(loadedTextureCount);
                    })
                    subArrayTextures.push(texture);
                    
                    //create materials
                    var material = new THREE.MeshBasicMaterial({map:texture});
                    subArrayMaterials.push(material);
                    
                    //create meshes
                    var mesh = new THREE.Mesh(geometry, material);
                    subArrayMeshes.push(mesh);
                    
                    //position and add to scene
                    mesh.rotation.x = Math.PI * 1.5;
                    mesh.position.x = (mapStartX + j*planeSize) + (planeSize/2);
                    mesh.position.z = (mapStartY + k*planeSize) + (planeSize/2);
                    if(zoomLevel != this._currentZoomLevel){
                        mesh.visible = false;
                    } else {
                        this._visibleMeshes.push(mesh);
                    }
                    this._scene.add(mesh);
                }
                textures.push(subArrayTextures);
                materials.push(subArrayMaterials);
                meshes.push(subArrayMeshes);
            }

            var opts = {
                zoomLevel : zoomLevel,
                rowCount : rowCount,
                colCount : colCount,
                textures : textures,
                materials : materials,
                meshes : meshes
            };
        
            
            var layer =  this.createLayer(opts);
            this._layers.push(layer);
        }
    },
    
    makeBuildings:function(){
        //apt building
    
        //Building textures
        var aptBuildingTexture = new THREE.ImageUtils.loadTexture( 'images/building_texture.jpg' );
        var aptRoofTexture = new THREE.ImageUtils.loadTexture('images/building_roof.jpg');
        
        
        //Building Materials
        var aptBuildingMaterials = [];
        
        var aptBuildingMaterial = new THREE.MeshBasicMaterial( { map: aptBuildingTexture } );
        var aptRoofMaterial = new THREE.MeshBasicMaterial({map: aptRoofTexture});
        var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x0066FF, wireframe: true, transparent: true } ); 
        
        aptBuildingMaterials.push(aptBuildingMaterial);
        aptBuildingMaterials.push(aptRoofMaterial);
        aptBuildingMaterials.push(wireframeMaterial);
        
        
        var aptBuildingGeometry = new THREE.CubeGeometry( 300, 300, 120, 1, 1, 1);
        
        //set material indices - aka, make the roof a different texture
        for(var i=0;i<6;i++){
            //2 is top
            if(i == 2){
                aptBuildingGeometry.faces[i].materialIndex = 1;
            } else {
                aptBuildingGeometry.faces[i].materialIndex = 0;
            }
        }
        
        var aptBuilding = new THREE.Mesh( aptBuildingGeometry, new THREE.MeshFaceMaterial(aptBuildingMaterials) );
        
        
        aptBuilding.position.set(-60, 150, -100);
        this._scene.add( aptBuilding );		
        this._buildingArray.push(aptBuilding);
        
        
        //skyscraper
        var skyscraperTexture = new THREE.ImageUtils.loadTexture( 'images/skyscraper_texture.jpg' );
        var skyscraperRoofTexture = new THREE.ImageUtils.loadTexture('images/building_roof.jpg');
        
        
        //Building Materials
        var skyscraperMaterials = [];
        
        var skyscraperMaterial = new THREE.MeshBasicMaterial( { map: skyscraperTexture } );
        var skyskcraperRoofMaterial = new THREE.MeshBasicMaterial({map: skyscraperRoofTexture});
        skyscraperMaterials.push(skyscraperMaterial);
        skyscraperMaterials.push(skyskcraperRoofMaterial);
        skyscraperMaterials.push(wireframeMaterial);
        
        
        var skyscraperGeometry = new THREE.CubeGeometry( 450, 900, 300, 16, 16, 16);
        //set material indices
        for(var i=0;i<skyscraperGeometry.faces.length;i++){
            //2 is top
            if(i == 2){
                skyscraperGeometry.faces[i].materialIndex = 0;
            } else {
                skyscraperGeometry.faces[i].materialIndex = 0;
            }
        }
        
        
        var skyscraperBuilding = new THREE.Mesh( skyscraperGeometry, new THREE.MeshFaceMaterial(skyscraperMaterials) );
        
        
        skyscraperBuilding.position.set(100, 450, 300);
        this._scene.add( skyscraperBuilding );		
        this._buildingArray.push(skyscraperBuilding);
        
    },
    
    makeSprites:function(){
        
        //desktop
        var computerIconTexture = THREE.ImageUtils.loadTexture( 'images/computer-icon.png' );
        var computerIconMaterial = new THREE.SpriteMaterial( { map: computerIconTexture, useScreenCoordinates: false} );
        var sprite = new THREE.Sprite( computerIconMaterial );
        sprite.position.set( 0, 135, 135 );
        sprite.scale.set( 32, 32, 1.0 ); // imageWidth, imageHeight
        this._scene.add( sprite );
        
        //laptop
        var laptopIconTexture = THREE.ImageUtils.loadTexture( 'images/laptop-icon.png' );
        var laptopIconMaterial = new THREE.SpriteMaterial( { map: laptopIconTexture, useScreenCoordinates: false} );
        var sprite2 = new THREE.Sprite( laptopIconMaterial );
        sprite2.position.set( -150, 250, -180 );
        sprite2.scale.set( 32, 32, 1.0 ); // imageWidth, imageHeight
        this._scene.add( sprite2 );
        
        //printer
        var printerIconTexture = THREE.ImageUtils.loadTexture( 'images/printer-icon.png' );
        var printerIconMaterial = new THREE.SpriteMaterial( { map: printerIconTexture, useScreenCoordinates: false} );
        var sprite3 = new THREE.Sprite( printerIconMaterial );
        sprite3.position.set( -10, 135, 235 );
        sprite3.scale.set( 32, 32, 1.0 ); // imageWidth, imageHeight
        this._scene.add( sprite3 );
        
        var sprite4 = new THREE.Sprite( printerIconMaterial );
        sprite4.position.set( 220, 135, 235 );
        sprite4.scale.set( 32, 32, 1.0 ); // imageWidth, imageHeight
        this._scene.add( sprite4 );
        
        var sprite5 = new THREE.Sprite( printerIconMaterial );
        sprite5.position.set( -10, 135, 335 );
        sprite5.scale.set( 32, 32, 1.0 ); // imageWidth, imageHeight
        this._scene.add( sprite5 );
        
        
        //projector
        var projectorIconTexture = THREE.ImageUtils.loadTexture( 'images/projector-icon.png' );
        var projectorIconMaterial = new THREE.SpriteMaterial( { map: projectorIconTexture, useScreenCoordinates: false} );
        var sprite6 = new THREE.Sprite( projectorIconMaterial );
        sprite6.position.set( -10, 535, 235 );
        sprite6.scale.set( 32, 32, 1.0 ); // imageWidth, imageHeight
        this._scene.add( sprite6 );
    },
    
    makeFloorPlan:function(){
            
        // floor 1
        var floorTexture = new THREE.ImageUtils.loadTexture( 'images/floorplan.png' );
        var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
        var floorGeometry = new THREE.PlaneGeometry(440, 290, 1, 1);
        var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.set(100, 119, 300);
        floor.rotation.x = Math.PI * 1.5;
        
        this._scene.add(floor);
        
        //floor 2
        var floor2 = new THREE.Mesh(floorGeometry, floorMaterial);
        floor2.position.set(100, 519, 300);
        floor2.rotation.x = Math.PI * 1.5;
        this._scene.add(floor2);
    },
    
    animate:function(){
        //.bind function is necessary because 'this' reference becomes the window instead of this object after animate is called by the browser.
        // not supported in all browsers. see - http://kangax.github.io/es5-compat-table/#Function.prototype.bind
        requestAnimationFrame( this.animate.bind(this) );
        this.render();
        this.update();
    },
    
    update:function(){
        if ( this._keyboard.pressed("z") ) 
        {
            console.log(this._camera.position);
        }
        
        this._controls.update();
        this._camera.up = new THREE.Vector3(0,1,0);
        this._stats.update();
        
        //document.getElementById('infoBox').innerHTML = 'Camera Height: ' + camera.position.y + '\n\n' + 'Camera Dist: ' + getCameraDistance();
        this.updateZoomLevel();
    },
    
    updateBuilding:function(value){
        //swapping materials around for when material type of skyscraper is changed
        if(value == "Texture"){
            var swapMaterial = this._buildingArray[1].material.materials[0]
            this._buildingArray[1].material.materials[0] = this._buildingArray[1].material.materials[2];
            this._buildingArray[1].material.materials[2] = swapMaterial;
        } else if(value == "Wireframe"){
            var swapMaterial = this._buildingArray[1].material.materials[0]
            this._buildingArray[1].material.materials[0] = this._buildingArray[1].material.materials[2];
            this._buildingArray[1].material.materials[2] = swapMaterial;
        }
    },
    
    render:function(){
        this._renderer.render( this._scene, this._camera );
    },
    
    getCameraDistance:function(){
        //gets the camera distance from its anchor that it orbits around
        //this is used to define the zoom levels
        var x = this._camera.position.x - this._controls.center.x;
        var y = this._camera.position.y - this._controls.center.y;
        var z = this._camera.position.z - this._controls.center.z;
       
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
    },
    
    updateZoomLevel:function(){
        var dist = this.getCameraDistance();
        var level = 18 - Math.floor((dist)/(this._totalSize / 3));
        if (level < this._currentZoomLevel){
            this._currentZoomLevel--;
            
            //swaps out loaded texture layers
            if(this._currentZoomLevel >= 15){
                this.swapLayer();
            }
        } else if (level > this._currentZoomLevel){
            this._currentZoomLevel++;
            
            //swaps out loaded texture layers
            if(this._currentZoomLevel >= 15){
                this.swapLayer();
            }
        }       
    },
    
    swapLayer:function(){
        //set old meshes to invisible
        var count = this._visibleMeshes.length;
        for(var i=0;i<count;i++){
            this._visibleMeshes.shift().visible = false;
        }
        
        var newLayerIndex = this._currentZoomLevel - 15;
        
        for(var i=0;i<this._layers[newLayerIndex].rowCount;i++){
            for(var j=0;j<this._layers[newLayerIndex].colCount;j++){
                this._layers[newLayerIndex].meshes[i][j].visible = true;
                this._visibleMeshes.push(this._layers[newLayerIndex].meshes[i][j]);
            }
        }
    }
}




