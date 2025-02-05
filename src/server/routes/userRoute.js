const passport = require('../../utils/passport-google')
const passportGithub = require('../../utils/passport-github')
const { landPage, getFInance, getTravel, getLifeStyle, getEntertaiment, getRefreshment, getScience, getEnvironment, getPersonalFinance, SignUp, logIn, getLogin, getSignUp, logOut, viewAllBlog } = require('../../controllers/userController');
const { getPostBlog } = require('../../controllers/adminController');
const isAuthenticated = require('../../middleware/isAuthenticated');
const router = require('express').Router();

router.get('/', landPage)

router.get('/Finance', getFInance)

router.get('/Travel', getTravel)

router.get('/Lifestyle', getLifeStyle)

router.get('/Entertainment', getEntertaiment)

router.get('/Refreshment', getRefreshment)

router.get('/Science', getScience)

router.get('/Environment', getEnvironment)

router.get('/PersonalFinance', getPersonalFinance)

router.post('/signup', SignUp);

router.get('/signup', getSignUp)

router.get('/login', getLogin)

router.post('/login', logIn);

router.get('/logout', logOut);

router.get('/view/blogs',viewAllBlog)

router.get('/google/login', passport.authenticate('google'));

router.get('/github/login', passportGithub.authenticate('github'));

router.get('/google/auth20/login', passport.authenticate('google', { failureRedirect: '/google/login', successRedirect: '/' }))

router.get('/github/Oauth2/login', passportGithub.authenticate('github', { failureRedirect: '/login', successRedirect: '/' }))

module.exports = router