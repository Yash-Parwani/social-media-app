//requiring post
const Post = require("../models/posts");

module.exports.create = function(request,response){
   Post.create({
       content : request.body.content,
       // connecting i.e referencing which user created the post by sending the id of authenticated user only . since user is authenticated means request.user will be present since it will be set by setAuthenticated function of passport
       user: request.user._id
    },function(error,post){
           if(error){
               console.log("Error in creating a post");
               return;
           }
           //if post is created than we redirect user back to the page from which he had come so that he can now view post that he had created
           return response.redirect("back");
       });
}