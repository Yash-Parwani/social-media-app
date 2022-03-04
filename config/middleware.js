module.exports.setFlash = function(request,response,next){
    response.locals.flash = {
        "success": request.flash('sucess'),
        "error": request.flash("error message")
    }
    next();  
}