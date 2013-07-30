
/**
 * Module dependencies.
 */

var express     =   require('express')
  , http        =   require('http')
  , path        =   require('path')
  , io          =   require('socket.io');

var users = [];
var socketList = {};
  
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
        res.render('indexReal.html');
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
    
    socket.on('simulation', function(data){
       console.log(data); 
    });
}

configureServer();
