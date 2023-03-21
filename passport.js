const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mySQLSetup = require('./sql')
const SQLConnection = require('./sql')

//* Passport auth0 google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/google/redirect',
    scope: ["profile", "email"]

}, (accessToken, refreshToken, profile, done)=>{
    // console.log('user profile from google', profile)

    //! check if user already exists in our own db
    const sql1 = `SELECT * FROM google_auth WHERE google_id LIKE '${profile.id}'`
    SQLConnection.query(sql1, (err, result)=>{
        if(err){
            console.log("Error finding", err.sqlMessage)
        }else{
            // console.log("result from finding", result[0])
            if(!result[0]){
                //! if not, create user in our db
                const sql2 = `INSERT INTO google_auth(google_id,user_name) VALUES ('${profile.id}', '${profile.displayName}')`
                SQLConnection.query(sql2, (err, result)=>{
                    if(err){
                        console.log("Error Inserting", err.sqlMessage)
                    }else{
                        done(null, profile)
                    }
                })
            }else{
                 //! already have this user
                // console.log('user is: ', result[0])
                done(null, profile)
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
