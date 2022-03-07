
const Posts = require("../models/posts")
const User = require("../models/user")

module.exports.home = async function(request,response){
    //rendering home.ejs and sending title from server to browser
    //cookies come as in a request so to check we print it as request.cookies
    try{

       let allPosts = await Posts.find({}).sort('-createdAt').populate('user').populate({
           path:'comments',
           populate:{
               path:'user'
           }
       });
       //sorting all posts to make prepending look natural on our website

    
       // finding all users that have signed in on our website so that we can show it on the webpage of our website
      let users =  await User.find({});
        return response.render("home",{
            title: "Konnect | Home",
            all_posts : allPosts,
            all_users: users
       });
    
    }
    catch(error){
        //combined error for all errors that occur in home action
        console.log("Error",error);
        return;
    }


}   