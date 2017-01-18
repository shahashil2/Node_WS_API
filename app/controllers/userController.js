const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const User = require('../models/user'); //load user module
const message = require('../utils/responseAlerts'); //get alertMessages file
const validator     = require('validator');
const passwordHash = require('password-hash');
//-----------------------------------------
    //POST : /user/login
    //User Login
//-----------------------------------------

exports.login = function(req,res){
    var email = req.body.email;
    var password = req.body.password;

    //validation for email and password
    if(!validator.isEmail(email) || validator.isEmpty(email)){
         res.status(400).json({success:false,message:message.invalidEmail})
    }else if(validator.isEmpty(password)){
        res.status(400).json({success:false,message:message.emptyPass})
    }

    User.find({email : email},function(err,users){
        if(err) res.json({success:false,message:message.loginFail});
        if (users.length > 0){
              if (bcrypt.compareSync(password, users[0].password)) {
                var token = jwt.sign({id:users[0].id},config.secret);
                res.json({ success: true, message: message.successLogin, user: users[0],secret_token:token});
            } else {
                res.status(400).json({ success: false, message: message.errorLogin});
            }
        }else{
            res.status(400).json({success:false,message:message.userNotFound});
        }
    });
};


//-----------------------------------------
    //POST : /user/userRegister
    //User registration
//-----------------------------------------

exports.userRegister = function(req,res){
   
   var email = req.body.email;
   var name = req.body.name;
   var password = req.body.password;

   var hashedPassword = passwordHash.generate(password);

   console.log(req.accessToken);

   //validate fields
    if(!validator.isEmail(email) || validator.isEmpty(email)){
        res.status(400).json({success:false,message:message.invalidEmail});
    }else if(validator.isEmpty(password)){
        res.status(400).json({success:false,message:message.emptyPass});
    }else if(validator.isEmpty(name)){
         res.status(400).json({success:false,message:message.emptyName});
    }
    else {
        User.find({email:email},function(err,users){
                if(err) res.json({success:false,message:message.networkErr});

                if(users.length > 0){
                    res.json({success:false,messgae:message.alreadyRegisterUser});
                }else{
                    var userData = new User({
                    name : name,
                    email : email,
                    password : hashedPassword,
                });
                
                //save data into database
                userData.save(function(err,userValue){
                    if(err) res.json({success:false,message:message.registrationFailed}); 
                    console.log(userValue)
                    res.status(200).json({success:true,message:message.successRegister,accessToken:req.accessToken});
                });
                }     
        });
    }
   
};

//-----------------------------------------
    //GET : /users
    //GET all users list
//-----------------------------------------

exports.users = function(req,res){
    var userExclusion = {
      __v: false,
      password: false,
      created_at:false,
      _id:false
    };
    User.find({},userExclusion,function(err,users){
          var data = [];

          if (!users.length) return res.send({sucess:false,message:message.noUsersFound});

          res.send({
            message:message.successUserList,
            data:users,
          });
    });
};

//-----------------------------------------
    //POST : /user/forgotPassword
    //User forgotPassword
//-----------------------------------------

exports.forgotPassword = function(req,res){
    var email = req.body.email;

     if(!validator.isEmail(email) || validator.isEmpty(email)){
        res.status(400).json({success:false,message:message.invalidEmail});
     }

      User.find({email:email},function(err,users){
        if(err) res.json({success:false,message:message.networkErr});
        var user = users[0];
        if(users.length > 0){
            var config = {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // use SSL 
                auth: {
                    user: 'krupa.patel.sa@gmail.com',
                    pass: 'krupa@123'
                }
            };

            // create reusable transporter object using the default SMTP transport 
            var transporter = nodemailer.createTransport(config);

            // setup e-mail data
            var mailOptions = {
                from: '"EMS System" <krupa.patel.sa@gmail.com>',
                to: user.email,
                subject: 'Forgot password request',
                text: 'Hello ' + user.fullName + ', your passsword is, \n password ==> ' + user.password
            };

            // send mail with defined transport object 
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }
                res.json({ success: true, message: message.successForgotPass});
            });
        }       
   });
};


 
