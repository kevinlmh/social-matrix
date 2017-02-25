var express = require('express')
var server = require('http').createServer(app);
var app = express()

var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: 'D7FJRxEaDTfsIeINim3LfRh6L',
  consumer_secret: 'SmUDoSCH1lYZWF5wkGNut0aJ8ze2PE1NDNNhygQuQom9GPJ2Oc',
  access_token_key: '1069974536-qtR9DEEhCfciHd30EAPQBe9OLFqBeVRl2YO24Ke',
  access_token_secret: 'unhCgl9kPy8jMj0BNqIfOq3PhRFDgvJBp1kWmI8N4vNkG'
});
 
// use array to store tweets for noew
// I know this is really bad
// will switch to a database later
//var tweets = [];

var io = require('socket.io')(server);
io.on('connection', function(){
    console.log("a socket connection");
    io.emit('tweet', {'message':"hello"});
});

// You can also get the stream in a callback if you prefer. 
client.stream('statuses/filter', {track: 'trump'}, function(stream) {
  stream.on('data', function(data) {
    //console.log(data.text);
    io.emit('tweet', {'message': data.text});
  });
 
  stream.on('error', function(error) {
    throw error; 
  });
});

// app.get('/', function (req, res) {
//   res.render('')
// })

server.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});