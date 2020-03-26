fs = require('fs');

var fileName = "analytics.txt";
var path = "/";
var env = process.env;

if (env.ANALYTICS_STRING){
  console.log("Anayltics string detected, Creating analytics file.");
  
  fs.writeFile(fileName, env.ANALYTICS_STRING, function (err) {
    if (err) return console.log(err);
  });

}