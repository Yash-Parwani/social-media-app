//setting up express
const express = require('express');
//firing up express server
const app = express();
//defining port on which our website will run
const port = 8000;

const expressLayouts = require("express-ejs-layouts");
//telling app to use layouts just before routes. why before routes? because routes will load views and views must know which partial to use

app.use(expressLayouts);

//telling app to use routers which is in routes/index.js to handle all post and get requests from the browser
app.use('/',require('./routes/index'));

//setting up view engine ejs using app.set
app.set("view engine", "ejs");
//setting views to views folder i.e browsers can access it views from views folder in social media app
app.set("views" , "views");

//making our app listen 

app.listen(port,function(error){
    if(error){
        console.log("Error in app.listen");
        console.log(`Error message is : ${error}`);
    }

    console.log(`Server up and running on port ${port}`);
})