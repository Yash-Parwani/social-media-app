module.exports.home = function(request,response){
    //rendering home.ejs and sending title from server to browser
    return response.render("home",{
         title: "Home"
    });
}