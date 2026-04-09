import User from "../models/user.js";

export const signupform  = (req, res) => {
    res.render("users/signup");
}

export const signupage = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const newuser = new User({ username, email });
        const registeredUser = await User.register(newuser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);

            req.flash("success", "Welcome to AirBnb");
            res.redirect("/listing");
        });

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}

export const loginform = (req, res) => {
    res.render("users/login");
}


export const login  =   (req, res) => {
        req.flash("success", "Welcome to AirBnb, you are logged in");
        res.redirect(res.locals.redirectUrl || "/listing");
    }

export const logoutt =  (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.flash("success", "You are logged out");
        res.redirect("/listing");
    });
}