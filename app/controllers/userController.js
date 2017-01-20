const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const User = require('../models/user'); //load user module
const message = require('../utils/responseAlerts'); //get alertMessages file
const validator     = require('validator');
const passwordHash = require('password-hash');
const httpCodes = require('../utils/httpCodes')
const url       = require('url')

//-----------------------------------------
    //POST : /user/login
    //User Login
//-----------------------------------------

exports.login = function(req,res){
    var email = req.body.email;
    var password = req.body.password;

    //validation for email and password
    if(!validator.isEmail(email) || validator.isEmpty(email)){
         res.status(httpCodes.badRequest).json({success:false,message:message.invalidEmail})
    }else if(validator.isEmpty(password)){
        res.status(httpCodes.badRequest).json({success:false,message:message.emptyPass})
    }
    else {
               User.find({email : email},function(err,users){
                    if(err) res.status(httpCodes.badRequest).json({success:false,message:message.loginFail});
                    if (users.length > 0){
                        if (passwordHash.verify(password, users[0].password)) {
                            res.status(httpCodes.ok).json({success:true,message: message.successLogin,accessToken:req.accessToken});
                        } else {
                            res.status(httpCodes.badRequest).json({success:false, message: message.errorLogin});
                        }
                    }else{
                        res.status(httpCodes.badRequest).json({success:false,message:message.userNotFound});
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
        res.status(httpCodes.badRequest).json({success:false,message:message.invalidEmail});
    }else if(validator.isEmpty(password)){
        res.status(httpCodes.badRequest).json({success:false,message:message.emptyPass});
    }else if(validator.isEmpty(name)){
         res.status(httpCodes.badRequest).json({success:false,message:message.emptyName});
    }
    else {
        User.find({email:email},function(err,users){
                if(err) res.status(httpCodes.badRequest).json({success:false,message:message.networkErr});

                if(users.length > 0){
                    res.status(badRequest).json({success:false,messgae:message.alreadyRegisterUser});
                }else{
                    var userData = new User({
                    name : name,
                    email : email,
                    password : hashedPassword,
                });
                
                //save data into database
                userData.save(function(err,userValue){
                    if(err) res,status(httpCodes.badRequest).json({success:false,message:message.registrationFailed}); 
                    console.log(userValue)
                    res.status(httpCodes.ok).json({success:true,message:message.successRegister,accessToken:req.accessToken});
                });
                }     
        });
    }
   
};

//-----------------------------------------
    //GET : /user/detail
    //GET users detail
//-----------------------------------------
exports.userDetails = function(req,res){
        
        var email = '';

        var urlquery = url.parse(req.url, ['email']);
       
        if(urlquery.query.email){
            var emailString = String(urlquery.query.email)
            emailString = emailString.replace(/\s+/g, '');
            if(validator.isEmail(emailString)){
                email = emailString;
            }

        }
        var queryParts = [];

        if(urlquery.query.fields){
            var field = String(urlquery.query.fields) ;
            queryParts = field.split(',')
        }

        User.find({email:email},queryParts.join(' '),function(err,users){
                if(err) res.status(httpCodes.badRequest).json({success:false,message:message.loginFail});

                if(users.length > 0){
                    res.status(httpCodes.ok).json({
                            success:true,
                            message:message.successUserList,
                            data:users
                    });
                }
                else {
                    return res.status(httpCodes.noContent).send({success:true,message:message.noUsersFound});
                } 
        });
} 

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

          if(err) res.json({success:false,message:message.loginFail});

        if(users.length > 0){
             res.status(httpCodes.ok).json({
                       success:true,
                       message:message.successUserList,
                       data:users
             });
         }
        else {
            return res.status(httpCodes.noContent).send({success:true,message:message.noUsersFound});
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
        res.status(httpCodes.badRequest).json({success:false,message:message.invalidEmail});
     }

      User.find({email:email},function(err,users){
        if(err) res.status(httpCodes.badRequest).json({success:false,message:message.networkErr});
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


 
