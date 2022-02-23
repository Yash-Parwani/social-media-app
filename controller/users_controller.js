const { response } = require("express")

module.exports.profile = function(request,response){
    return response.end("<h1>User Profile</h1>");
}