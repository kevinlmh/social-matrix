var express = require('express');
var bodyparser = require('body-parser');
var server = require('http').createServer(app);
var _ = require('underscore');
var status = require('http-status');
var app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true}));

var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: 'D7FJRxEaDTfsIeINim3LfRh6L',
  consumer_secret: 'SmUDoSCH1lYZWF5wkGNut0aJ8ze2PE1NDNNhygQuQom9GPJ2Oc',
  access_token_key: '1069974536-qtR9DEEhCfciHd30EAPQBe9OLFqBeVRl2YO24Ke',
  access_token_secret: 'unhCgl9kPy8jMj0BNqIfOq3PhRFDgvJBp1kWmI8N4vNkG'
});
 
// use array to store keywords for now
// I know this is really bad
// will switch to a database later
var keywords = [];

var io = require('socket.io')(server);
io.on('connection', function(){
    console.log("a socket connection");
});

// var minutes = 5, trendInterval = minutes * 60 * 1000;
// var trendList = []; 

// var streamBegan = false;

// setInterval(
//   client.get('trends/place', { id: 2450022 }, function(error, json, response) {
//     if (error) throw error;
    
//     var trends = json[0].trends;
//     for (var i = 0; i < trends.length; i++) {
//       trendList.push(trends[i].name.toString());
//     }
//     if (!streamBegan) {
//       beginStream();
//       streamBegan = true;
//     }
//   })
//   , trendInterval
// );

app.use(function(req, res, next) {  
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.header("Access-Control-Allow-Methods", "DELETE, GET, POST")
      next();
 });  

// You can also get the stream in a callback if you prefer.
function beginStream() {
  client.stream('statuses/filter', { track: keywords.join(',') }, function(stream) {
    stream.on('data', function(data) {
      io.emit('tweet', {'message': data.text});
    });

    stream.on('error', function(error) {
      throw error; 
    });
  }); 
}

// us id: 2450022
app.get('/trends', function(req, res) {
  var trendList = [];
  client.get('trends/place', { id:  1}, function(error, json, response) {
    if (error) throw error;
    var trendList = [];
    _.each(json[0].trends, function(trend) {
      trendList.push(trend.name);
    });
    res.send(trendList);
  });
});

app.post('/keywords', function(req, res) {
  keywords.push(req.body.keyword);
  res.status(status.CREATED).end();
});

app.get('/keywords', function(req, res) {
    res.status(status.OK).send(keywords).end();
});

app.delete('/keywords', function(req, res) {
  console.log(req.body.keyword);
  for (var i = 0; i < keywords.length; i++) {
    if (keywords[i] == req.body.keyword) {
      delete keywords[i];
    }
  }
  res.status(status.OK).end();
})

app.listen(80, function() {
    console.log('app listening on port 80');
});

server.listen(3000);