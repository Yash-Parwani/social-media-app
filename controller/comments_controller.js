const Comment = require("../models/comments");
const Post = require("../models/posts");


module.exports.create = function(request,response){
    // checking if post actually exits and creating comment only if post exits
    // because if someone plays with html and tries to fiddle with our website so we should counter it
    Post.findById(request.body.postId,function(error,post){
        if(error){
            console.log("Error in finding post for commenting");
            console.log("Error message: ",error);
            return;

        }
        //if post found then create comment
        if(post){
         //since post is found we have to create comment
         Comment.create({
             content: request.body.content,
             post: request.body.postId,
             //user will not be present in body , it will be present in reequest since we set user inside it in functionn setAuthentication function
             user: request.user._id
         },function(error,comment){
            if(error){
                console.log("Error in creating comment");
                console.log("Error message: ",error);
                return;
    
            }
            // here comment gets created so we need to update comment id in post object
            post.comments.push(comment);
            post.save();

            return response.redirect("/");
         })
        }//else if post not found simply return
        else{
            return response.redirect("back");
        }
    });
}