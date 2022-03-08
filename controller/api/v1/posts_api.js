//index is usually used as an action name when we want to list down something
//here we will be listing down list of posts

const Post = require("../../../models/posts"); 
const Comment = require("../../../models/comments")
module.exports.index = async function (request, response) {

    //getting all posts stored in databse, code is same as used in post controller in controller/post_controller, we can copy paste the same part
    //we will be sorting it in decreasing order of (-createdAt) , i.e in the same way that we did in post_controller, literally its the same copy pasted code

    let posts = await Post.find({}).sort("-createdAt").populate("user").populate({
        path :'comments',
        populate:({

            path:'user'
        
        } )
    }
    );
    return response.json("200", {
        message: "Lists of posts",
        //getting lists of posts
        posts: posts
    });
}

//Code to delete the post without any Authentication
/*
Now we want to delete post without any authentication

We can copy the same code of destroy function from posts_controller and remove the authentication part 

Also removing flash messages since its api , we will be sending json data in it


*/
module.exports.destroy = async function(request,response){
    // First we should check whether the post exits or not because user par kabhi bhi bharosa nahi karna chahiye kuch bhi kaadi kar sakta hai woh . We need to search whether the post exists or not because if user fiddles with website and changes the post id than it will be a problem for us
    // we had sent the post id via string params so hence it will be in request.params.id and not request.body.id
   try{
       
       let post = await Post.findById(request.params.id);
          
           
      
        
            // if current user and the user who created the post are same than simply remove post
            post.remove();
            //next deleting associated comments of the post
            // now a post can have many comments to delete hence use delete many and post id which will delete all comments of a particular post id
            await Comment.deleteMany({post: request.params.id});

            //if the post is deleted , then we send json data with status 200 for successfull and send corresponding message
            return response.json('200',{
                message:"Posts and associated comments deleted successfully"
            });

   }
   catch(error){
       console.log("Error message: ",error);
    return response.json("500",{
         message:"Internal Server Error"
    })
   }

}