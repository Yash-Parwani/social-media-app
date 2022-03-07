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

module.exports.update = async function(request,response){
// checking so that no one fiddles with our system
//so checking that only authorized users will be able to update profile
//So checking if current logged in users is the same one whose profile is to be updated

// if(request.users.id == request.params.id){
//     User.findByIdAndUpdate(request.params.id,request.body,function(error,user){
//         return response.redirect("back");
//     })
// }
// else{
//     if user is fiddling than we should show an error
//      sending status as 401  which is for unautherization
//     return response.status(401).send("User not autherized")
// }

//the above code is commented since we are converting the same above code to async await

if(request.user.id == request.params.id)
{
    try{
       let user = await User.findByIdAndUpdate(request.params.id);

       // found The user whose id was passsed and stored the founded user in 'user'

       //once user is found( stored in 'user") we need  to update the user 

       /*
         Now things change slightly , we wont be able to access body params of the form, we wont be able to access it directly(like request.body)

         why?
         because the form is a multipart form, so our bodyparser wont be able to parse it since its a multipart form


         So here multer will come to rescue, its already been deployed to task and the uploadedAvatar function (which we created in users model) will help us
         How?
         if we see uploaded avatar function , it takes request as well, so it proccess request as well

         So to access that static function we will have to use the model name User and not user

         Since 'user' is the user we found in the database , but User is the model name which contains the given static function

        


       */
      User.uploadedAvatar(request,response,function(error){
           if(error){
               console.log("Multer Error",error);
               return;
           }
           

           /* 
           Now in User.uploadedAvatar we have sent request and response as well and here we will analyse only the request part and send something back along with response when we have saved the user
           */

           // lets check how sent file looks like. 
           // to access file do request.file since request object contains the file 
           
           
           //console.log(request.file);
           //the above commented code shows all file details that multer extracts for us and which we can use for our benefit


           //Now we need to store the file alongside the user like if info is updated than we need  to update it as well

           // now we can use request.body since multer helps to parse multipart info, if we did not use multer than we would not be able to use request.body

           //updating user details
           user.name = request.body.name;
           user.email = request.body.email;


           // now we check whether the user sends file to upload or not since its not necessary that user will update his avatar if he updates his info
         // i.e check if request has file object or not
           if(request.file){
               //updating file only when user sends file
               user.avatar = User.avatarPath+ '/' + request.file.filename;
               //the above line of code is saving the pathof the uploaded file into the avatar field in the user


               
           }
           //saving the user since info might be updated
           user.save();
           //redirecting user back on successfull save
           response.redirect("back");
      });
    }
    catch(error){
        console.log("Error",error);
        return;
    }
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

