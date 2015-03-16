/*globals require, module, console */
(function (exports) {
    "use strict";

    var http = require("http"),
        fs = require("fs"),
        handlebars = require("handlebars"),
        baseTemplate,
        express = require('express'),
        app = express(),
        server;

    baseTemplate = fs.readFileSync("./index.html", "utf8");

    app.get('/', function (req, res) {
        var pageBuilder = handlebars.compile(baseTemplate),
            markupDirectory = "./markup/",
            docDirectory = "./doc/",
            baseFileList = fs.readdirSync(markupDirectory + 'base/'),
            patternFileList =  fs.readdirSync(markupDirectory + 'patterns/'),
            vm = {base: [], patterns: []},
            fileIndex;

        for(fileIndex = 0; fileIndex < baseFileList.length; fileIndex++) {
            var currentFile = baseFileList[fileIndex];

             vm.base.push({
                title: currentFile.split('.', 1)[0],
                type: 'base',
                fileName: currentFile,
                content: fs.readFileSync(markupDirectory + 'base/' + currentFile),
                documentation: fs.readFileSync(docDirectory + 'base/' + currentFile)
            });
        }

        for(fileIndex = 0; fileIndex < patternFileList.length; fileIndex++) {
            var currentFile = patternFileList[fileIndex];

             vm.patterns.push({
                title: currentFile.split('.', 1)[0],
                type: 'patterns',
                fileName: currentFile,
                content: fs.readFileSync(markupDirectory + 'patterns/' + currentFile),
                documentation: fs.readFileSync(docDirectory + 'patterns/' + currentFile)
            });
        }
        console.log(vm.patterns);

        res.writeHead(200, {"Context-Type": "text/html"});
        res.write(pageBuilder(vm));
        res.end();
    });

    //Static files
    app.use('/images', express.static('images'));
    app.use('/css', express.static('css'));
    app.use('/js', express.static('js'));

    server = app.listen(8000, function () {
        var host = server.address().address;
        var port = server.address().port;

        console.log('Example app listening at http://%s:%s', host, port);
    });

}(module.exports));
