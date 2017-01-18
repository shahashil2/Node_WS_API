const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const User = require('../models/user'); //load user module
const message = require('../utils/responseAlerts'); //get alertMessages file
const validator     = require('validator');
const passwordHash = require('password-hash');
const httpCodes = require('../utils/httpCodes')
//-----------------------------------------
    //POST : /user/login
    //User Login
//-----------------------------------------

exports.login = function(req,res){
    var email = req.body.email;
    var password = req.body.password;

    //validation for email and password
    if(!validator.isEmail(email) || validator.isEmpty(email)){
         res.status(httpCodes.badRequest).json({message:message.invalidEmail,status:httpCodes.badRequest})
    }else if(validator.isEmpty(password)){
        res.status(httpCodes.badRequest).json({message:message.emptyPass,status:httpCodes.badRequest})
    }
    else {
               User.find({email : email},function(err,users){
                    if(err) res.json({message:message.loginFail,status:httpCodes.badRequest});
                    if (users.length > 0){
                        if (passwordHash.verify(password, users[0].password)) {
                            res.json({message: message.successLogin,accessToken:req.accessToken,status:httpCodes.ok});
                        } else {
                            res.status(httpCodes.badRequest).json({ message: message.errorLogin,status:httpCodes.badRequest});
                        }
                    }else{
                        res.status(httpCodes.badRequest).json({message:message.userNotFound,status:httpCodes.badRequest});
                    }
                });
    }
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

   //validate fields
    if(!validator.isEmail(email) || validator.isEmpty(email)){
        res.status(httpCodes.badRequest).json({message:message.invalidEmail,status:httpCodes.badRequest});
    }else if(validator.isEmpty(password)){
        res.status(httpCodes.badRequest).json({message:message.emptyPass,status:httpCodes.badRequest});
    }else if(validator.isEmpty(name)){
         res.status(httpCodes.badRequest).json({message:message.emptyName,status:httpCodes.badRequest});
    }
    else {
        User.find({email:email},function(err,users){
                if(err) res.json({message:message.networkErr,status:httpCodes.badRequest});

                if(users.length > 0){
                    res.json({messgae:message.alreadyRegisterUser,status:httpCodes.badRequest});
                }else{
                    var userData = new User({
                    name : name,
                    email : email,
                    password : hashedPassword,
                });
                
                //save data into database
                userData.save(function(err,userValue){
                    if(err) res.json({message:message.registrationFailed,status:httpCodes.badRequest}); 
                    console.log(userValue)
                    res.status(httpCodes.ok).json({message:message.successRegister,accessToken:req.accessToken,status:httpCodes.created});
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

          if(err) res.json({message:message.loginFail,status:httpCodes.badRequest});

        if(users.length > 0){
             res.status(httpCodes.ok).json({
                       message:message.successUserList,
                       data:users,status:httpCodes.ok
             });
         }
        else {
            return res.status(httpCodes.noContent).send({message:message.noUsersFound,status:httpCodes.ok});
        } 

           
    });
};

//-----------------------------------------
    //POST : /user/forgotPassword
    //User forgotPassword
//-----------------------------------------

exports.forgotPassword = function(req,res){
    var email = req.body.email;

     if(!validator.isEmail(email) || validator.isEmpty(email)){
        res.status(400).json({message:message.invalidEmail,status:httpCodes.badRequest});
     }

      User.find({email:email},function(err,users){
        if(err) res.json({message:message.networkErr,status:httpCodes.networkConnectTimeout});
        var user = users[0];
        if(users.length > 0){
            var config = {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // use SSL 
                auth: {
                    user: 'dipak.singh.sa@gmail.com',
                    pass: 'dipak@sa1'
                }
            };

            // create reusable transporter object using the default SMTP transport 
            var transporter = nodemailer.createTransport(config);

            // setup e-mail data
            var mailOptions = {
                from: '"EMS System" <dipak.singh.sa@gmail.com>',
                to: user.email,
                subject: 'Forgot password request',
                text: 'Hello ' + user.fullName + ', your passsword is, \n password ==> ' + user.password
            };

            // send mail with defined transport object 
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }
                res.json({message: message.successForgotPass,accessToken:req.accessToken,status:httpCodes.ok});
            });
        }       
   });
};


 
