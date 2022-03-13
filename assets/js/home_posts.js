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
    

    // now we have prevented the form to submit directly to db, we will make it submit over here and than to db to allow asynchronous handling

    //SO we will manually submit it, by using ajax since we want to do asynchronous handling

    $.ajax({
        type:'post',
        //url to which form needs to be submitted i.e form main jo action attribute hai uski value i.e new-post-form ka action value ki attribute
        url:'/posts/create',
        //we need to send in the data that we want to create a post for
        data:newPostForm.serialize(),// serialize converts form data to Json format like content would be key and value will be value filled in form
        success: function(data){
            //if its successfull we have a function that gets data
            //data will be the json data that we had converted above
            
            console.log(data);
            // newPostDom creates a post in DOM so we need to call that function over here when its successfull
            // now if we see in console we had print data which was forms data so if we see that in data we have another field key as data and in it we have a key post which contains the data that we have sent via the form , so we need to send data.data.post to newPost function to display a post in dom
            //so we create it via newPostDom function

            let newPost = newPostDom(data.data.post);

            // newPost contains the post that was created now we just need to append it in the post list container(container that contains all the post) inside that also we will be appending it in ul because each post is inside an li and we want to show all so append the post inside an ul
             /* when createPost function is sucessfull, we will come here
             Now since post is created successfully , we need to insert it to post-list-container inside ul so that its visible inside li since posts are going to appended inside li


             */
            // prepending newPost so that it gets appended to first positon
            $('#posts-list-container>ul').prepend(newPost);

          // adding delete link to all dynamically created post so that now posts will be also deleted using ajax
          // here space is added so that we add the delete button to the newPost that we have inserted in the posts-list-container
          deletePost($(' .delete-post-button'),newPost);
        },
        error: function(error){
          //if there is any error than we will get that over here
          console.log(error.responseText);
        }
    })
});
}

//calling createPost function nahi toh function ka koi use nahi hoga agar hum usse call hi nahi kar paenge
createPost();



/*so to show the post on screen we need to replicate almost all of the _post.ejs code
but for it we need to make some changes to that code
basically some of those changes are conveting <%= %> to ${} since in jqeury we can usse interpolation


and we will be removing all controller checks that is all ifs since in jquery we cant do it

also we will be removing for loop where we display the comment since it will be appended in real time later
*/


// for creating a post in dom we need a function which will help us to convert html text to jquery

//method to create a post in dom i.e displaying post in home.ejs


let newPostDom = function(post){
    //passing post data that we have recieved from database
    /*copy pasting code that we had written in _posts.ejs in return inside backticks
    we cant return comments hence have to delete it but have mentiioned all of the comments  in _post.ejs
    
    we have removed all checks and for loops from that _posts.ejs as explained in above comments
      removing for loop for iterating through comment's since now it will be appended to when we add a comment so no need to iterate
    */
    return $(`
    <li id="post-${post.id}">
                          <p>
                            ${ post.content}
                              <span>
                                      <a class="delete-post-button" href="/posts/destroy/${post._id}"> X </a>
                                     
                              </span>
                            
                          <br>
                          <small>
                            ${ post.user.name}
                          </small>
                        </p>
                        </li>
                            <div class="post-comments">
                                    <form action="/comments/create" method="post">
                                      <input type="text" name="content" placeholder="Type here to add your comment...">
                                          <input type="hidden" name="postId" value="${post._id}">
                                          <input type="submit" value="Add comment">
                                    </form>
    
                                
                            </div>
                                <div class="post-comments-list">
                                  <ul id="post-comments-${post._id}">
                              
    
                                  </ul>
                                </div>
                                </p>`)
}
/*
Now we will see how to delete posts via ajax (so that while removing we dont have to refresh for changes to occur)

we need two things
1) to be able to send the data to controller to delete
2) once we get confirmation that we need to delete a particular post we remove it from dom

*/

//method to delete a post from DOM

let deletePost = function(deleteLink){
  /*why delete link?
  
  we will pass on the a tag that is there in home.ejs the a tag through which we delete post will be passed over here
  from that we will simulate a click on it
  hence delete link

  we can also pass on the whole post but for now we pass the link only
  */

  /*when the delete link is clicked ,  we prevent its default action, since we want it to be disabled asynchronusly.
  it will work for any delete link which is associated with  post

  we prevent its default option since we dont want natural behaviour , we dont want to click and go somewhere else.

  */

   $(deleteLink).click(function(e){
    e.preventDefault();

    // calling ajax to delete post
    $.ajax({
      type:'get',
      // to get the value of href from the link that we have sent , the a tag that we have sent in the deleteLink contains href, so we want to extract it which we do it like shown below
      url:$(deleteLink).prop('href'),
      success: function(data){
       //data will remove the post, 
       // lets assume the data variable which we have consists of post id to be delted(we will be sending from the browser , it will consist of the post id to be deleted)
       $(`#post-$(data.data.post_id)`).remove()
       //the above line deletes post of a particular post id
      },
      error: function(error){
        console.log(error.responseText);
      }
    });
   });
}


}