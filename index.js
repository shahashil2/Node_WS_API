var express       = require("express");
var validator     = require('validator');
var bodyParser    = require("body-parser");
var passwordHash = require('password-hash');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}));

var User = require('./app/modules/User');

app.listen(1991, function () {
  console.log('Example app listening on port 1991!');
});


app.get('/api/users', function (req, res) {

    var userExclusion = {
      __v: false,
      password: false,
      created_at:false,
      _id:false
    };
    User.find({},userExclusion,function(err,users){
          var data = [];

          if (!users.length) return res.send({message:'User not Found',status:200});

          res.send({
            message:'Users Found Successfully',
            data:users,
            status:200
          });
    });
});

app.post('/api/user/login',function(req,res){

    var userPwd   = req.body.password;
    var userEmail = req.body.email;

    if(validator.isEmail(userEmail)) {

          User.findOne({email:userEmail},function(err,user){
                  if (err) throw err;
                  if(!user) {
                     res.send({
                        message:'User not found',
                        status:200
                    });
                  }
                  else {
                    if(passwordHash.verify(userPwd, user.password)){
                         res.send({
                              message:'User Successfully logged In',
                              status:200
                         });
                    }
                  }
                    // object of the user
                    console.log(user);
              });
    }
    
});

app.post('/api/user', function (req, res) {
    if (!req.headers) {
        console.log('No headers added');
      } else {
        console.log('HEADERS are');
        console.log(req.headers);
      }

      var name = req.body.name;
      var email = req.body.email;
      var password = req.body.password;

      //Validation to check if Name,Email,Password are valid and not empty
      if(validator.isEmpty(name)){
          res.send({
            message:'Your Name must contain more than one letter',
            status:403
          });
      }
      else if (!validator.isEmail(email)){
        res.send({
            message:'You have entered an invalid email address',
            status:403
          });
      }
      else if(validator.isEmpty(password)){
          res.send({
            message:'Your password must contain more than one letter',
            status:403
          });
      }
      else {

          //Check if the User with this email already exists or not
           User.findOne({email:email},function(err,user){
                  if (err) throw err;

                  if(user && user.email == email) {
                      res.send({
                        message:'Entered email already exits in out database.Please try another one',
                        status:200
                    });
                  }
                  else {
                      // create a new user
                      var hashedPassword = passwordHash.generate(password);

                      var newuser = new User({
                              name: name,
                              email: email,
                              password: hashedPassword 
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
                  }
                    // object of the user
                    console.log(user);
              });

        
      }     
});





