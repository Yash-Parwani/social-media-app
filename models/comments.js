const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    //comment belongs to a user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //comment belongs to a single post
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    likes : [{
        type: mongoose.Schema.Types.ObjectId,
        // here we know that we have to refer to Likes model only hence we will use ref since we know what to refer
        ref :'Like'
    }]
}, {
    timestamps: true
});

const Comment = mongoose.model('Comment',commentSchema);

module.exports = Comment;