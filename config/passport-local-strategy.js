const { request, response } = require("express");
const passport = require("passport");
//importing local strategy and the below case is suggested by passport
const LocalStrategy = require("passport-local").Strategy;
//requiring users model since we have to check whether user is authenticated or not
const User = require("../models/user");

//creating a local strategy for authentication since we need to tell passport to use local strategy for authentication

//authentication using passport
passport.use(new LocalStrategy({
    //how do we detect who is our user
    /*defining username field to detect who is our user 
    by default username field is name of user 
    but in our case username field is email since thats unique so we make username field to email
    */

    // defining what is username field for us
    usernameField: 'email',
},
    function (email, password, done) {
        //find user through email and establish identity
        User.findOne({ email: email }, function (error, user) {
            if (error) {
                console.log("Error in finding user --> Passport");
                return done(error);
            }
            //if user is not found or password is notmatched
            if (!user || user.password != password) {
                console.log("Invalid Username/Password");
                return done(null, false);
            }
            //if user is found
            return done(null, user);
        });
    }));


//serializing the user to decide which key is to be kept in cookie i.e which key is to be sent in cookie i.e setting user in cookie
passport.serializeUser(function (user, done) {
    //storing users id in the cookie, wanting to store users id in encrypted format inside cookie
    done(null, user.id);
});


//deserializing the user from the key in the cookies 
passport.deserializeUser(function (id, done) {
    //find user if it exists in db
    User.findById(id, function (error, user) {
        if (error) {
            console.log("Error in finding user --> Passport");
            return done(error);
        }

        return done(null, user);
    });
})
// checking if user is authenticated
//created a middleware which checks whether the user is signed in or not
passport.checkAuthentication = function (request, response, next) {
    //find out if the request is authenticated using built in isAuthenticated which detects whether user is signed in or not
    //if the user is signed in, then pass on the reuest to the next function(controller's action)
    if (request.isAuthenticated()) {
        // if the request is authenticated i.e user is signed in
        //if yes let the user view thee page i.e if the user is signed in pass him to the page
        console.log("Request is authenticated i.e the user is signed in");
        return next();

    }
    else {
        console.log("Request is unauthenticated i.e the user is not signed in");
        return response.redirect("/users/sign-in");
    }

}

//once user is signed in we create a setauthenticated fucntion which sets the users in the locals
passport.setAuthenticatedUser = function (request, response, next) {
    //checking if request is authenticated or not
    if (request.isAuthenticated()) {
        // if request is authenticated set user in locals.
        //whenever a user is signed in its info is present in request.user (because we have used user model, so its already handled by passport) but its not sent in response locals so we transger it



        //request.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        console.log("Setting user into cookie");
        console.log(request.cookies);
        response.locals.user = request.user
    }
    next();
}
// exporting the authentication

module.exports = passport;



