import express from "express";
const router = express.Router();

import User from "../models/user.js";
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js";
import wrapAsync from "../utils/wrapAsync.js";
import { signupage , signupform , loginform , login , logoutt} from "../controllers/users.js";

/* ================= SIGNUP ================= */

router.get("/signup", signupform);

router.post("/signup", wrapAsync(signupage));

/* ================= LOGIN ================= */

router.get("/login", loginform );

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login"
    }),
  login
);

/* ================= LOGOUT ================= */

router.get("/logout", logoutt);

export default router;