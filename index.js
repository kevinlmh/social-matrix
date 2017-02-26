var express = require('express');
var bodyparser = require('body-parser');
var _ = require('underscore');
var status = require('http-status');
var app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

var server = app.listen(process.env.PORT, function() {
    console.log('app listening on port '+ process.env.PORT);
});


var Twitter = require('twit');
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var indico = require('indico.io');
indico.apiKey =  process.env.INDICO_API_KEY;

var response = function(res) { console.log(res); }
var logError = function(err) { console.log(err); }
var calculateColor = function(res) {
  return rgbToHex(Math.round(255-(255*res)), Math.round(255*res), Math.round(25-20*res));
}
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
 
// use array to store keywords for now
// I know this is really bad
// will switch to a database later
var keywords = [];
var trends = [];
//var tweets = [];
var currentStream;
var lasttime = 0;
var limiter = 1;
var counter = 0;

var io = require('socket.io').listen(server);
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
  
  currentStream = client.stream('statuses/filter', { track: keywords.join(','), language: 'en' });
  
  currentStream.on('tweet', function (tweet) {
    if (counter % limiter == 0) {

      indico.sentiment(tweet.text).then(function(result) {
        var t = {
          'text': tweet.text,
          'link': "https://twitter.com/" + tweet.user.screen_name + "/status/"+tweet.id_str,
          'color': calculateColor(result)
        }
        io.emit('tweet', t);
      }).catch(logError);
      counter++;
    }
    var newtime = new Date().getTime();
    if (newtime-lasttime > 500) {
        if (counter > 3) {
            limiter += 1;
        } else if (counter < 1) {
            limiter = Math.max(limiter-1, 1);
        }
        console.log("counter: " + counter);
        console.log("limiter: " + limiter);
        counter = 0;
        lasttime = newtime;
    }
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

app.listen(process.env.PORT, function() {
    console.log('app listening on port '+ process.env.PORT);
});

server.listen(3000, function() {
    console.log('socket server listening on port 3000');
});

