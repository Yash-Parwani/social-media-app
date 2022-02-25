//importing user model in order to access users in the database stored
const User = require('../models/user');

module.exports.profile = function (request, response) {
    return response.render("users", {
        title: "User Profile Page"
    });
}
module.exports.signIn = function (request, response) {
    if(request.isAuthenticated()){
    
        return response.redirect("/users/profile");
    }
    return response.render("user_sign_in", {
        title: "Konnect Sign in"
    });
}
module.exports.signUp = function (request, response) {
    if(request.isAuthenticated()){
        return response.redirect("/users/profile");
    }
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
    //the user is signed in and we just want to redirect user to home page
    console.log("User has successfully signed in")
    return response.redirect("/");
}

module.exports.destroySession = function(request,response){
    request.logout();
    return response.redirect("/");
}

