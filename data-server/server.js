var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var csv = require('fast-csv');

var csv = require("fast-csv");
var realTimeEnv = [];
let index = 0;

csv
 .fromPath("./history_data_3000.csv")
 .on("data", function(data){
     realTimeEnv.push(data);
 })
 .on("end", function(){
     console.log("end");
    io.on('connection', function(socket){
        console.log('a user connected');
        setInterval(() => {
            console.log(realTimeEnv[index]);
            socket.emit('realTimeEnv', realTimeEnv[index]);
            index = (index + 1) % realTimeEnv.length;
        }, 1000);
    });
 });


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});



http.listen(3002, function(){
  console.log('listening on *:3002');
});
