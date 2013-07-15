var fs = require('fs');
var childProcess = require('child_process');


//GLOBALS
var package_json_string = fs.readFileSync("package.json", {encoding:"utf-8"});
var package_json_object = JSON.parse(package_json_string);
var numDependencies = Object.keys(package_json_object.dependencies).length;
    
var dependenciesExist = true;
var mapFilesExist = true;

function main()
{
    checkModules(function(){
        checkMapFiles(function(){
            startApp();
        });
    });
}


function checkModules(callback){
    
    for(var module in package_json_object.dependencies)
    {
        var path = __dirname + "\\node_modules\\" + module + "\\";
        var exists = fs.existsSync(path);
        
        if(!exists){
            console.log("Module: " + module + " is not installed.");
            dependenciesExist = false;
        }
    }
    
    if(!dependenciesExist)
    {
        installModules(function(){
            callback();
        });
    } else
    {
        console.log("Found modules!");
        callback();
    }
    
}

function installModules(callback){

    process.stdout.write("\nWould you like to run npm install? y/n: ");

    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.once('data', function(chunk) {
        var choice = chunk.toString().trim();
        if(choice == "y")
        {
            //npm install
            runCommandWindows(['/c', 'npm', 'install'], callback);
            
        } else {
            console.log("Exiting...");
            process.exit(0);
        }
    });

    process.stdin.once('close', function() {
        process.stdout.write('end');
    });
}

function checkMapFiles(callback)
{
    var path = __dirname + "\\public\\mapfiles\\998\\";
    mapFilesExist = fs.existsSync(path);
    
    if(!mapFilesExist)
    {
        downloadMapFiles(function(){
            callback();
        });
    } else {
        console.log("Found map files!");
        callback();
    }
}

function downloadMapFiles(callback)
{
    process.stdout.write("Map files not found. Would you like to download them? y/n: ");
        
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.once('data', function(chunk) {
        var choice = chunk.toString().trim();
        if(choice == "y")
        {
            //download map files
            runCommandWindows(['/c', 'node', 'public\\mapfiles\\download_urls.js'], callback);
            
        } else {
            console.log("Exiting...");
            process.exit(0);
        } 
    });

    process.stdin.once('end', function() {
      process.stdout.write('end');
    });
}


function startApp()
{
    console.log("Starting app...");
    runCommandWindows(['/c', 'node', 'app.js']);
}

function runCommandWindows(options, exitFunction)
{
    var spawn = require('child_process').spawn;
    var child = spawn('c:\\windows\\system32\\cmd.exe', options, {"stdio": [process.stdin, process.stdout, process.stderr]});

    
    /*
    child.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });

    child.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    */
    
    child.on('exit', function (code) {
      console.log('child process ' + child.pid + ' exited with code ' + code);
      exitFunction();
    });
    
}



main();

