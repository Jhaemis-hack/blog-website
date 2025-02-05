const passport = require('passport');
const GithubStrategy = require('passport-github2');
const User = require('../server/model/userSchema');

passport.use(new GithubStrategy({
    clientID: process.env.github_Client_ID,
    clientSecret: process.env.github_Client_secrets, 
    callbackURL: '/github/Oauth2/login',
    scope: [ 'profile' ],
    state: true
    },
    async function verify(accessToken, refreshToken, profile, cb) {
        try{
            const email = profile.emails[0].value

            if (!email){

                console.log('No email found in GitHub profile')
                return cb(null, false)
            }

            const userExists = await User.findOne({ email: email})
            
            if(userExists) {
                return cb(null, userExists); 
            }

            const newUser = new User({
                firstName: profile.displayName[0],
                lastName: profile.displayName[1],
                email: email,
                password: profile.nodeId
            })
            await newUser.save(); 

            console.log(newUser)

            return cb(null, newUser);
        } catch (err) {
            console.error('Error in verifying google-profile:', err.message);
            return cb(err);
        }
    }
));

module.exports = passport;