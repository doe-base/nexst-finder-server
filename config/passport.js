const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth20').Strategy
const SQLConnection = require('./sql')

//* Passport auth0 google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/google/redirect',
    scope: ["profile", "email"]

}, (accessToken, refreshToken, profile, done)=>{
    //! check if user already exists in our own db
    const sql1 = `SELECT * FROM google_auth WHERE google_id LIKE '${profile.id}'`
    SQLConnection.query(sql1, (err, result)=>{
        if(err){
            console.log("Error finding", err.sqlMessage)
            res.status(404).json({
                message: "Error: " + err.sqlMessage
              })
        }else{
            if(!result[0]){
                //! if not, create user in our db
                const sql2 = `INSERT INTO google_auth(google_id,user_name) VALUES ('${profile.id}', '${profile.displayName}')`
                SQLConnection.query(sql2, (err, result)=>{
                    if(err){
                        console.log("Error Inserting", err.sqlMessage)
                        res.status(404).json({
                            message: "Error creating user: " + err.sqlMessage
                          })
                    }else{
                        done(null, profile)
                        res.status(200).json({
                            message: "new user created successfully",
                            user : profile.id
                          })
                    }
                })
            }else{
                 //! already have this user
                done(null, profile)
                res.status(200).json({
                    message: "Found existing user",
                    user : profile.id
                  })
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
