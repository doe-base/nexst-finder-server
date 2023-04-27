const express = require('express');
const authController = require('../controllers/auth-controller')
const router = express.Router()
const passport = require('passport');


const app = express()

/*
=============================================================== 
//* Routes associated with google auth
===============================================================
*/
router.get('/login/failed', authController.signin_failed)
router.get('/login/success', authController.signin_success)
router.get('/google/redirect', authController.google_redirect)
router.get('/google', authController.google_signin)



/*
=============================================================== 
//* Routes associated with email auth
===============================================================
*/
router.get('/email/success', authController.checkUser)
router.post('/email', authController.email_auth)
router.post('/email/verify-code', authController.verify_mail)


/*
=============================================================== 
//* Routes associated with facebook auth
===============================================================
*/
// router.get('/facebook/success', authController.facebook_success)
router.get('/facebook/failed', authController.facebook_failed)
router.get('/facebook/redirect', passport.authenticate('facebook', {successRedirect: process.env.CLIENT_URL,failureRedirect: '/auth/facebook/failed'}))
router.get('/facebook', authController.facebook_signin)


router.get('/logout', authController.logout)


module.exports = router