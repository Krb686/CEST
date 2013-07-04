var fs = require('fs');
var http = require('http');
var mkdirp = require('mkdirp');


var urlPath = "C:\\workspace\\CEST\\lib\\image_urls.txt";
var savePath = "C:\\workspace\\CEST\\images\\";
var objects = [];
var globalI = 0;

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

    console.log("File found! Reading...");
    fs.readFile(urlPath, {"encoding":"utf8"}, function(err, data){
        if (err){
            console.log("Error reading file...");
            throw err;
        } else {
            console.log("File read!");
            var array = data.split("\n");
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
                var subPath = STYLE + "\\" + RESOLUTION + "\\" + ZOOM + "\\" + X + "\\";
                var totalPath = savePath + subPath;
                
                if (!fs.existsSync(totalPath))
                {
                    console.log('making dir');
                    mkdirp.sync(totalPath);
                   
                    /*
                    
                    */
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
            
            download();
            
                
        }
    });
}

function download(){
    
    if(globalI != objects.length){
        http.get(objects[globalI].url, function(response){
            response.pipe(objects[globalI].fileStream);
            console.log('downloaded file # ' + (globalI + 1));
            globalI++;
            download();
        });
    }
}