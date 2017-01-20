var express = require('express');
var app = express();
var router = express.Router(); // get an instance of the router for api routes
var userCtrl = require('../controllers/userController');
const auth = require('../utils/authorization')
//---------------------------------------------------
    //User API
//---------------------------------------------------
router.route('/users').get(auth.checkAuth,userCtrl.users);
router.route('/user/getDetail').get(auth.checkAuth,userCtrl.userDetails);
router.route('/user/login').post(auth.generataToken,userCtrl.login);
router.route('/user/signUp').post(auth.generataToken,userCtrl.userRegister);
router.route('/user/forgotPassword').post(auth.generataToken,userCtrl.forgotPassword);

module.exports = router;
