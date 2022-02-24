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
   usernameField : 'email'      
},
function(email,password,done){
    //find user through email and establish identity
    User.findOne({email : email},function(error,user){
        if(error){
            console.log("Error in finding user --> Passport");
            return done(error);
        }
        //if user is not found or password is notmatched
        if(!user || user.password != password){
            console.log("Invalid Username/Password");
            return done(null,false);
        }
        //if user is found
        return done(null,user);
    });
}));


//serializing the user to decide which key is to be kept in cookie i.e which key is to be sent in cookie i.e setting user in cookie
passport.serializeUser(function (user,done){
    //storing users id in the cookie, wanting to store users id in encrypted format inside cookie
    done(null,user.id);
});


//deserializing the user from the key in the cookies 
passport.deserializeUser(function(id,done){
    //find user if it exists in db
    User.findById(id,function(error,user){
        if(error){
            console.log("Error in finding user --> Passport");
            return done(error);
        }

        return done(null,user);
    });
})


// exporting the authentication

module.exports = passport;



