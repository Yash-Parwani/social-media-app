const req = require("express/lib/request");
const { redirect } = require("express/lib/response");
const Comment = require("../models/comments");
const Post = require("../models/posts");


module.exports.create = async function(request,response){
    // checking if post actually exits and creating comment only if post exits
    // because if someone plays with html and tries to fiddle with our website so we should counter it
    try{

        let post = await Post.findById(request.body.postId);
            //if post found then create comment
            if(post){
             //since post is found we have to create comment
             let comment = await Comment.create({
                 content: request.body.content,
                 post: request.body.postId,
                 //user will not be present in body , it will be present in reequest since we set user inside it in functionn setAuthentication function
                 user: request.user._id
             });
                // here comment gets created so we need to update comment id in post object
                post.comments.push(comment);
                post.save();


                /*ONce the middleware home_posts_comments submits the data ,we will recieve it in comments_controller
           so we need to view that data over here in posts controller

           the middleware will send the form data and we will want to view it

           now we just need to check whether the given request is an ajax request or not 

           type of ajax request is xhr
          */
            //detecting if request is of ajax type
            if(request.xhr){
                //if request is of ajax type i.e asynchronous than we need to return some json
 
                //we return json with some status and message
                return response.status(200).json({
                    //shaping json in a specific way
                    //json has key data which will contain post which will contain the post we had created
                    data: {
                        comment: comment
                    },
                    message:"Comment for the given post created"
                 });
            }
                return response.redirect("/");
            
            }//else if post not found simply return
            else{
                return response.redirect("back");
            }
        
    }
    catch(error){
        console.log("Error in creating a comment");
        console.log("Error message ",error);
        return;
    }
}


//controller action to delete a comment
module.exports.destroy = function(request,response){
    //Finding comment to delete
    Comment.findById(request.params.id, function(error,comment){
        if(error){
            console.log("Error in deleting comment");
            console.log("Error message : ",error);
            return;
        }
        // if no error that means we found the comment now we should check whether the person who has requested to delete the comment is the same person who created it other wise koi bhi kisi ka bhi comments delete kar dega
        // idhar bhi .id aur _id wala farak rahega as we had seen in posts
        if(comment.user == request.user.id){
            // this means we can delete the comment 
            /* but we need to delete comment from the post side as well so for that we need the post id 

            so delete karne se pehle we should store that post id somewhere and than delete the comment

            now post id is present in comment schema in post field 

            so we save it and then delete the comment using .remove()
            */

            let postId = comment.post;

            comment.remove();

            /* now if a comment is there than its post should also be there 
            Now if we see in post schema we have a field comments which is an array of object id 
            Now from that array of object id we have to delete the object id belonging to the comment that we had deleted above
            How ?
            we will see that
            */
           // first find the post to which the deleted comment belonged with help of variable postId and update it 
           // we need to update the post since we will be deleting one of the object id of the commentsf array
           /* what we need to update?

            We need to pull out the comment id from the list of comments ids which is stored in field commments

            so mongo provides with a function as
            $pull :{field from which we need to pull : thing that we need to pull}

            so here field from which we need to pull is comments and the thing that we need to pull is the id of the comment (request.params.id)that is already deleted since its deleted hence its no use for us
            so it will be

            $pull :{comments : request.params.id}
            request.params.id is the id that we want to pullout from comments array since it has been deleted
           */
           Post.findByIdAndUpdate(postId,{$pull :{comments:request.params.id}},function(err,post){
                     return response.redirect("back");
           });

        }// if its not the same user who had commented
        else{
            return response.redirect("back");
        }
    });
}