import express from "express";
const router = express.Router();
import User from "../models/user.js";
import passport from "passport";

router.get("/signup", (req, res) => {
    res.render("users/signup");
});

router.post("/signup", async (req, res, next) => {
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
});

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post(
    "/login",
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login"
    }),
    async(req, res) => {
        req.flash("success", "Welcome to AirBnb");
        req.flash("success",    "Welcome to AirBnb , You are logged in");
        res.redirect("/listing");
    }
);

router.get('/logout' , (req,res,next) =>{
    req.logOut((err) =>{
        if(err){
         return  next(err);
        }
        req.flash("success" , "You are logged out");
        res.redirect("/listing");
    })
})

export default router;