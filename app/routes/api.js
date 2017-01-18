var express = require('express');
var app = express();
var router = express.Router(); // get an instance of the router for api routes
var userCtrl = require('../controllers/userController');
const auth = require('../utils/authorization')
//---------------------------------------------------
    //User API
//---------------------------------------------------
console.log(userCtrl);
router.use(auth.checkAuth)
router.route('/users').get(userCtrl.users);
router.route('/user/login').post(userCtrl.login);
router.route('/user/signUp').post(userCtrl.userRegister);
router.route('/user/forgotPassword').post(userCtrl.forgotPassword);


module.exports = router;
