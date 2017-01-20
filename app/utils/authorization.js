require('dotenv').config()
var express = require('express');
const jwt   = require('jsonwebtoken');

exports.checkAuth = function(req,res,next){

    var token = req.body.secret_token || req.query.secret_token || req.headers['x-access-token'];
    //decode token
    if(token){
        // verifies secret
        jwt.verify(token,process.env.secret,function(err,decode){
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
}

exports.generataToken = function(req,res,next){
        const jwtToken = jwt.sign('user', process.env.SECRET_TOKEN, {
                // expiresIn: 1440// expires in 24 hours
        });

        console.log(jwtToken);
        req.accessToken = jwtToken;
        next();
}