import express from "express";
const router = express.Router();
import User from "../models/user.js";
import wrapAsync from "../utils/wrapAsync.js";

router.get("/signup" , (req,res) =>{
    res.render("users/signup");
})

router.post("/signup" ,wrapAsync(async (req,res) =>{
    try {
        const {username , email ,password} = req.body;
        const newuser = new User({username , email})
        const registeredUser = await User.register(newuser , password);
        req.flash("success" , "Welcome to AirBnb");
        res.redirect("/listing");
    } catch (error) {
        req.flash("error" , error.message);
        res.redirect("/signup");
    }
}))

export default router;