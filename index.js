var express = require('express');
var bodyparser = require('body-parser');
var server = require('http').createServer(app);
var _ = require('underscore');
var status = require('http-status');
var app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

var Twitter = require('twit');
var client = new Twitter({
  consumer_key: 'D7FJRxEaDTfsIeINim3LfRh6L',
  consumer_secret: 'SmUDoSCH1lYZWF5wkGNut0aJ8ze2PE1NDNNhygQuQom9GPJ2Oc',
  access_token: '1069974536-qtR9DEEhCfciHd30EAPQBe9OLFqBeVRl2YO24Ke',
  access_token_secret: 'unhCgl9kPy8jMj0BNqIfOq3PhRFDgvJBp1kWmI8N4vNkG'
});
 
// use array to store keywords for now
// I know this is really bad
// will switch to a database later
var keywords = [];
var trends = [];
var tweets = [];
var currentStream;

var io = require('socket.io')(server);
io.on('connection', function(client){
    console.log("a socket connection");
    client.on('startstream', function() {
      console.log("start streaming");
      refreshStream();
    });
});

app.use(function(req, res, next) {  
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.header("Access-Control-Allow-Methods", "DELETE, GET, POST")
      next();
 });  

// You can also get the stream in a callback if you prefer.
function refreshStream() {
  if (currentStream)
    currentStream.stop();
  
  currentStream = client.stream('statuses/filter', { track: keywords.join(',') });
  
  currentStream.on('tweet', function (tweet) {
    // console.log(tweet);
    var t = {
      'text': tweet.text,
      'link': "https://twitter.com/" + tweet.user.screen_name + "/status/"+tweet.id_str
    }
    tweets.push(t);
    io.emit('tweet', t);
  });
}

// us id: 2450022
app.get('/trends', function(req, res) {
  client.get('trends/place', { id:  2450022}, function(error, json, response) {
    if (error) throw error;
    trends = [];
    _.each(json[0].trends, function(t) {
      trends.push(t.name);
    });
    res.send(trends);
  });
});

app.post('/keywords', function(req, res) {
  keywords.push(req.body.keyword);
  res.status(status.CREATED).end();
  refreshStream();
});

app.get('/keywords', function(req, res) {
    res.status(status.OK).send(keywords).end();
});

app.delete('/keywords', function(req, res) {
  var i = 0;
  while (i < keywords.length) {
    if (keywords[i] == req.body.keyword) {
       keywords.splice(i, 1);
    }
    i = i+1;
  }
  res.status(status.OK).end();
  refreshStream();
})

app.listen(80, function() {
    console.log('app listening on port 80');
});

server.listen(3000);