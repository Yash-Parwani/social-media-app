const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    //linking postschema to userschema so that we can link user who has commented
    user:{
        type : mongoose.SchemaTypes.ObjectId,
        //type : mongoose.SchemaTypes.ObjectId
        ref : 'user'
    }
},{
        timestamps:true
    }
);


const Post = mongoose.model("Post",postSchema);

module.exports = Post;