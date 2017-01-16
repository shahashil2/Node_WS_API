var express = require("express");

var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}));


app.listen(1991, function () {
  console.log('Example app listening on port 1991!');
});


app.get('/demoGet', function (req, res) {
  // res.send('Get Request Hit')
  res.send(req.body);
});


app.post('/demoPost', function (req, res) {
if (!req.headers) {
    console.log('No headers added');
  } else {
    console.log('HEADERS are ');
    console.log(req.headers);
  }
  res.send(req.body);
});


app.put('/demoPut', function (req, res) {
  res.send('Put Request Hit');
});

app.delete('/demoDelete', function (req, res) {
  res.send('Delete Request Hit!');
});

