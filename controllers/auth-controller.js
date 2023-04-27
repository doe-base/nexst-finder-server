const transporter = require('../config/mailer')
var voucherCodes = require('voucher-code-generator')
const jwt = require('jsonwebtoken')
const SQLConnection = require('../config/sql')
const generateUniqueId = require('generate-unique-id');
const passport = require("passport")
const passportSetup = require("../config/passport")


var userEmail = ''
var verificationCode = voucherCodes.generate({
    length: 4,
    count: 1,
    charset: process.env.VERIFICATION_CODE_CHARSET
})
verificationCode = verificationCode[0]


/*
=============================================================== 
//**  Functions
===============================================================
*/
//**  Create JWT
const createToken =(id)=>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: 365 * 24 * 60 * 60 
    })
}
//**  Check User
const checkUser = (req, res, next)=>{
   const token =  req.cookies.jwt
   if(token){
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken)=>{
        if(err){
            res.status(401).json({error: true, message: "Unauthorized"})
            next()
        }else{
            let user = decodedToken.id
            res.status(200).json({
                error: false,
                message: 'Log in success',
                user: user
            })
            next()
        }
    })
   }else{
    res.status(401).json({error: true, message: "Unauthorized"})
   }
}
const logout = (req, res) => {
    req.logout()
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect(process.env.CLIENT_LOGOUT_URL)
}


/*
=============================================================== 
//* Controller associated with google auth
===============================================================
*/
const signin_failed = (req, res)=>{
    res.status(401).json({
        error: true,
        message: 'Log in failure',
    })
}

const signin_success = (req, res, next)=>{
    if(req.user){
        res.status(200).json({
            error: false,
            message: 'Log in success',
            user: req.user
        })
    }else{
        res.status(403).json({error: true, message: "Not Authorized"})
    }
}

const google_redirect = passport.authenticate('google', {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/auth/login/failed",
}) 

const google_signin = passport.authenticate('google', {
    scope: ['profile']
})


/*
=============================================================== 
//* Controllers associated with email auth
===============================================================
*/
const email_auth = (req, res) => {

    const mailBody = `Hi,  welcome to Nexst Finder, <br/><br/> You need to verify your mail before access your account. <br/><br/> Use this code to verify your mail: <strong>${verificationCode}</strong> <br/><br/>If you didn't request this account verification on the Nexst Finder platform, you can safely ignore this email. Someone else might have typed your email address by mistake.<br/><br/>Thanks<br/>The Nexst Finder account team`
    userEmail = req.body.UserEmail

    var mailOptions = {
        from: process.env.SERVICE_EMAIL_NAME,
        to: userEmail,
        subject: 'Your verification Code on Nexst Finder',
        html: mailBody
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.status(404).json({
            message: "Error: " + error.message
          })
        } else {
          res.status(204).json({
            message: "Success"
          })
        }
      });
}

const verify_mail = function (req, res) {
    const code =  req.body.Code
    if(code === verificationCode && userEmail){
        //Check if email already exists in our database
        const sql1 = `SELECT * FROM email_auth WHERE user_email LIKE '${userEmail}'`
        SQLConnection.query(sql1, (err, result)=>{
            if(err){
                console.log(err.sqlMessage)
                res.status(404).json({
                    message: "Error: " + err.message
                  })
            }else{
                if(!result[0]){
                    //Store user in database
                    const newEmailId = generateUniqueId()
                    const sql = `INSERT INTO email_auth(user_email, auth_id) VALUES ('${userEmail}', '${newEmailId}')`
                    SQLConnection.query(sql, (err, result)=>{
                        if(err){
                            console.log(err.sqlMessage)
                        }else{
                            const sql = `SELECT * FROM email_auth WHERE user_email='${userEmail}'`
                            SQLConnection.query(sql, (err, result)=>{
                                if(err){
                                    console.log(err.sqlMessage)
                                }else{
                                    // create session token
                                    const token = createToken(result[0])
                                    res.cookie('jwt', token, {
                                        httpOnly: true,
                                        maxAge: 365 * 24 * 60 * 60 * 1000
                                    })
                                    res.status(201).json({user: result[0]})
                                }
                            })
                            
                        }
                    })
                }else{

                    // create session token
                    const token = createToken(result[0])
                    const {complete} = result[0]
                    res.cookie('jwt', token, {
                        httpOnly: true,
                        maxAge: 365 * 24 * 60 * 60 * 1000
                    })
                    res.status(201).json({user: result[0]})
                }
            }
        })
    }else{
        console.log('failed, code no match')
        res.status(404).json({
            message: "Error: code does not match",
          })
    }
}

/*
=============================================================== 
//* Controllers associated with facebook auth
===============================================================
*/

const facebook_failed = (req, res)=>{
    res.status(401).json({
        error: true,
        message: 'Log in failure',
    })
}

const facebook_signin = passport.authenticate('facebook', {scope: 'email'})

module.exports = {
    checkUser,
    signin_failed,
    signin_success,
    google_redirect,
    google_signin,
    logout,
    email_auth,
    verify_mail,
    facebook_signin,
    facebook_failed
}