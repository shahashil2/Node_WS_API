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

apiRoutes.use(function(req,res,next){

    console.log('Authentication method called');
    var token = req.body.secret_token || req.query.secret_token || req.headers['x-access-token'];
    //decode token
    if(token){
        // verifies secret
        jwt.verify(token,config.secret,function(err,decode){
            if(err){
                res.json({success:false,message:'Invalid Token'});
            }else{
                req.decode =  decode;
                next();
            }
        });

    }else{
        res.status(403).json({success:false,message:'No token provided'}); //403:Forbidden and user is not authorize to view any data
    }
});


app.use('/api',apiRoutes);

var db = mongoose.connection;
db.once('open',function(){
    console.log('Database connection');
});

app.listen(port);
console.log('Magic happens at http://localhost:' + port);
