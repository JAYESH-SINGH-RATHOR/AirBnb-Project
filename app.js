import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import ExpressError from "./utils/ExpressError.js";
import {listingSchema , reviewSchema} from "./Schema.js";
const app = express();
const port = 8090;
app.use(methodOverride("_method"));
import listingRoutes from "./routes/listing.js";
import reviewRoutes from "./routes/review.js";
import session  from "express-session";
import flash from "connect-flash";
import passport  from "passport";
import localStratigy from "passport-local";
import User from "./models/user.js";
import userRoutes from "./routes/user.js";



// session configurations

const sessionOptions = {
    secret : "mySecretCode",
    resave : false,
    saveUninitialized : true,
    cookie :{
        httpOnly : true , 
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000 , 
        maxAge :  7 * 24 * 60 * 60 * 1000
    }
};

/* ---------------- DATABASE ---------------- */
const mongo_url = "mongodb://localhost:27017/Users";

mongoose.connect(mongo_url)
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log(err));

/* ---------------- CONFIG ---------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));



/* ---------------- VALIDATION ---------------- */
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    }
    next();
};


/* ---------------- ROUTES ---------------- */



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratigy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/fakeuser" , async (req , res) =>{
    const user = new User({
        email : "fake@example.com",
        password : "chicken"
    });
    // await user.save();
    let rg = await User.register(user , "chicken");
    res.send(rg);
});


app.use((req , res , next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
    next()
})


app.use("/listing" , listingRoutes)
app.use("/listing/:id/reviews" , reviewRoutes)
app.use("/", userRoutes);

app.get("/", (req, res) => {
    res.send("Hi, I am root of project");
});

/* ---------------- ERROR HANDLING ---------------- */

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});


app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error", { message });
});

/* ---------------- SERVER ---------------- */
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


