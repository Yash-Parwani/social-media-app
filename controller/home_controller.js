const Post = require("../models/posts");


module.exports.home = function(request,response){
    //rendering home.ejs and sending title from server to browser
    //cookies come as in a request so to check we print it as request.cookies
    Post.find({}).populate('user').exec(function(error,posts){
        if(error){
            console.log("Error in fectching posts to display on homescreen");
            console.log("Error message is : ",error);
            return;
        }
        return response.render("home",{
             title: "Konnect | Home",
             posts : posts
        });
        
    });
    
}