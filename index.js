var DEBUG = true;

var js2coffee = require('js2coffee');
fs = require('fs')

var files = fs.readdirSync('DiscoverMeteor_En');

for (i = 0; i< files.length; i++) {
    if (files[i].indexOf(".md.erb") > -1) {
    sourceFile = "DiscoverMeteor_En/" + files[i];
    console.log("\n\n\n\nCurrent File:" + sourceFile + "============================\n\n\n");
    data = fs.readFileSync(sourceFile, 'ascii');
    if (DEBUG == true) console.log("Length of document: " + data.length);

    var startBlock = [];
    var jsStart = [];

    var endBlock = [];
    var jsEnd = [];

    // Calculate and store all indices of the js code blocks (beginings and endings)
    for (var index = data.indexOf("~~~js\n");index >= 0; index = data.indexOf("~~~js\n", index + 1)) {

        startBlock.push(index);
        jsStart.push(index+6);
        endBlock.push(data.indexOf("~~~\n", index+6)+4);
        jsEnd.push(data.indexOf("~~~\n", index+6));
    }


    // Create a resulatant Markdown string 'buffer'
    var resultMarkdown = "";


    if (startBlock.length == endBlock.length && jsStart.length == jsEnd.length) {
      convertedCode = []     // An array that will hold all Coffee code.

      // Debug information
      if (DEBUG == true)  {
        console.log("Start of Block: " + startBlock);
        console.log("Start of actual Javascript: " + jsStart);
        console.log("End of actual Javascript: " + jsEnd);
        console.log("End of Block: " + endBlock);
      }
      // Convert all code blocks to Coffee blocks
      for (i = 0; i<jsStart.length; i++) {
        var js = data.substring(jsStart[i], jsEnd[i]);
        console.log("\n========================\nCURRENT BLOCK: " + jsStart[i] + "Code:\n" + js);
        var cs = js2coffee.build(js, {no_comments: false});
        convertedCode.push("\n~~~coffee\n"+cs+"\n~~~\n");
        if (i == 0) {
          resultMarkdown += data.substring(0, endBlock[i]) + convertedCode[i];
        }
        if (i > 0) {
          resultMarkdown += data.substring(endBlock[i-1], endBlock[i]) + convertedCode[i];
        }
        if (i == jsStart.length - 1) {
          resultMarkdown += data.substring(endBlock[i], data.length);
        }
      }


      console.log(resultMarkdown);
      fs.writeFileSync(sourceFile, resultMarkdown);
    } else {
      console.log("Invalid syntax, code blocks probably not closed");
    }

  }
}
