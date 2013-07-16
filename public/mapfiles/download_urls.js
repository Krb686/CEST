var os = require('os');
var fs = require('fs');
var http = require('http');
var mkdirp = require('mkdirp');

var platform = os.platform();

if(platform == "win32"){
    var urlPath = __dirname + "\\urls.txt";
    var savePath = __dirname + "\\";
} else if (platform == "linux"){
    var urlPath = __dirname + "/urls.txt";
    var savePath = __dirname + "/";
}


var objects = [];
var total = 0;
var numDownloaded = 0;

process.on('uncaughtException', function (err) {
  console.error('uncaught: ' + err);
});


var file;


if (!fs.existsSync(urlPath))
{
    console.log("File at " + urlPath + " does not exist!");
}
else 
{
    if(!fs.existsSync(savePath)){
        mkdirp.sync(savePath);
    }
    
    var data = fs.readFileSync(urlPath, "utf8");

    //process.stdout.write("File read!");
    var array = data.split("\n");
    
    //console.log(array);
    console.log("Found " + array.length + " urls");
    
    
    
    
    for (var i=0;i<array.length;i++)
    {
        var url = array[i];
        var subArray = url.split("\/");
        
        if(subArray.length == 9)
        {
            var STYLE = subArray[4];
            var RESOLUTION = subArray[5];
            var ZOOM = subArray[6];
            var X = subArray[7];
            var fileName = subArray[8];
            fileName = fileName.replace(/(\r\n|\n|\r)/gm,"");
        }
        
        if(platform == "win32"){
            var subPath = STYLE + "\\" + RESOLUTION + "\\" + ZOOM + "\\" + X + "\\";
        } else if (platform == "linux"){
            var subPath = STYLE + "/" + RESOLUTION + "/" + ZOOM + "/" + X + "/";
        }
        var totalPath = savePath + subPath;
        
        if (!fs.existsSync(totalPath))
        {
            //console.log('making dir: ' + totalPath);
            mkdirp.sync(totalPath);
           
        }
        
        var fileStream = fs.createWriteStream(totalPath + fileName);
        
        var downloadObject = {
                url:url,
                fileStream:fileStream
        }
        
        downloadObject.fileStream.on('end', function(){
            downloadObject.fileStream.end();
        });
            
        objects.push(downloadObject);
        //console.log(objects.length);
    }
    total = objects.length;
    download(objects.shift());
}

function download(object)
{
    
    http.get(object.url, function(response){
        numDownloaded++;
        console.log('Downloaded file ' + numDownloaded + '//' + total);
        response.pipe(object.fileStream);
      
        //If there are objects left, continue. Else, this is the last response.
        if(objects.length > 0){
            
            object = objects.shift();
            download(object);
        } else {
                console.log("Finished downloading map files.");
                process.exit(0);
            
        }
    });
}
