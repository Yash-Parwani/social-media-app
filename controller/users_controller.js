//importing user model in order to access users in the database stored
const User = require('../models/user');

module.exports.profile = function (request, response) {
    //checking if user is authenticated or not 
    //how? if user id is present in cookie it means user is authenticated 
    //now here we will access cookie using request since we want to check if user is authenticated that will be present in cookie sent by the browser only

    if(request.cookies.user_id){
        //finding the user-id in the database
        User.findById(request.cookies.user_id,function(error,user){
            //if user is fount redirect to profile page else redirect user back to signin page
            if(user){

                return response.render("users", {
                    title: "User Profile Page",
                    user : user
                });
            }
            else{
                return response.redirect("/users/sign-in");
            }
        })
    }
    else{
        return response.redirect("/users/sign-in")
    }
}
module.exports.signIn = function (request, response) {
    return response.render("user_sign_in", {
        title: "Konnect Sign in"
    });
}
module.exports.signUp = function (request, response) {
    return response.render("user_sign_up", {
        title: "Konnect Sign up"
    });
}

module.exports.create = function (request, response) {
    //TODO create a user
    //checking if password and confirm password are same or not
    if (request.body.password != request.body.confirmPassword) {
        return response.redirect('back');
    }
    //  if passwords are same , try to find user in same email id in database
    //  if the user already exists in database than no need to create one
    //  if it does not than create a new user
    User.findOne({ email: request.body.email }, function (error, user) {
        if (error) {
            console.log("Error in finding user in signing up"); return;
        }
        //if user is not found than we have to create the user
        if (!user) {
            // enters if user is not found
            // so we create a user in database
            User.create(request.body, function (error, user) {
                if (error) {
                    console.log("Error in creating a user while signing up"); return;
                }
                //if its here it means usser is created so we return him back to signin page
                return response.redirect('/users/sign-in');
            });
        }//if user is already present redirect him back to signin page
        else {
            return response.redirect('/users/sign-in');

        }
    });

}
module.exports.createSession = function (request, response) {
    //TODO create a session
    //steps to authenticate
    //check if user exits by finding him
    User.findOne({email: request.body.email},function(error,user){
         if(error){
             console.log("Error in finding user in signing in");
             return;
         }
         //handle user found
         if(user){
               //if user is found and passwords dont match
               if(user.password != request.body.password){
                   return response.redirect("back");
               }
               //if everything goes fine , create a session
               //we have to send cookie to user i.e browser hence it will be done using response.cookie
               //if we want to access the cookie sent by browser to server it will be done as request.redirect
               response.cookie('user_id',user.id);
               return response.redirect("/users/profile");
         }//handling not found
         else{
                return response.redirect("back");
         }
    });
}

