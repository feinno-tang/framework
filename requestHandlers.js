var exec = require('child_process').exec;
var querystring = require('querystring');
var fs = require('fs');
var formidable = require('formidable');
var url = require('url');

function start() {
    console.log('Request handler "start" was called.');
    sleep(10000);
    return 'Hello Start';
}

function start(response) {
    console.log("Request handler 'start' was called.");
    var body = '<html><head>' +
        '</head><body><form action="/upload" method="post">' +
        '<textarea name="text" rows="20" cols="60"></textarea><input type="submit" value="submit text">' +
        '</form></body></html>';
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(body);
    response.end();

    // exec('ls -lah',{timeout:10000,maxBuffer:20000*1024},function(error,stdout,stderr){
    //     response.writeHead(200,{'Content-Type':'text/plain'});
    //     response.write(stdout);
    //     response.end();
    // });
}

function upload(response, postData) {
    console.log('Request handler "upload" was called.');
    response.writeHead(200, {"Content-Type": "text/plain"});
    // response . write ( "YOU'VE sent:"+ postData );
    response.write('YOU"VE sent: ' + querystring.parse(postData).text);
    response.end();
}

function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
}

function start(response, postData) {
    console.log("Request handler 'start' was called.");
    var body = '<html> ' + '<head>' + '<meta http-equiv="Content-Type" ' + 'content="text/html; charset=UTF-8" />' + '</head>'
        + '<body >' + '<form action="/upload" enctype="multipart/form-data" ' + 'method="post">' +
        '<input type="file" name="upload">' + '<input type="submit" value="Upload file" />' +
        '</form>' + '</body>' + '</html>';
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}
function upload(response, request) {
    console.log("Request handler ' upload' was called.");
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = 'G:/www/2017framework';
    console.log("about to parse");
    form.parse(request, function (error, fields, files) {
        console.log("parsing done");
        var id = new Date().getTime();
        fs.renameSync(files.upload.path, "/www/2017framework/tmp/test"+ id +".png");
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("received image:<br/>");
        response.write("<img src='/show?"+id+"' / >");
        response.end();
    });
}
function show(response, request) {
    console.log("Request handler 'show' was called.");
    console.log(url.parse(request.url));
    var query = url.parse(request.url).query;
    fs.readFile("/www/2017framework/tmp/test"+ query +".png", "binary", function (error, file) {
        if (error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + "\n");
            response.end();
        }
        else {
            response.writeHead(200, {"Content-Type": "image/png"});
            response.write(file, "binary");
            response.end();
        }
    });
}

exports.start = start;
exports.upload = upload;
exports.show = show;