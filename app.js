const express = require("express")
const passport = require("passport")
require('dotenv').config();
const cookieSession = require('cookie-session')
const passportSetup = require("./passport")
const cors= require("cors");

const app = express()




//* Enable cors
const corsOptions ={
    origin:'http://localhost:8080', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}
app.use(cors(corsOptions)) // Use this after the variable declaration


//* set up session cookies
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_CODE]
}));
//** */ initialize passport
app.use(passport.initialize());
app.use(passport.session());





//* Routes
app.get('/auth/login/failed', (req, res)=>{
    res.status(401).json({
        error: true,
        message: 'Log in failure',
    })
})
app.get('/auth/login/success', (req, res)=>{
    if(req.user){
        res.status(200).json({
            error: false,
            message: 'Log in success',
            user: req.user
        })
    }else{
        res.status(403).json({error: true, message: "Not Authorized"})
    }
})

app.get('/auth/google/redirect', passport.authenticate('google', {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/auth/login/failed",
}) )
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
}))

// app.get('logout', (req, res) => {
//     req.logOut()
//     res.redirect(process.env.CLIENT_URL)
// })


// Start the server
app.listen("3000", ()=>{
    console.log("starting server on port 3000")
})

 