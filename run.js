var fs = require('fs');
var childProcess = require('child_process');

var packageJSON = fs.readFileSync("package.json", {encoding:"utf-8"});
var object = JSON.parse(packageJSON);
var numDependencies = Object.keys(object.dependencies).length;
var modules = [];

for(var module in object.dependencies)
{
    modules.push(module);
}
console.log("Required modules for this app are: \n\t" + modules);

for(module in modules)
{
    var path = __dirname + "\\node_modules\\" + modules[module] + "\\";
    var exists = fs.existsSync(path);
    
    if(!exists){
        console.log("Module: " + modules[module] + " is not installed.");
    }
}

console.log("\nWould you like to run npm install? y/n");

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(chunk) {
    var choice = chunk.toString().trim();
    if(choice == "y")
    {
        //npm install
        
        var spawn = require('child_process').spawn,
            ls    = spawn('c:\\windows\\system32\\cmd.exe', ['/c', 'npm', 'install']);

        ls.stdout.on('data', function (data) {
          console.log('stdout: ' + data);
        });

        ls.stderr.on('data', function (data) {
          console.log('stderr: ' + data);
        });

        ls.on('exit', function (code) {
          console.log('child process exited with code ' + code);
          console.log("Starting app...");
          startApp();
        });
    } else {
        console.log("Exiting...");
        process.exit(0);
    }
    
    
    
});

process.stdin.on('end', function() {
  process.stdout.write('end');
});


function startApp()
{
    var spawn = require('child_process').spawn,
        ls    = spawn('c:\\windows\\system32\\cmd.exe', ['/c', 'node', 'app.js']);

    ls.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });

    ls.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    ls.on('exit', function (code) {
      console.log('child process exited with code ' + code);
      console.log("Starting app...");
      startApp();
    });

}


