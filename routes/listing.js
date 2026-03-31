import express from "express";
const routes = express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import {listingSchema , reviewSchema} from "../Schema.js";
import Listing from "../models/Listing.js";


// validate listing models

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    }
    next();
};



/* INDEX */
routes.get("/", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index", { allListing });
}));

/* NEW FORM */
routes.get("/new", (req, res) => {
    res.render("listings/form");
});

/* SHOW */
routes.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("Reviews");
    if (!listing) throw new ExpressError(404, "Listing not found");
    res.render("listings/show", { listing });
}));

/* CREATE */
routes.post(
    "/",
    validateListing,
    wrapAsync(async (req, res) => {
        const newListing = new Listing(req.body.listings);
        await newListing.save();
        res.redirect("/listing");
    })
);

/* EDIT FORM */
routes.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) throw new ExpressError(404, "Listing not found");
    res.render("listings/edit", { listing });
}));

/* UPDATE */
routes.put(
    "/:id",
    validateListing,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        await Listing.findByIdAndUpdate(id, req.body.listings);
        res.redirect(`/listing/${id}`);
    })
);

/* DELETE */
routes.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));


export default routes;