const express = require("express")
require('dotenv').config();
const authRouter = require('./routes/auth-routes')
const userRouter = require('./routes/user-routes')
const cookieSession = require('cookie-session')
const cookies = require('cookie-parser')
const cors= require("cors");
const bodyParser = require('body-parser')
const passport = require("passport")


const app = express()
/*
=============================================================== 
//**  Middelwares
===============================================================
*/
//* Enable cors
const corsOptions ={
    origin: process.env.ORIGIN_URL, 
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

//* Section Cookies
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_CODE]
}));
app.use(cookies());

//* initialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json())




/*
=============================================================== 
//* Routes Setup
===============================================================
*/
app.use('/auth', authRouter)
app.use('/user', userRouter)

/*
=============================================================== 
//* Starting App
===============================================================
*/
app.listen(process.env.PORT, ()=>{
    console.log("starting server on port ", process.env.PORT)
})

 