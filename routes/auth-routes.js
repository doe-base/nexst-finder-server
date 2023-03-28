const express = require('express');
const authController = require('../controllers/auth-controller')
const router = express.Router()


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
// router.get('logout', (req, res) => {
//     req.logOut()
//     res.redirect(process.env.CLIENT_URL)
// })



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
router.post('/auth/facebook', authController.facebook_signin)



module.exports = router