//setting up express
const express = require('express');
//firing up express server
const app = express();
//defining port on which our website will run
const port = 8000;

const expressLayouts = require("express-ejs-layouts");
//importing our database

const db = require("./config/mongoose");

//for reading and writing into cookiees we will use library cookie parser
const cookieParser = require('cookie-parser');

//used for session cookie
const session = require("express-session");

//requiring passport and local strategy for authentication
const passport = require("passport");
//requring the local strategy that we had coded in config. this will be used to authenticate
const passportLocal = require("./config/passport-local-strategy");
const { disabled } = require('express/lib/application');
const MongoStore = require('connect-mongo');
const sassMiddleware = require("node-sass-middleware");
//requiring flash library to be used
const flash = require('connect-flash');
const customMware = require("./config/middleware")

//importing passport-jwt strategy in the main index.js so that we dont run into errors, this is the first step to do
const passportJWT = require('./config/passport-jwt-strategy');
//setting up the chat server to be used with socket.io
const chatSever = require('http').Server(app) ;// app is our express server app that we had setup after requiring express i.e on line 4
const chatSockets = require("./config/chat_sockets").chatSockets(chatSever);  // here we included the config chat_sockets.js and in it we had a function chatSockets which accpeted a socketserver , so we sent chatServer which will be our socketServer. Remember chatSockets as a variable is different than chatSockets as a functioiin which is defined in chat_sockets.js
 chatSever.listen(5000);// making our chatServer listen on another port other than our server port(8000)
 console.log('chat server is listening on port 5000');

app.use(sassMiddleware({
    src: "./assets/scss",
    dest: "./assets/css",
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}))


//reading through post requests i.e we need to encode url as well which is necessary to read post requests
app.use(express.urlencoded());

//setting up cookie parser through which server can read/write into cookie
app.use(cookieParser());


// telling in which folder server should look for static files
app.use(express.static("./assets"));
/*
making uploads path to be available publicly
so app to use for path /uploads , find the folder using express.static, we just join the path to uploads folder
so director of index joined to uploads i.e social media app / uploads is avialable on path /uploads
*/

//make the uploads path available to the browser
app.use('/uploads',express.static(__dirname+ '/uploads'))

//telling app to use layouts just before routes. why before routes? because routes will load views and views must know which partial to use

app.use(expressLayouts);

//extract styles and scripts from subpages into layouts
app.set("layout extractStyles",true);
app.set("layout extractScripts",true);


//setting up view engine ejs using app.set
app.set("view engine", "ejs");
//setting views to views folder i.e browsers can access it views from views folder in social media app
app.set("views" , "views");

//mongostore is used to store the session cookie in the db
//adding a middle ware which takes the session cookie and encrypts it. The order is very essential . this middleware is to be done after setting views
app.use(session({
    //name of cookie
    name: "konnect",
    //key for encryption and decryption . for now it will be plain text but in production it should be some random code
    //Todo change the secret before deployment in production code
    secret: "mainnahibataunga",
    saveUninitialized: false,
    resave : false,
    cookie: {
        maxAge: (1000 * 60 * 100),
        secure : false
    },
     store: MongoStore.create({
            mongoUrl : "mongodb://localhost/konnect_development",
           autoRemove: 'disabled'
    },function(error){
        console.log(error || "Connect-mongodb setup ok");
     })

}));

//telling app to use passport
app.use(passport.initialize());
//handling session cookie with passport
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
//just before routers (fixed syntax)and after session we will say to use flash
//we need to put it after the session is being used since it usees session cookies
app.use(flash());

// telling after flash to use custom middleware which will send flash messages to response i.e browser from request
// the order is very important
app.use(customMware.setFlash);
//telling app to use routers which is in routes/index.js to handle all post and get requests from the browser
//router should be at the end just before app.listen since all things that require to be initialized before routing things up should be present above the router call



app.use('/',require('./routes/index'));

//making our app listen 
app.listen(port,function(error){
    if(error){
        console.log("Error in app.listen");
        console.log(`Error message is : ${error}`);
    }

    console.log(`Server up and running on port ${port}`);
})