const router = require('express').Router();
const { getUsers, getUser, viewBlog, deleteBlog, postBlog, postImages, viewImages, updateBlog, getPostBlog } = require('../../controllers/adminController');
const upload = require('../../middleware/multer');
const { jwtAuth, jwtCheck } = require('../../Protection/Auth-Config/Auth');

router.get('/users', jwtAuth(), getUsers)

router.get('/user/:email', jwtAuth(), getUser) 

router.post('/create/blog', upload.array('photos', 6), postBlog)

router.post('/blog/:id/delete', deleteBlog)

router.get('/blog/:id/delete', deleteBlog)

router.get('/blog/:id',  jwtCheck(),viewBlog)

router.post('/append/Image/:id', updateBlog)

router.get('/blog/images/:id', viewImages)

router.post('/blogImage/category/:id', upload.array('photos', 6), postImages)

router.get('/create/blog', getPostBlog)

module.exports = router
