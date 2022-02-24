const mongoose = require ("mongoose");
//providing connecdtion to database
mongoose.connect("mongodb://localhost/konnect_development");
const db = mongoose.connection;

db.on("error",console.error.bind(console,"Error connecting to MongoDB"));

db.once('open',function(){
    console.log("Connected to database :: MongoDB");
});

module.exports = db;