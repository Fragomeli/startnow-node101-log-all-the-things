const express = require('express');
const fs = require('fs');
const app = express();

// var router = require('/router');
// app.use('/',router);

app.use((req, res, next) => {
    // write your logging code here
    // We need to log all the requests!
   // console.log("res", res);

    let agent = req.headers['user-agent'].replace(',','');
    let time = new Date().toISOString();
    let method = req.method;
    let resource = req.url;
    let version = 'HTTP/' + req.httpVersion;
    let status = "200";

    let logLine = `${agent},${time},${method},${resource},${version},${status}\n`;

  //  console.log("log line info", logLine);

 // Append this log data to the log file
    fs.appendFile("./log.csv", logLine, (err) => {
        if (err) {
            throw err;
        } 

        console.log(logLine);
        next();
    });
});
app.get('/', (req, res) => {
// write your code to respond "ok" here
   res.send("log.csv");
});

// app.post('/logs', (req, res) => {
// // write your code to return a json object containing the log data here
//  var logContents = fs.appendfile('');
//  var jsonData = now.toJSON();
// });

app.get('/logs', (req, res) => {
    console.log('This is the full logs ');

    // You need to read the log.csv file
    // Parse the data (because it is csv file)
    fs.readFile('./log.csv', 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
// how do i get rid of the first element of the array.. 
        let lines = data.split('\n');
        lines.shift();
        lines.pop();
        let jsonData = [];

        lines.forEach(line => {
            let contents = line.split(',');

            let lineJson = {
                "Agent": contents[0],
                "Time": contents[1],
                "Method": contents[2],
                "Resource": contents[3],
                "Version": contents[4],
                "Status": contents[5],
            };
            if (contents[0] !== ""){
             jsonData.push(lineJson);
            }
         });

        res.json(jsonData);
    });
});

module.exports = app;
