//Base setup
// ~~~~~~~~~~~~~~~


//Call the packages we need
var express    = require('express');        // call express 4.0 framework
var app        = express();                 // define our app using express
var bodyParser = require('body-parser')     // use bodyparser framework for parsing the request body

// configure app to use bodyParser()
// this will let us get the data from a Http Request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// ~~~~~~~~~~~~~~~

var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Hooray! welcome to our api!' });   
});


// more routes for our API will happen here


// REGISTER OUR ROUTES ~~~~~~~~~~~
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// ~~~~~~~~~~~~~~~
app.listen(port,function () {
  console.log('You are listening to port ' + port);
});

