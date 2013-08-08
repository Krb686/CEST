/*
	Three.js "tutorials by example"
	Author: Lee Stemkoski
	Date: July 2013 (three.js v59dev)
 */

// MAIN

var Layer = function(opts){
    if(opts){
        this.zoomLevel = opts.zoomLevel;
        this.rowCount = opts.rowCount;
        this.colCount = opts.colCount;
        this.textures = opts.textures;
        this.materials = opts.materials;
        this.meshes = opts.meshes;
    }
}

// standard global variables
var container, scene, camera, renderer, controls, stats, parameters;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();


// custom global variables
var layers = [];
var loadedTextureCount = 0;
var currentZoomLevel = 17;
var zoomLevelUpdated = false;
var cameraDistance = 0;
var visibleMeshes = [];
var totalSize = 30000;


//scene objects
var buildingArray = [];

//file offsets
var offsets = 
{   '15' : {xOffset : 9346, yOffset : 12542},
    '16' : {xOffset : 18692, yOffset : 25084}, 
    '17' : {xOffset : 37384, yOffset : 50168},
    '18' : {xOffset : 74768, yOffset : 100336}
}

                    
init();

function checkLoadedTextures(){
    if(loadedTextureCount < 765){
        setTimeout(checkLoadedTextures);
    } else {
        animate();
    }
}


function createLayers(){

    var layerCount = 4;
    
    
    
    var mapStartX = (totalSize / 2) * -1;
    var mapStartY = (totalSize / 2) * -1;
    
    
    var STYLE = '998';

    for(var i=0;i<layerCount;i++){
        //geometry - plane gets smaller with each increased zoom level
        var planeSize = (totalSize/3) / Math.pow(2, i);
        
        var geometry = new THREE.PlaneGeometry(planeSize, planeSize, 1, 1);
    
        //zoomLevel associated with each layer
        var zoomLevel = i+15;
        
        var xOffset = offsets[zoomLevel].xOffset;
        var yOffset = offsets[zoomLevel].yOffset
        
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
                    loadedTextureCount++;
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
                if(zoomLevel != currentZoomLevel){
                    mesh.visible = false;
                } else {
                    visibleMeshes.push(mesh);
                }
                scene.add(mesh);
            }
            textures.push(subArrayTextures);
            materials.push(subArrayMaterials);
            meshes.push(subArrayMeshes);
        }

    
    
        
        var layer =  new Layer({
            zoomLevel : zoomLevel,
            rowCount : rowCount,
            colCount : colCount,
            textures : textures,
            materials : materials,
            meshes : meshes
            
        });
        layers.push(layer);
    }
    
    
    
    console.log(layers);
}


function makeGUI(){
    //GUI
    var gui = new dat.GUI();
	
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
        material: "Texture"
	};
	// gui.add( parameters )
	gui.add( parameters, 'a' ).name('Number');
	gui.add( parameters, 'b' ).min(128).max(256).step(16).name('Slider');
	gui.add( parameters, 'c' ).name('String');
	gui.add( parameters, 'd' ).name('Boolean');
	
	gui.addColor( parameters, 'e' ).name('Color');
	
	var numberList = [1, 2, 3];
	gui.add( parameters, 'v', numberList ).name('List');
	
	var stringList = ["One", "Two", "Three"];
	gui.add( parameters, 'w', stringList ).name('List');
	
	gui.add( parameters, 'f' ).name('Say "Hello!"');
	gui.add( parameters, 'g' ).name("Alert Message");
    
	
	var folder1 = gui.addFolder('Coordinates');
	folder1.add( parameters, 'x' );
	folder1.add( parameters, 'y' );
    
    var cubeMaterial = gui.add( parameters, 'material', [ "Texture", "Wireframe" ] ).name('Material Type').listen();
	cubeMaterial.onChange(function(value) 
	{   updateBuilding();   });
    
	folder1.close();
	gui.open();
}

function makeBuildings(){
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
    //set material indices
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
	scene.add( aptBuilding );		
    buildingArray.push(aptBuilding);
    
    
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
	scene.add( skyscraperBuilding );		
    buildingArray.push(skyscraperBuilding);
}


function makeSprites(){

    //desktop
    var computerIconTexture = THREE.ImageUtils.loadTexture( 'images/computer-icon.png' );
    var computerIconMaterial = new THREE.SpriteMaterial( { map: computerIconTexture, useScreenCoordinates: false} );
	var sprite = new THREE.Sprite( computerIconMaterial );
	sprite.position.set( 0, 135, 135 );
	sprite.scale.set( 32, 32, 1.0 ); // imageWidth, imageHeight
	scene.add( sprite );
    
    //laptop
    var laptopIconTexture = THREE.ImageUtils.loadTexture( 'images/laptop-icon.png' );
    var laptopIconMaterial = new THREE.SpriteMaterial( { map: laptopIconTexture, useScreenCoordinates: false} );
	var sprite2 = new THREE.Sprite( laptopIconMaterial );
	sprite2.position.set( -150, 250, -180 );
	sprite2.scale.set( 32, 32, 1.0 ); // imageWidth, imageHeight
	scene.add( sprite2 );
    
    //printer
    var printerIconTexture = THREE.ImageUtils.loadTexture( 'images/printer-icon.png' );
    var printerIconMaterial = new THREE.SpriteMaterial( { map: printerIconTexture, useScreenCoordinates: false} );
	var sprite3 = new THREE.Sprite( printerIconMaterial );
	sprite3.position.set( -10, 135, 235 );
	sprite3.scale.set( 32, 32, 1.0 ); // imageWidth, imageHeight
	scene.add( sprite3 );
    
    var sprite4 = new THREE.Sprite( printerIconMaterial );
	sprite4.position.set( 220, 135, 235 );
	sprite4.scale.set( 32, 32, 1.0 ); // imageWidth, imageHeight
	scene.add( sprite4 );
    
    var sprite5 = new THREE.Sprite( printerIconMaterial );
	sprite5.position.set( -10, 135, 335 );
	sprite5.scale.set( 32, 32, 1.0 ); // imageWidth, imageHeight
	scene.add( sprite5 );
    
    
    //projector
    var projectorIconTexture = THREE.ImageUtils.loadTexture( 'images/projector-icon.png' );
    var projectorIconMaterial = new THREE.SpriteMaterial( { map: projectorIconTexture, useScreenCoordinates: false} );
	var sprite6 = new THREE.Sprite( projectorIconMaterial );
	sprite6.position.set( -10, 535, 235 );
	sprite6.scale.set( 32, 32, 1.0 ); // imageWidth, imageHeight
	scene.add( sprite6 );
    
    
    
    //angry person
    /*
    var angryIconTexture = THREE.ImageUtils.loadTexture( 'images/angry-face.png' );
    var angryIconMaterial = new THREE.SpriteMaterial( { map: angryIconTexture, useScreenCoordinates: false} );
	var sprite6 = new THREE.Sprite( angryIconMaterial );
	sprite6.position.set( -10, 135, 260 );
	sprite6.scale.set( 32, 32, 1.0 ); // imageWidth, imageHeight
	scene.add( sprite6 );
    
    
	var sprite7 = new THREE.Sprite( angryIconMaterial );
	sprite7.position.set( 220, 135, 260 );
	sprite7.scale.set( 32, 32, 1.0 ); // imageWidth, imageHeight
	scene.add( sprite7 );
    
    
    var sprite7 = new THREE.Sprite( angryIconMaterial );
	sprite7.position.set( 220, 135, 260 );
	sprite7.scale.set( 32, 32, 1.0 ); // imageWidth, imageHeight
	scene.add( sprite7 );
    */
    

}


function makeFloorPlan(){

    // FLOOR
	var floorTexture = new THREE.ImageUtils.loadTexture( 'images/floorplan.png' );
	//floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	//floorTexture.repeat.set( 10, 10 );
	var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
	var floorGeometry = new THREE.PlaneGeometry(440, 290, 1, 1);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.set(100, 119, 300);
    floor.rotation.x = Math.PI * 1.5;
    
    
	//floor.position.y = -0.5;
	//floor.rotation.x = Math.PI / 2;
	scene.add(floor);
    
    
    var floor2 = new THREE.Mesh(floorGeometry, floorMaterial);
    floor2.position.set(100, 519, 300);
    floor2.rotation.x = Math.PI * 1.5;
    scene.add(floor2);
}

// FUNCTIONS 		
function init() 
{
	// SCENE
	scene = new THREE.Scene();
    
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 100000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(300,5000,0);
	camera.lookAt(scene.position);	
	// RENDERER
	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	else
		renderer = new THREE.CanvasRenderer(); 
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	container = document.getElementById( 'ThreeJS' );
	container.appendChild( renderer.domElement );
	// EVENTS
	THREEx.WindowResize(renderer, camera);
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
	// CONTROLS
	controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.userPanSpeed = 10.0;
	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	// LIGHT
	var light = new THREE.PointLight(0xffffff);
	light.position.set(100,250,100);
	scene.add(light);
	
    
    //Layers
	createLayers();
    checkLoadedTextures();
    
    /*
	// SKYBOX
	var skyBoxGeometry = new THREE.CubeGeometry( 100000, 100000, 100000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
    skybox.position.set(0, 50000, 0);
	scene.add(skyBox);
	*/
    
    // axes
	var axes = new THREE.AxisHelper(100);
	scene.add( axes );
	
	var imagePrefix = "images/dawnmountain-";
	var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
	var imageSuffix = ".png";
	var skyGeometry = new THREE.CubeGeometry( 30000, 5000, 30000 );	
	
	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide
		}));
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    skyBox.position.set(0, 2000, 0);
	scene.add( skyBox );
	////////////
	// CUSTOM //
	////////////
	
	var geometry = new THREE.SphereGeometry( 30, 32, 16 );
	var material = new THREE.MeshLambertMaterial( { color: 0x000088 } );
	sphere = new THREE.Mesh( geometry, material );
	sphere.position.set(-1500,0,-1500);
	scene.add(sphere);
    
    
    
    //Custom limiting
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = (Math.PI / 2) - .1;
    controls.maxDistance = 24000;
    controls.domElement.addEventListener('mousewheel', onMouseWheel, false);
    controls.domElement.addEventListener('DOMMouseScroll', onMouseWheel, false);
    
    lastCameraY = camera.position.y;
    //console.log(lastCameraY);
    
    //buildings
    makeBuildings();
    
    //floorplan
    makeFloorPlan();
    
    //make sprites
    makeSprites();
    
    //GUI
    makeGUI();
    
    
	
}

function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
}

function update()
{
    
	if ( keyboard.pressed("z") ) 
	{	  
		console.log(camera.position);
	}
	
	controls.update();
	camera.up = new THREE.Vector3(0,1,0);
	stats.update();
    
    //document.getElementById('infoBox').innerHTML = 'Camera Height: ' + camera.position.y + '\n\n' + 'Camera Dist: ' + getCameraDistance();
    updateZoomLevel();
}

function updateBuilding()
{
	var value = parameters.material;
	
    if(value == "Texture"){
        //
        
        
        
        
        var swapMaterial = buildingArray[1].material.materials[0]
        buildingArray[1].material.materials[0] = buildingArray[1].material.materials[2];
        buildingArray[1].material.materials[2] = swapMaterial;
        //buildingArray[1].material.materials[0].needsUpdate = true;
    } else if(value == "Wireframe"){
        //
        var swapMaterial = buildingArray[1].material.materials[0]
        buildingArray[1].material.materials[0] = buildingArray[1].material.materials[2];
        buildingArray[1].material.materials[2] = swapMaterial;
        
        
        buildingArray[1].material.materials[2].needsUpdate = true;
    }
    
    //
    
    console.log(value);
	
}

function render() 
{
	renderer.render( scene, camera );
}

function onMouseWheel(event){
 
}

function getCameraDistance(){

    var x = camera.position.x - controls.center.x;
    var y = camera.position.y - controls.center.y;
    var z = camera.position.z - controls.center.z;
   
    
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
}

function updateZoomLevel(){

    var dist = getCameraDistance();
    var level = 18 - Math.floor((dist)/(totalSize / 3));
    if (level < currentZoomLevel){
        currentZoomLevel--;
        console.log(' - to zoom level ' + currentZoomLevel);
        
        if(currentZoomLevel >= 15){
            swapLayer();
        }
    } else if (level > currentZoomLevel){
        currentZoomLevel++;
        console.log('+ to zoom level ' + currentZoomLevel);
        if(currentZoomLevel >= 15){
            swapLayer();
        }
    }       
}

function swapLayer(){
    //
    
    //set old meshes to invisible
    var count = visibleMeshes.length;
    for(var i=0;i<count;i++){
        //
        visibleMeshes.shift().visible = false;
    }
    
    var newLayerIndex = currentZoomLevel - 15;
    
    for(var i=0;i<layers[newLayerIndex].rowCount;i++){
        for(var j=0;j<layers[newLayerIndex].colCount;j++){
            layers[newLayerIndex].meshes[i][j].visible = true;
            visibleMeshes.push(layers[newLayerIndex].meshes[i][j]);
        }
    }
}




