import express from "express";
const router = express.Router();

import User from "../models/user.js";
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js";

/* ================= SIGNUP ================= */

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

/* ================= LOGIN ================= */

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login"
    }),
    (req, res) => {
        req.flash("success", "Welcome to AirBnb, you are logged in");
        res.redirect(res.locals.redirectUrl || "/listing");
    }
);

/* ================= LOGOUT ================= */

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.flash("success", "You are logged out");
        res.redirect("/listing");
    });
});

export default router;