export const isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create a new listing ");
        return res.redirect("/login")
    }
    next();
}  


export const saveRedirectUrl = (req, res ,next) =>{
    if (req.session && req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

