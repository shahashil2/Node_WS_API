//-----------------------------------------
    //get the packages
//-----------------------------------------

const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const mongoose    = require('mongoose'); //interact with our MongoDB database
const jwt         = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config      = require('./app/config/config'); // get our config file
const User        = require('./app/models/user'); // get our mongoose model

//-----------------------------------------
    //Configuration
//-----------------------------------------
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('userSecret',config.secret); // secret variable 

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


var apiRoutes = require('./app/routes/api'); //get api routes
app.use('/api',apiRoutes);

var db = mongoose.connection;
db.once('open',function(){
    console.log('Database connection');
});

app.listen(port);
console.log('Magic happens at http://localhost:' + port);
