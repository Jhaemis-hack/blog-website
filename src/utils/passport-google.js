const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../server/model/userSchema');
const jwt = require('jsonwebtoken')

passport.use(new GoogleStrategy({
    clientID: process.env.google_client_ID,
    clientSecret: process.env.google_client_Secret, 
    callbackURL: '/google/auth20/login',
    scope: [ 'profile', 'email' ],
    state: true
    },
    async function verify(accessToken, refreshToken, profile, cb) {
        try{
            const email = profile.emails[0].value

            const userExists = await User.findOne({ email: email})
            
            if(userExists) {
                return cb(null, userExists);
            }

            const newUser = new User({
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: email,
                password: profile.id
            });
            await newUser.save();

            return cb(null, newUser);
        } catch (err) {
            console.error('Error in verifying google-profile:', err.message);
            return cb(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        User.findById({ _id: id})
        .then(user => {
            done(null, user)
        })
                    
    } catch (error) {
        console.log(error.message);
    }
}) 

module.exports = passport;