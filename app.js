
/**
 * Module dependencies.
 */

var express     =   require('express')
  , http        =   require('http')
  , path        =   require('path')
  , io          =   require('socket.io')
  , sys         =   require('sys')
  , sqlite3      =   require('sqlite3').verbose();

var users = [];
var socketList = {};
var db = new sqlite3.Database(__dirname + '/public/data/data.s3db');

  
function configureServer()
{
    
    //Create app
    var app = express();

    app.configure(function(){
      app.set('port', process.env.PORT || 3001);
      app.set('views', __dirname + '/views');
      app.set('view options', {layout:false});
      app.engine('html', require('ejs').renderFile);
      app.use(express.favicon());
      app.use(express.logger('dev'));
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(app.router);
      app.use(express.static(path.join(__dirname, 'public')));
    });

    app.configure('development', function(){
      app.use(express.errorHandler());
    });
    
    app.get('/', function(req, res){
        res.render('index.html');
    });
    
    
    
    startServer(app);
    
}

function startServer(app)
{
    var server = http.createServer(app);
    var port = app.get('port');
    
    server.listen(port, function(){
        console.log("Express server listening on port " + port);
        io = io.listen(server);
        io.set('log level', 1);
      
        io.sockets.on('connection', connectSocket);
    });
}

function connectSocket(socket){
    
    
    console.log(socket.id + '...connected!');
    socketList[socket.id] = socket;
    console.log('  # Users: ' + Object.keys(socketList).length);
    
    //disconnect event
    socket.on('disconnect', function(){
        console.log(socket.id + '...disconnected.');
        delete socketList[socket.id];
        console.log('  # Users: ' + Object.keys(socketList).length);
    });
    
    
    //default - send all data
    var query = "select * from DEVICE";
    queryDb(db, query, function(result){
        //
        socket.emit('data', result);
    });
 
    
    
    socket.on('simulation', function(data){
       console.log(data); 
    });
}

function queryDb(db, query, cb){
    var result = [];
    db.serialize(function(){
        db.all(query, function(err, rows){
            if(err){
                throw err;
            }
            
            for(var i=0;i<rows.length;i++){ 
                var obj = correctJson(rows[i]);
                result.push(obj);
            }
            
            cb(result);
        });
    });
}

function correctJson(object){
    //
    for(var key in object){
        
        if((key.indexOf('.')) != -1){
            //nested
            var array = key.split('.');
            var depth = array.length;
            var currentObj = object;
            
            for(var i=0;i<depth;i++){
                var property = array[i];
                
                if(!(currentObj.hasOwnProperty(property))){
                    if(i!=(depth-1)){
                        currentObj[property] = {};
                        currentObj = currentObj[property];
                    } else {
                        currentObj[property] = object[key];
                    }
                } else {
                    
                    currentObj = currentObj[property];
                }
            }
            
            delete object[key];
        }
    }
    
    return object;
}

configureServer();
