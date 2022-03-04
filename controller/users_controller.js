//importing user model in order to access users in the database stored
const User = require('../models/user');

module.exports.profile = function (request, response) {
    //this route will be triggered when person either clicks his own profile or clicks name of his/her friend
    //So with when this route will be triggered we will get id for whom profile is requested so we will find that user and send
    User.findById(request.params.id,function(error,user){
        if(error){
            console.log("Error in finding user");
            console.log("Error message: ",error);
            return;
        }
        //if user is found than send it to browser
        return response.render("users", {
            title: "User Profile Page",
            /* here we will be sending page the user that we have found
               Now here key cant be user because its already there in  locals (the one that passports sets for authentication jiske liye humne function bhi likha tha)
             */
            profile_user: user
        });
    })
}
// controller that handles profile updation

module.exports.update = function(request,response){
// checking so that no one fiddles with our system
//so checking that only authorized users will be able to update profile
//So checking if current logged in users is the same one whose profile is to be updated

if(request.users.id == request.params.id){
    User.findByIdAndUpdate(request.params.id,request.body,function(error,user){
        return response.redirect("back");
    })
}
else{
    //if user is fiddling than we should show an error
    // sending status as 401  which is for unautherization
    return response.status(401).send("User not autherized")
}


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
    request.flash('success','Logged in successfully');
    console.log("User has successfully signed in")
    return response.redirect("/");
}

module.exports.destroySession = function(request,response){
    request.flash('success',"You have logged out")
    request.logout();
    return response.redirect("/");
}

