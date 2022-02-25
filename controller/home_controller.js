module.exports.home = function(request,response){
    //rendering home.ejs and sending title from server to browser
    //cookies come as in a request so to check we print it as request.cookies

    return response.render("home",{
         title: "Home"
    });
}