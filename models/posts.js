const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    //linking postschema to userschema so that we can link user who has commented
    user:{
        type : mongoose.Schema.Types.ObjectId,
        //type : mongoose.SchemaTypes.ObjectId
        ref : 'User'
    },
    //include the array of ids of all comments in this post schema itself
    comments :[
        {
            type : mongoose.Schema.Types.ObjectId,
            //type : mongoose.SchemaTypes.ObjectId
            ref : 'Comment'
        }
    ]
},{
        timestamps:true
    }
);


const Post = mongoose.model("Post",postSchema);

module.exports = Post;