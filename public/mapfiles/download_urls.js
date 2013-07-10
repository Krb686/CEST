var fs = require('fs');
var http = require('http');
var mkdirp = require('mkdirp');


var urlPath = __dirname + "\\urls.txt";
var savePath = __dirname + "\\";
var objects = [];
var globalI = 0;

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
    
    setTimeout(function() { console.log("Timeout!!");  }, 5000);
    //console.log("still running");
    //console.log("File found! Reading...");
    
    
    try{
        var data = fs.readFileSync(urlPath, {"encoding":"utf8"});
    } catch (err) {
        console.log("Error reading url file...");
        throw err;
    } finally {
        //process.stdout.write("File read!");
        var array = data.split("\n");
        
        //console.log("Found " + array.length + " urls");
        
        
        
        
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
            
            var subPath = STYLE + "\\" + RESOLUTION + "\\" + ZOOM + "\\" + X + "\\";
            
            var totalPath = savePath + subPath;
            
            if (!fs.existsSync(totalPath))
            {
                console.log('making dir');
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
        }
        
        console.log("runonce!!!!!!!!!!!!");
        startDownloads();
    }
    
    
}

console.log("it ran here!");

function startDownloads(){

    //must block so child process does not exit until downloads are complete
    while(globalI != objects.length)
    {
        if(globalI == 0)
        {
            //globalI++;
            var object = objects.shift();
            download(object);
        }
    }
    
    console.log("Downloads complete!");
}

function download(object)
{
    http.get(object.url, function(response){
        response.pipe(object.fileStream);
        console.log('downloaded file # ' + (globalI + 1));
        globalI++;
        console.log("download another...");
        if(globalI != objects.length)
        {
            object = objects.shift();
            download(object);
        }
    });

}