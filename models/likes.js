const mongoose = require('mongoose');

//setting up schema for likes which is going to be a polymorphic relationship where a object can have multiple parents


const likeSchema = new mongoose.Schema({
   user :{
       type: mongoose.SchemaTypes.ObjectId
    },
    //this field defines the object id of the liked object
    likeable:{
       type: mongoose.SchemaTypes.ObjectId,
       required: true,//since for likes we need object id of the object where we have liked
       refPath :'onModel' // since we are using dynamic referncing hence we use  refPath
       //since we dont know what we are referencing , we will know that depending on user's response hence we use refPath
       //if we know what we are referencing and we can hardcode it , than we use ref
   },
   //this field is used for defining the type of the liked object since this is a dynamic refernce
   onModel:{
      type: String,
      required:true, //since we need to know which model we have to reference in likeable field hence it is required
      enum:['Post','Comment'] /*The enum keyword is used to restrict a value to a fixed set of values. It tells that the
      value of onmodel (a property that we defined) in each like, can either be on a post
      or comment and nothing other than that*/

   }
},{
    timestamps: true
});


const Like = mongoose.model('Like',likeSchema);
module.exports = Like;