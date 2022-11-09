const express = require('express');
const router = express.Router();
const controller = require('../../controller/user/signUp');

router.get('/', controller.signUpPage);
router.get('/logout', controller.logout)



// post method
router.post('/signup',controller.signup);
router.post('/signin',controller.doLogin);




module.exports = router;