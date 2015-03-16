/*globals require, module, console */
(function (exports) {
    "use strict";

    var http = require("http"),
        fs = require("fs"),
        handlebars = require("handlebars"),
        baseTemplate;

    baseTemplate = fs.readFileSync("./index.html", "utf8");

    function onRequest(req, res) {

        console.log(req.url);

        var pageBuilder = handlebars.compile(baseTemplate),
            markupDirectory = "./markup/",
            docDicrecotry = "./doc/",
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
                documentation: fs.readFileSync(docDicrecotry + 'base/' + currentFile)
            });
        }

        for(fileIndex = 0; fileIndex < patternFileList.length; fileIndex++) {
            var currentFile = patternFileList[fileIndex];

             vm.patterns.push({
                title: currentFile.split('.', 1)[0],
                type: 'patterns',
                fileName: currentFile,
                content: fs.readFileSync(markupDirectory + 'patterns/' + currentFile),
                documentation: fs.readFileSync(docDicrecotry + 'patterns/' + currentFile)
            });
        }

        res.writeHead(200, {"Context-Type": "text/html"});
        res.write(pageBuilder(vm));
        res.end();
    }

    http.createServer(onRequest).listen(8000);
    console.log("Server has started on port 8000.");

}(module.exports));
