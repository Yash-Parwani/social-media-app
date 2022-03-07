const mongoose = require("mongoose");
/* we will be importing multer over here

but why are we importing multer not in config folder but in user.js ,why?
Because we are uploading that file specific to a user and we will have some specific settings 
Users avatar will be uploaded at different page
For eg if we are posting an image , it will be uploaded at a different place
So we are setting up multer individually for each model all though we can have a centralized approach as well , but this individualistic approach works best

*/

const Multer = require("multer");
//Require path .Why? Because we will be setting the path where file will be stored
const path = require('path');
//Defining a const path where we will be storing our files. We will be keeping it in capitals because we want to differentaite it since its a variable containing the path where users avatar will be stored

const AVATAR_PATH = path.join('/uploads/users/avatars');



const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
        //we dont want it for now to be required hence leaving it
    }
}, {
    timestamps: true
});



//defining settings for saving files in AVATAR_PATH 
//copy the entire settings from multer documentation(if we google multer documentation) except line var upload = {}


const storage = Multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, ".." ,AVATAR_PATH))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

// static functions
// the uploadedAvatar static function helps us to use request.params/request.body else we would not be able to use them 
userSchema.statics.uploadedAvatar = Multer({ storage: storage }).single('avatar'); 
//creating a static variable to access path name from outside the file as well
//i.e we make AVATAR_PATH publicly available

userSchema.statics.avatarPath = AVATAR_PATH;
const User = mongoose.model("User", userSchema);
module.exports = User