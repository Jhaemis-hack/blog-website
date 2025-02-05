require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./server/config/server');
const app = express();
const passport = require('passport');
const expressLayout = require('express-ejs-layouts')
const { jwtCheck, jwtAuth } = require('./Protection/Auth-Config/Auth');
const bodyParser = require('body-parser');
const User = require('./server/model/userSchema');


// route activity logging config
app.use(morgan('dev'))

// parse application/json and application/x-www-form-urlencoded
app.use(express.json())

// database configuration
connectDB()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// templating engine
app.use(express.static('public')); 
app.use(expressLayout);
app.set('layout', './layouts/main')
app.set('view engine', 'ejs');

// session middleware
app.use(require('express-session')({ secret:'keyboard cat', 
    resave: false, saveUninitialized: false, cookie: { secure: false }}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// //jwt middleware
// app.use(jwtCheck())
// app.use(jwtAuth())

app.use(async (req, res, next) => {
    const userId = req.session.userId
    

    if(userId !== undefined){
        req.user = await User.findOne({_id: userId})
        req.local.isAuth = req.isAuthenticated();
    }

    if(req.user === undefined) {
        res.locals.user = null
    }else{
        res.locals.user = req.user;
        req.local.isAuth = req.isAuthenticated();
    }
    next();
})

// routes middleware
app.use('', require('./server/routes/userRoute'))
app.use('', require('./server/routes/adminRoute'))

// error handling middleware
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Invalid or missing token' });
    }
    console.log(err)
    next(err);
}); 

// server listener
app.listen(process.env.PORT, (err, res)=>{
    console.log(`app listenning at : http://localhost:${process.env.PORT}`)
})