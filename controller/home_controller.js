const Post = require("../models/posts");

const User = require("../models/user")

module.exports.home = function(request,response){
    //rendering home.ejs and sending title from server to browser
    //cookies come as in a request so to check we print it as request.cookies
    Post.find({}).populate('user')
    .populate({
        path:"comments",
        populate: ({
            path:"user"
        })
    })
    .exec(function(error,posts){
        if(error){
            console.log("Error in fectching posts to display on homescreen");
            console.log("Error message is : ",error);
            return;
        }

   // finding all users that have signed in on our website so that we can show it on the webpage of our website
   User.find({},function(error,users){
       if(error){
           console.log("Error in finding all users");
           console.log("Error message: ",error);
           return;
       }
       return response.render("home",{
            title: "Konnect | Home",
            posts : posts,
            all_users: users
       });
   })
        
    });
    
}