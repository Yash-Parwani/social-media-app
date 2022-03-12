//importing like model
const Like = require("../models/likes");
//importing post model
const Post = require("../models/posts");
//importing comment model
const Comment = require("../models/comments");



//time to create toggle action in the controller , we will create it via async await

module.exports.toggleLike = async function(request,response){
    try{
        // route of likeable likes/toggle/?id=(some-value)&type=(some-value)

        let likeable;
        let deleted = false // will help to determine whether to increment count of likes or decrement , if false than it means like is not deleted and hence increment , but if true it measn like is deleted and we have to decrement like count by 1
       // if deleted == false means like created
       // if deleted == true means like deleted

        //finding likeable i.e which object is liked

        /*now how will we find what is liked? well if we see the route type mentioned just after try or lets mention it again
          
        route of likeable likes/toggle/?id=(some-value)&type=(some-value)
      
        so if we see the route , it has param as type...
        what does type save?
        well it saves type of object liked i.e whether user likes a Post or Comment
        Voila... thats how we will find what likeable is ,since it was the object id of the object liked


        so can we access it as like this request.params.type ?? 
        NOPE

        since the route has more than one parameter(id,type), we can not use params

        so what to do?
        to access type from url , instead of request.params.type we do request.query.type


        so when there are more than one parameters mentioned in url , we use query to access each parameter


        */


        if(request.query.type =='Post'){
              //i.e if user likes a post that means likeable will be an objectId of type post consisting of objectId of the post liked by the user

              //so we need to search that post liked by user and save it in likeable since likeable saves the objectId of the object like by the user

              //to show if post already contains other likes,  we populate previous likes as well on the post if there are likes already
              likeable = await Post.findById(request.query.id).populate('likes');
        }
        else{
             //i.e if user likes a comment that means likeable will be an objectId of type commment consisting of objectId of the comment liked by the user

             //so we need to search that comment liked by user and save it in likeable since likeable saves the objectId of the object like by the user

              //to show if post already contains other likes,  we populate previous likes as well on the post if there are likes already
              likeable = await Comment.findById(request.query.id).populate('likes');
        }
        /*next step 
        Check if like already exists
        We will use like.findOne since we want to find if that specific like exists , since one user can like a specific object only once,not twice , so we need to just check that

        */

        let existingLike = await Like.findOne({
            likeable : request.query.id,
            onModel: request.query.type,
            user:request.user._id
             /*
                  How are we able to access user using request.user._id??
                  Because only signed in / authorized users will be able to like the object

                  and since user is signed-in/authorized it means passport has insertd user in the cookie by the function setAuthUser hence we can access it in request
                   and not use request.query.user
                */
        });

        //Now check if existingLike has a value other than NULL/Undefined



        //if a like already exists delete it
        if(existingLike){
             /*this means that like already exists meaning user had already liked current object(post/comment)
               but know wants to unlike(because maybe galti se like kardiya hoga) it hence we will be decrementing likes count by one and delete like from associated object as well
             */

               /*

               Now to delete Like
               first remove like from Likeable i.e if like was made to a post than we need to pull than we need to pull out like from post and delete that like object
               and if like was made to comment than we need to pull that like out of the likeable(since likeable saves objectId of the object on which like was made)(which is comment) and than delete that like object
               */


               // now to pull out an objectId out of an array we will use fieldName/ArrayName.pull(object to be pulled)  where fieldName is the Name of the array, like we had done to delete comment to a post since comments was also an array of objectId inside Post schema

               //in likeable we fetched the object so we will do likeable.likes.pull(object to be pulled out)
               // here object to be pulled out is existingLike it consist of objectId of like that user had already liked the post and we need to just pull it out

               likeable.likes.pull(existingLike);

               //Next we save changes in Likeable similar to what we had done while deleting an objectId inside comments array in post and reason is mentioned over there either in code or in book
               likeable.save();

                //next we need to delete the like object

                existingLike.remove();//deletes the object

                // and since we deleted like so we should change value of delted to be true meaning user had clicked on like again to delete like so we should be decrementing like count
                deleted = true;
        }
        //create like if not existed already
        else{
            /*
            this means that like did not exist already means user is liking the object for first time
            create a like
            */
           //creating a new like since  it did not exist already
            let newLike = await Like.create({
                user: request.user._id,
                /*
                  How are we able to access user using request.user._id??
                  Because only signed in / authorized users will be able to like the object

                  and since user is signed-in/authorized it means passport has insertd user in the cookie by the function setAuthUser hence we can access it in request
                  and not use request.query.user
                */
               likeable : request.query.id,
               onModel: request.query.type

            });
            // now once like is created , than we need to insert it into the likeable since likeable consists of objectId of the object to which user likes 

           //so pushing like to likeable as        likeable.likes.push(newlike)   and mongoose will pull out newlike.id i.e id of newLike automatically
           //or we can do it like this as well     likeable.likes.push(newLike._id)
           likeable.likes.push(newLike._id);

           // saving likeable since than only changes will be sent to our Database
           likeable.save();


           // now we should return json stating like was created successfully
           return response.json('200',{
               message:"Request is successfull",
               data:{
                   //we will be sending value of deleted which will be false since wee have not deleted like over here
                   deleted : deleted
               }
           });
        }




    }
    catch(error){
        // if error in creating like,we need to send back json or flash message
        //since like is going to work with ajax requests we will send json data (ajax main hum humeinsha json data bhejte hai)

        console.log("Error message: ",error);
        return response.json('500',{
            message:"Internal Server error"
        });
    }
}