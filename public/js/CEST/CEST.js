function CEST(opts_2D, opts_3D){
    var opts_2D = opts_2D || {};
    var opts_3D = opts_3D || {};
    
    this.init(opts_2D, opts_3D);
}


CEST.prototype = {
    init:function(opts_2D, opts_3D){
    
        this.CEST_2D = new CEST_2D(opts_2D);
        this.CEST_3D = new CEST_3D(opts_3D);
        
        
        //default display
        this.displayType = '2D';
        
        //GUI
        this.makeGUI();
        
        //Setup jquery event listener to make tabs for popups
        $(window).load(function() {
            this.CEST.CEST_2D.map.on('popupopen', function() {
                $( ".detail-popup-info" ).tabs();
            });
            
            
            //temp
            /*
            var that = this;
            setInterval(function(){console.log(that.CEST.CEST_2D.map.getCenter());}, 1000);
            */
            
        });
    },
    
    makeGUI:function(){
        this._gui =  new dat.GUI();
        
        var parameters = 
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
            display:'2D',
            material: "Texture"
        };
        
        
        //avoid dereferencing
        var that = this;
        
        var displayChanger = this._gui.add(parameters, 'display', ['2D', '3D']).name('Display Type').listen();
        displayChanger.onChange(function(value){
            that.changeDisplay(value);
        });
        
        var textureChanger = this._gui.add(parameters, 'material', [ "Texture", "Wireframe" ] ).name('Material Type').listen();
        textureChanger.onChange(function(value){
            that.CEST_3D.updateBuilding(value);   
        });
        
        
         this._gui.open();
    },
    
    changeDisplay: function(value){
        if(value != this.displayType){
            if(value == '2D'){
                $('#2dcontainer').css("display","block");
                $('#3dcontainer').css("display", "none");
                this.displayType = '2D';
            } else if (value == '3D'){
                $('#2dcontainer').css("display","none");
                $('#3dcontainer').css("display", "block");
                this.displayType = '3D';
            }
        }
    }
}