//settings for jwt strategy of passport


//importing passport

const passport = require('passport');

//importing jwt strategy

const JWTStrategy = require('passport-jwt').Strategy;

//now this is not specifically going to passport-jwt,its going to be strategy
//1) we are importing strategy
//2) we will be importing a module which will help us to help us extract jwt from header

const ExtractJWT = require('passport-jwt').ExtractJwt;

//since we will be using user model to establish identity of that user we need to import user model as well
const User = require("../models/user");  

let opts ={
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken,
    secretOrKey : 'konnect'
}


//telling passport to use jwt strategy

passport.use(new JWTStrategy(opts,function(jwtPayload,done){
   //find the user based on the information in the jwtPayload

   User.findById(jwtPayload._id,function(error,user){
       if(error){
           console.log("Error in finding user from JWT");
           console.log("Error message: ",error);
           return;
       }

       //if user is found
       if(user){
           return done(null,user);
       }//if user is not found
       else{
           return done(null,false); 
       }
   })
}));


module.exports = passport 