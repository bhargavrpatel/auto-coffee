var DEBUG = true;

var js2coffee = require('js2coffee');
fs = require('fs')

fs.readFile('test.md', 'ascii', function (err,data) {
  if (err) {
    return console.log(err);
  }
  if (DEBUG == true) console.log("Length of document: " + data.length);

  var startBlock = [];
  var jsStart = [];

  var endBlock = [];
  var jsEnd = [];

  // Calculate and store all indices of the js code blocks (beginings and endings)
  for (var index = data.indexOf("~~~js");index >= 0; index = data.indexOf("~~~js", index + 1)) {

      startBlock.push(index);
      jsStart.push(index+6);
      endBlock.push(data.indexOf("~~~\n", index+6)+4);
      jsEnd.push(data.indexOf("~~~\n", index+6));
  }

  // Debug information
  if (DEBUG == true)  {
    console.log("Start of Block: " + startBlock);
    console.log("Start of actual Javascript: " + jsStart);
    console.log("End of actual Javascript: " + jsEnd);
    console.log("End of Block: " + endBlock);
  }

  // Create a resulatant Markdown string 'buffer'
  var resultMarkdown = "";


  if (startBlock.length == endBlock.length && jsStart.length == jsEnd.length) {

    convertedCode = []     // An array that will hold all Coffee code.
    // Convert all code blocks to Coffee blocks
    for (i = 0; i<jsStart.length; i++) {
      var js = data.substring(jsStart[i], jsEnd[i]);
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
  } else {
    console.log("Invalid syntax, code blocks probably not closed");
  }
});
