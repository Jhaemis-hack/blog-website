const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BlogCategory',
        required: true
    },
   imageUrl:[
        {
            type: String,
            required: true
        }
    ],
},
{
    timestamps: true,
    collection: 'image'
});

module.exports = mongoose.model('image', imageSchema);