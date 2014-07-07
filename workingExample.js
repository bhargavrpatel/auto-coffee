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

  for (var index = data.indexOf("~~~js");index >= 0; index = data.indexOf("~~~js", index + 1)) {

      startBlock.push(index);
      jsStart.push(index+6);
      endBlock.push(data.indexOf("~~~\n", index+6)+4);
      jsEnd.push(data.indexOf("~~~\n", index+6));
  }


  if (DEBUG == true)  {
    console.log("Start of Block: " + startBlock);
    console.log("Start of actual Javascript: " + jsStart);
    console.log("End of actual Javascript: " + jsEnd);
    console.log("End of Block: " + endBlock);
  }

  var resultMarkdown = "";

  String1 = data;
  base = data.substring(0, jsEnd[0]);
  jsCode1 = String1.substring(jsStart[0], jsEnd[0]);
  csCode1 = js2coffee.build(jsCode1, {no_comments: false});
  jsCode2 = String1.substring(jsStart[1], jsEnd[1]);
  csCode2 = js2coffee.build(jsCode2, {no_comments: false});

  base += "\n~~~coffee\n" + csCode1 + "\n~~~\n";

  base += data.substring(endBlock[0], endBlock[1]);

  base += "\n~~~coffee\n" + csCode2 + "\n~~~\n";

  base += data.substring(endBlock[1], data.length);

  console.log(base);

  fs.writeFile('output.md', base, function(err, data) {
    if (err) {return err};
  });

});
