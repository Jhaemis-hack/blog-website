const { default: mongoose } = require("mongoose");
const blogSchema = require("../server/model/blogSchema");
const imageSchema = require("../server/model/imageSchema");
const userSchema = require("../server/model/userSchema");
const cloudinary = require('../utils/cloudinary')

const getUsers = async (req, res) =>{
    try {
        const users = await userSchema.find({role: "user"});

    if(!users){
        return res.status(404).json({message: 'No user found', data: []})
    }

    return res.status(200).json({ users })
    } catch (error) {
        console.log(error);
    }
}

const getUser = async (req, res) => {
    try {
        const email = req.params.email

        const user = await userSchema.findOne({email});

        if(!user){
            return res.status(404).json({message: 'User not found', data: []})
        }

        return res.status(200).json({ user })
    } catch (error) {
        console.log(error.message);
        
    }
}

const getPostBlog = (req, res) => {
    let message = ''
    res.render('create-post', {msg_blog_create: message})
}

const postBlog =async (req, res) => {
    try {
        const { category, headline, author, picTaker, story, starred } = req.body;

        let message

        if(!category || !headline || !author || !story ){
            message = 'category, headline, author, story fields are required'
            return res.render('create-post', {msg_blog_create: message})
        }

        const newPost = new blogSchema({
            category,
            headline,
            author,
            picTaker,
            story, 
            starred,
        })
        
        const image_1 = await cloudinary.uploader.upload(req.files[0].path)
        const image_2 = await cloudinary.uploader.upload(req.files[1].path)
        const image_3 = await cloudinary.uploader.upload(req.files[2].path)
        const image_4 = await cloudinary.uploader.upload(req.files[3].path)
        const image_5 = await cloudinary.uploader.upload(req.files[4].path)
        
        session = await mongoose.startSession()

        const transactionOptions = { 
            writeConcern: { w: "majority" },
            readConcern: { level: "local" },
            readPreference: "primary"
        }

        try {
            const transactionResult = await session.withTransaction(
                async () => {
                    const newPostSession = await newPost.save({session});

                    if(!newPostSession){
                        await session.abortTransaction();
                        console.log('newPostSession: ' + newPostSession)
                    }
                    
                    const newImageUpload = new imageSchema({
                        category: newPostSession.category,
                        categoryId: newPostSession._id,
                        imageUrl: [
                            image_1.secure_url,
                            image_2.secure_url,
                            image_3.secure_url,
                            image_4.secure_url,
                            image_5.secure_url,
                        ]
                    })
                    const imageUploadSession = await newImageUpload.save({session})
                    

                    if(!imageUploadSession){
                        await session.abortTransaction();
                        console.log('imageUploadSession: ' + imageUploadSession)
                    }

                    const blogId = newPostSession._id

                    const headlineImageUrl = newImageUpload.imageUrl[0] 


                    const updateBlog = await blogSchema.findByIdAndUpdate(
                        { _id: blogId }, 
                        { 
                          $set: { 
                            imageId: newImageUpload._id, 
                            headlineImageUrl: headlineImageUrl 
                          } 
                        }, 
                        { session, new: true } // 'new: true' returns the updated document
                    );
                      
                    if(!updateBlog) {
                        await session.abortTransaction();
                        console.log('updateBlog: '+ updateBlog)
                    }
                }, transactionOptions)

                // if(!transactionResult){
                //     console.log({msg:'Transaction aborted due to some bugs', transactionResult})
                // } else{
                //     console.log('Transaction succeeded')
                // }
    
        } catch (error) {
            console.error(error)
        } finally {
            await session.endSession() 
        } 

        return res.redirect('/view/blogs')
    } catch (error) {
        console.log(error)
        return res.status(404).json({ message: 'Blog could not be created'})
    }
}

const updateBlog = async (req, res) => {
    try {
        const id = req.params.id;

        const imageExist = await imageSchema.findOne({_id: id});

        if(!imageExist) {
            return res.status(404).json({message: 'Blog does not exist', data: []})
        }
        
        const blogId = imageExist.categoryId
        const headlineImageUrl = imageExist.imageUrl[0] 

        const h = await blogSchema.findByIdAndUpdate({_id:blogId}, {$set:{imageId: id}}, {$set: {headlineImageUrl: headlineImageUrl}})
        console.log(h)
        return res.status(201).json({ message: 'Blog updated successfully' })
    } catch (error) {
        console.log(error.message)
        return res.status(404).json({ message: 'Blog could not be updated'})
    }
}

const viewBlog = async (req, res) => {
    try {
        const id = req.params.id

        const isBlogExist = await blogSchema.findOne({_id: id}).populate('imageId')

        if(!isBlogExist){
            return res.status(404).json({message: 'Blog does not exist', data: []})
        }

        return res.status(200).json({ isBlogExist })
    } catch (err) {
        console.log(err.message)
        return res.status(404).json({ message: 'Server Error'})
    }
}

const viewImages = async (req, res) => {
    try {
        const id = req.params.id

        const isImageExist = await imageSchema.findOne({_id: id}).populate('categoryId')

        if(!isImageExist){
            return res.status(404).json({message: 'Blog does not exist', data: []})
        }

        return res.status(200).json({ isImageExist })
    } catch (err) {
        console.log(err.message)
        return res.status(404).json({ message: 'Server Error'})
    }
}

const deleteBlog = async (req, res) => {
    try {
        const id = req.params.id

        const isBlogExist = await blogSchema.findOne({_id: id})

        if(!isBlogExist){
            return res.status(404).json({message: 'Blog does not exist', data: []})
        }

        await blogSchema.findOneAndDelete({_id: id})
        
        return res.redirect('/view/blogs')
    } catch (error) {
        console.log(error.message)
        return res.status(404).json({ message: 'Could not delete blog'})
    }  
}

const postImages =async (req, res) => {
    try {
        const id = req.params.id;

        const isBlogExist = await blogSchema.findOne({_id: id})

        if(!isBlogExist){
            return res.status(404).json({message: 'Blog does not exist', data: []})
        }

        const image_1 = await cloudinary.uploader.upload(req.files[0].path)
        const image_2 = await cloudinary.uploader.upload(req.files[1].path)
        const image_3 = await cloudinary.uploader.upload(req.files[2].path)
        const image_4 = await cloudinary.uploader.upload(req.files[3].path)
        const image_5 = await cloudinary.uploader.upload(req.files[4].path)

        const newImageUpload = new imageSchema({
            category: isBlogExist.category,
            categoryId: id,
            imageUrl: [
                image_1.secure_url,
                image_2.secure_url,
                image_3.secure_url,
                image_4.secure_url,
                image_5.secure_url,
            ]
        })
        await newImageUpload.save()

        return res.status(201).json({msg: 'image uploaded successfully'})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({msg: 'Error saving images to database'})
    }
}

module.exports = {
    getUsers,
    getUser,
    postBlog,
    viewBlog,
    deleteBlog,
    postImages,
    updateBlog,
    viewImages,
    getPostBlog,
};