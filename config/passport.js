const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook')
const SQLConnection = require('./sql')

//* Passport auth0 google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/google/redirect',
    scope: ["profile", "email"]

}, (accessToken, refreshToken, profile, done)=>{
    //! check if user already exists in our own db
    const sql1 = `SELECT * FROM google_auth WHERE auth_id LIKE '${profile.id}'`
    SQLConnection.query(sql1, (err, result)=>{
        if(err){
            console.log(err.sqlMessage)
        }else{
            if(!result[0]){
                //! if not, create user in our db
                const sql2 = `INSERT INTO google_auth(auth_id,user_name) VALUES ('${profile.id}', '${profile.displayName}')`
                SQLConnection.query(sql2, (err, result)=>{
                    if(err){
                        console.log(err.sqlMessage)
                    }else{
                        const {insertId} = result
                        const sql3 = `SELECT * FROM google_auth WHERE user_id LIKE '${insertId}'`
                        SQLConnection.query(sql3, (err, result) => {
                            if(err){
                                console.log(err.sqlMessage)
                            }else{
                                done(null, result[0])
                            }
                        })
                    }
                })
            }else{
                 //! already have this user
                done(null, result[0])
            }
        }
    })
}))



passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_REDIRECT_URL
  },
  function(accessToken, refreshToken, profile, done) {
    //! check if user already exists in our own db
    const sql1 = `SELECT * FROM facebook_auth WHERE auth_id LIKE '${profile.id}'`
    SQLConnection.query(sql1, (err, result)=>{
        if(err){
            console.log(err.sqlMessage)
        }else{
            if(!result[0]){
                //! if not, create user in our db
                const sql2 = `INSERT INTO facebook_auth(auth_id,user_name) VALUES ('${profile.id}', '${profile.displayName}')`
                SQLConnection.query(sql2, (err, result)=>{
                    if(err){
                        console.log(err.sqlMessage)
                    }else{
                        const {insertId} = result
                        const sql3 = `SELECT * FROM facebook_auth WHERE user_id LIKE '${insertId}'`
                        SQLConnection.query(sql3, (err, result) => {
                            if(err){
                                console.log(err.sqlMessage)
                            }else{
                                done(null, result[0])
                            }
                        })
                    }
                })
            }else{
                 //! already have this user
                 done(null, result[0])
            }
        }
    })
}))

passport.serializeUser((user, done) => {
    done(null, user)
});
passport.deserializeUser((user, done) => {
    done(null, user)
});
