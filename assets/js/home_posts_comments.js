//in this we will write code for comments of a post using ajax


/*
Now while creating a comment for a post what are the two things that we need?


1)  a function which handlees submition of comment data (to the databse only)
2)  a function which recieves data of the created comment for a post and displays it in the homepage
*/

// so creating function with point 1 , function that handles submition of comment for a post
//method to submit the form data for new comment of a post using AJAX

{

    let createComment = function () {
        // fetching form for submitting comment

        let newCommentForm = $('#new-comment-form');
        // now we have loaded the form in CommentForm 

        //whenever the form is submitted we dont want it to submit naturally so we prevent default i.e newCommentForm.submit is what we plan to handle


        newCommentForm.submit(function (e) {
            //preventing default submition of form
            e.preventDefault();

            // now we have prevented the form to submit directly to db, we will make it submit over here and than to db to allow asynchronous handling

            //SO we will manually submit it, by using ajax since we want to do asynchronous handling
            $.ajax({
                type: 'post',
                url: '/comments/create',
                //we need to send in the data that we want to create a post for
                data: newCommentForm.serialize(), // serialize converts form data to Json format like content would be key and value will be value filled in form
                success: function (data) {
                    //if its successfull we have a function that gets data
                    //data will be the json data that we had converted above
                    //checking how comment form data is converted to json format
                    console.log(data);


                    /*
                    Now if we are here it means that the comment is successfully sent to database
  
                    Now we must display that comment to a post inside dom , for which we have newCommentDom function which helps us to create comment inside post in dom
                       
                    So we create a newComment using newCommentDom function
  
                    Now we must append it to that particular post comments list i.e for each post we have a list of comments, so we need to append that post over there only, so we will be requiring it and than prepend newComment
  
                    So we must attach it to that particular posts comment list
                    */
                },
                error: function (error) {
                    //if there is any error than we will get that over here
                    console.log(error.responseText);
                }
            })
        })

    }
    //calling createPost function nahi toh function ka koi use nahi hoga agar hum usse call hi nahi kar paenge
    createComment();



    /*so to show the comment inside a post on screen we need to replicate almost all of the _comment.ejs code
    but for it we need to make some changes to that code
    basically some of those changes are conveting <%= %> to ${} since in jqeury we can usse interpolation
    
    
    and we will be removing all controller checks that is all ifs since in jquery we cant do it
    
    */


    // for creating a comment inside a post in dom we need a function which will help us to convert html text to jquery

    //method to create a comment inside a post in dom i.e displaying comment inside a post in home.ejs


    let newCommentDOM = function (comment) {
        //passing comment data that we have recieved from database
        /*copy pasting code that we had written in _comments.ejs in return inside backticks
        we cant return comments hence have to delete it but have mentiioned all of the comments  in _post.ejs
        
        we have removed all checks and for loops from that _comments.ejs as explained in above comments
          removing for loop for iterating through comment's since now it will be appended to when we add a comment so no need to iterate
        */


        return $(`
      <li id="comment-${comment.id}">
      
          <p>
            ${comment.content}
              <span>
                      <a href="/comments/destroy/<%=comment.id%>" class ="delete-comment-button"> X </a>
                     
              </span>
              <br>
              <small>
                ${comment.user.name}
              </small>
          </p>
        </li>`);
    }


    /*
    Now we will see how to delete comments of a post via ajax (so that while removing we dont have to refresh for changes to occur)
    
    we need two things
    1) to be able to send the data to controller to delete
    2) once we get confirmation that we need to delete a particular post we remove it from dom
    
    */


    //method to delete a post from DOM

    let deleteComment = function (deleteLink) {
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

        $(deleteLink).click(function (e) {
            e.preventDefault();
            // calling ajax to delete comment of a post

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    //data will remove the comment of a post, 
                    // lets assume the data variable which we have consists of comment id to be delted(we will be sending from the browser , it will consist of the comment id to be deleted)
                    $(`#comment-$(data.data.comment_id)`).remove()
                    //the above line deletes comment inside a post of a particular comment id
                },
                error: function (error) {
                    console.log(error.responseText);
                }
            })

        });
    }
}
