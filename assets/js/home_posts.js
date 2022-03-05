// this file fetches the data from the form and sends it in json format to the action
//whenever we will submit the form to create a new post , it will not be submmitted automatically , it will pass through this js fiile
//all code will be surrounded within these brackets just for scope
{
/*
Now while creating a post what are the two things that we need?


1)  a function which handlees submition of post data (to the databse only)
2)  a function which recieves data of the created post and displays it in the homepage
*/

// so creating function with point 1 , function that handles submition of post
//method to submit the form data for new post using AJAX
let createPost = function(){
    // fetching form from DOM using jquery
    let newPostForm = $('#new-post-form');

    // now we have loaded the form in newPostFOrm 

    //whenever the form is submitted we dont want it to submit naturally so we prevent default

    newPostForm.submit(function(e){
        //e is the event which we want to prevent , over here its of type submit since it matches function name
        e.preventDefault();
    });

    // now we have prevented the form to submit directly to db, we will make it submit over here and than to db to allow asynchronous handling

    //SO we will manually submit it, by using ajax since we want to do asynchronous handling

    $.ajax({
        type:'post',
        //url to which form needs to be submitted
        url:'/post/create',
        //we need to send in the data that we want to create a post for
        data:newPostForm.serialize(),// serialize converts form data to Json format like content would be key and value will be value filled in form
        success: function(data){
            //if its successfull we have a function that gets data
            //data will be the json data that we had converted above

            console.log(data)
        },
        error: function(error){
          //if there is any error than we will get that over here
          console.log(error.responseText);
        }
    })
}

//calling createPost function nahi toh function ka koi use nahi hoga agar hum usse call hi nahi kar pae 
createPost();

//method to create a post in dom i.e displaying post in home.ejs


/*so to show the post on screen we need to replicate almost all of the _post.ejs code
but for it we need to make some changes to that code
*/
}