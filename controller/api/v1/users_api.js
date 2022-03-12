/*
the create session code will be exactly similar to create session code in users_controller
 only we will modify that code to return jwt thats it
 */
//importing User model since in users api we will be working with users only right...

const User = require("../../../models/user");

const jwt = require("jsonwebtoken");

//importing jsonwebtoken library which will be helping us to create an encrypted JWT 
 module.exports.createSession = async function (request, response) {
   /*
   what do we need to do whenever a username and password is received?
   We need to find that user and generate jwt corressponding to that user

   */
  try{

      let user = await User.findOne({email:request.body.email});
      // if user is not found or password entered by user doesnt match with the password in the database, we

      if(!user || user.password != request.body.password){
          //status code 422 means invalid input
          return response.json("422",{
              message:"Invalid username/password"
          });
      }

      //if user is found and passwords match than we return json which contains the jwt token
      
      return response.json("200",{
          message:"Sign in successful,here is your jwt token, pleasse keep it safe ",
          data:{
              token : jwt.sign(user.toJSON(),'konnect',{expires :'100000'}) 
          }
      })
  }
  catch(error){
      console.log("Error message : ",error);
      return;
  }


  //
}



