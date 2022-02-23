//setting up express
const express = require('express');
//firing up express server
const app = express();
//defining port on which our website will run
const port = 8000;

//making our app listen 

app.listen(port,function(error){
    if(error){
        console.log("Error in app.listen");
        console.log(`Error message is : ${error}`);
    }

    console.log(`Server up and running on port ${port}`);
})