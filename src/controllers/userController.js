const blogSchema = require("../server/model/blogSchema");
const jwt = require('jsonwebtoken');
const User = require('../server/model/userSchema');
const bcrypt = require('bcrypt');
const { response } = require("express");

const getSignUp = (req, res) => {
    let message = ''
    res.render('register.ejs', {message: message})
}

const SignUp = async (req, res) => {
    try {
        const {firstName, lastName, email, password} = req.body;

        const userExist = await User.findOne({ email: email});

        let message

        if(userExist){
            message = 'User already exists, Login Instead'
            return res.render('register.ejs', { message: message })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword
        });

        await user.save();

        return res.redirect('/', 201)
    } catch (error) {
        console.log(error.message);
        if (error.name === 'ValidationError'){
            return res.status(400).json({ message: 'All field are required!' });
        }

        return res.status(500).json({ message: 'Server Error'});
        
    }
}

const getLogin = (req, res) => {
    res.render('login.ejs')
}

const viewAllBlog =async (req, res) => {
    try {
        let category = req.query.category

        if(!category){
            const starred = await blogSchema.find({starred: true})
            category = 'starred Blogs'
            let message = '';
            
            if(starred == [] || starred.length < 1){
                category = ''
                message = "No starred blog yet, view collections"
                return res.render('view-blog', { post: starred, category: category, msg_blog_create: message})
            }

            return res.render('view-blog', { post: starred, category: category, msg_blog_create: message })
        }
        
        const blogCategory = await blogSchema.find({category: category}).populate("imageId")
        let message = '';
        if(blogCategory == [] || blogCategory.length < 1){
            message = `No ${category} blog yet, view collections`
            return res.render('view-blog', { post: blogCategory, category: category, msg_blog_create: message})
        }

        res.render('view-blog', { post: blogCategory, category: category, msg_blog_create: message })
    } catch (error) {
        console.error(error.message);
        let message = "Error loading starred blogs"
        return res.render('view-blog', { msg_blog_create: message})
    }
}

const logIn = async (req, res) => {
    try {
        const {email, password} = req.body;
    
        const isValidUser = await User.findOne({email: email});

        if(!isValidUser){
            return res.status(400).json({ message: 'User not found'});
            
        }

        const isMatch = await bcrypt.compare(password, isValidUser.password);

        if(!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials'});
        }
        
        if(isValidUser.disabled == true ) {
            return res.status(403).json({ message: "Log In Failed", message: 'Your account has been locked.' });
        }

        const token = jwt.sign({ 
            id: isValidUser._id,
            email: isValidUser.email,
            role: isValidUser.role
        }, 
        process.env.Secret, 
        { 
            expiresIn: '1h' 
        });
        req.session.userId = isValidUser._id;        
        res.redirect('/')
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error'});
    }
}

const logOut = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err); // Handle logout error
        }
        res.redirect('/'); // Redirect to the captured URL
    });
};


const landPage = async (req, res) => {
    try {
        const starredBlogs = await blogSchema.find({starred: 'true'})

        if(!starredBlogs){
            return res.status(404).json({message: 'No starred Blog found', data: []})
        }
        
        res.render('index.ejs')        
    } catch (error) {
        console.log(error.message)
        return res.status(404).send("could not render index")
    }
}

const getFInance =async (req, res) => {
    try {
        const finance = await blogSchema.findOne({category: 'finance'})

        if(!finance){
            return res.status(404).json({message: 'No finance found', data: []})
        }

        return res.status(200).json({ finance })
    } catch (error) {
        console.log(error.message)
    }
}

const getTravel =async (req, res) => {
    try {
        const travel = await blogSchema.findOne({category: 'travel'})

        if(!travel){
            return res.status(404).json({message: 'No Travel found', data: []})
        }

        return res.status(200).json({ travel })
    } catch (error) {
        console.log(error.message)
    }
}

const getEntertaiment =async (req, res) => {
    try {
        const entertaiment = await blogSchema.findOne({category: 'entertainment'})

        if(!entertaiment){
            return res.status(404).json({message: 'No entertainment found', data: []})
        }

        return res.status(200).json({ entertaiment })
    } catch (error) {
        console.log(error.message)
    }
}

const getRefreshment =async (req, res) => {
    try {
        const refreshment = await blogSchema.findOne({category: 'refreshment'})

        if(!refreshment){
            return res.status(404).json({message: 'No refreshment found', data: []})
        }

        return res.status(200).json({ refreshment })
    } catch (error) {
        console.log(error.message)
    }
}

const getLifeStyle =async (req, res) => {
    try {
        const lifestyle = await blogSchema.findOne({category: 'lifestyle'})

        if(!lifestyle){
            return res.status(404).json({message: 'No lifestyle found', data: []})
        }

        return res.status(200).json({ lifestyle })
    } catch (error) {
        console.log(error.message)
    }
}

const getScience =async (req, res) => {
    try {
        const science = await blogSchema.findOne({category: 'science'})

        if(!science){
            return res.status(404).json({message: 'No science found', data: []})
        }

        return res.status(200).json({ science })
    } catch (error) {
        console.log(error.message)
    }
}

const getEnvironment =async (req, res) => {
    try {
        const environment = await blogSchema.findOne({category: 'environment'})

        if(!environment){
            return res.status(404).json({message: 'No environment found', data: []})
        }

        return res.status(200).json({ environment })
    } catch (error) {
        console.log(error.message)
    }
}

const getPersonalFinance =async (req, res) => {
    try {
        const personalFinance = await blogSchema.findOne({category: 'personalfinance'})

        if(!personalFinance){
            return res.status(404).json({message: 'No personalFinance found', data: []})
        }

        return res.status(200).json({ personalFinance })
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    landPage,
    getFInance,
    getTravel,
    getEntertaiment,
    getRefreshment,
    getLifeStyle,
    getScience,
    getEnvironment,
    getPersonalFinance,
    SignUp, 
    logIn,
    getLogin,
    getSignUp,
    logOut,
    viewAllBlog,
}