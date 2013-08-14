/**
 * Module dependencies.
 */

var express     =   require('express')
  , http        =   require('http')
  , path        =   require('path')
  , io          =   require('socket.io')
  , nedb        =   require('nedb');

//GLOBALS
var app, db;
var users = [];
var socketList = {};


function main(){
    configureServer();
    loadDatabase();
    startServer();
}


function configureServer()
{
    
    //Create app
    app = express();

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
}

function loadDatabase(){
    var opts = {
        filename: 'public/data/database',
        autoload: true
    }
    
    db = new nedb(opts);
  
}

function startServer()
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
    db.find({}, function(err, docs){
        if(err){
            throw err;
        }
        
        socket.emit('data', docs);
    });
}

main();

/* Old code for use with sqlite3

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
*/

