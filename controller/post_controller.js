//requiring post
const Post = require("../models/posts");
const Comment = require("../models/comments");
module.exports.create = async function(request,response){
    try{

        let post = await Post.create({
            content : request.body.content,
            // connecting i.e referencing which user created the post by sending the id of authenticated user only . since user is authenticated means request.user will be present since it will be set by setAuthenticated function of passport
            user: request.user._id
         });
             return response.redirect("back");
    }
    catch(error){
        console.log("Error",error);
    }
}



// function to delete a post

module.exports.destroy = async function(request,response){
    // First we should check whether the post exits or not because user par kabhi bhi bharosa nahi karna chahiye kuch bhi kaadi kar sakta hai woh . We need to search whether the post exists or not because if user fiddles with website and changes the post id than it will be a problem for us
    // we had sent the post id via string params so hence it will be in request.params.id and not request.body.id
   try{
       
       let post = await Post.findById(request.params.id);
            // if post is found 
            /*Now we should check whether the person who has requested to delte the post is the same user who had created it 
             Agar hum yeh nahi karte hai toh koi bhi kisi ka bhi post delete kar sakta hai which is very wrong
             hence have to ensure the person who is requesting to delete the post is the same one who had created it
            */
           //now post.user will be id of the user untill and unless we choose to prepopulatee it which we are not doing it  like we had done it in home controller but we are not doing it over here in post schema user is nothing but object id 
           //post.user will return a string id  of the user who created post
           //request.user._id will return object id of the current user 
           // but for comparison its better to compare in string ,so mongoose gives us an automatic variatnt .id which converts  _id which is the object id into string format
           //request.user._id will give object id where as request.user.id will give it in string format
     
           
      
        if(post.user == request.user.id){
            // if current user and the user who created the post are same than simply remove post
            post.remove();
            //next deleting associated comments of the post
            // now a post can have many comments to delete hence use delete many and post id which will delete all comments of a particular post id
           let comments = await Comment.deleteMany({post: request.params.id});
             //if no error than comments will be successfully deleted so return user to the same page from where he came
             return response.redirect("back");
         
     }//if users dont match that is somebody else is trying to delete somebody elses post
     else{
            return response.redirect("back");
    
        }
   }
   catch(error){
       console.log("Error",error);
       return;
   }

}