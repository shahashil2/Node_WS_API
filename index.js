var express = require("express");

var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}));

var User = require('./models/User');
  

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

      var age = req.body.age;
      var name = req.body.name;
      var email = req.body.email;
      var password = req.body.password;

      // create a new user called chris
        var newuser = new User({
          name: name,
          email: email,
          password: password 
        });
 
         // call the built-in save method to save to the database
        newuser.save(function(err) {
          if (err) throw err;

          console.log('User saved successfully!');
          res.send({
              message:"User Registered Successfully",
              status:200
            });
        });

     
});


app.put('/demoPut', function (req, res) {
  res.send('Put Request Hit');
});

app.delete('/demoDelete', function (req, res) {
  res.send('Delete Request Hit!');
});




