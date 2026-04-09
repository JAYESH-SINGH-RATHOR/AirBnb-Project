import express from "express";
const routes = express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../models/Listing.js";
import {isLoggedin , isowner , validateListing} from "../middleware.js";
import {index} from "../controllers/listing.js";
// validate listing models




/* INDEX */
routes.get("/", wrapAsync(index));

/* NEW FORM */
routes.get("/new", isLoggedin ,  (req, res) => {
    res.render("listings/form");
});

/* SHOW */
routes.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "Reviews",
         populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error" , "Listing that you are trying to find is not extists");
        return res.redirect("/listing");
    }
    console.log(listing)
    res.render("listings/show", { listing });
}));

/* CREATE */
routes.post(
    "/", isLoggedin,
    validateListing,
    wrapAsync(async (req, res) => {
        const newListing = new Listing(req.body.listings);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success" , "Listing created successfully");
       return res.redirect("/listing");
    })
);

/* EDIT FORM */
routes.get("/:id/edit", isLoggedin , isowner ,wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error" , "Listing that you are trying to edit is not extists");
        res.redirect("/listing");
    }
    res.render("listings/edit", { listing });
}));

/* UPDATE */
routes.put(
  "/:id",
  isLoggedin, isowner ,
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listings);
    req.flash("success", "Listing updated successfully");
    res.redirect(`/listing/${id}`);
  })
);

/* DELETE */
routes.delete("/:id", isLoggedin ,isowner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing deleted successfully");
    res.redirect("/listing");
}));


export default routes;