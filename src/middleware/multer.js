const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({})

const fileFilter = (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    if (ext != '.jpg' && ext != '.jpeg' && ext != '.png') {
        cb(new Error('File type not supported'), false);
        return;
    }
    cb(null, true);
} 
  
const upload = multer({ storage: storage, fileFilter})

module.exports = upload