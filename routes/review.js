import express from "express";
// const routes = express.Router();
const routes = express.Router({ mergeParams: true });
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import Listing from "../models/Listing.js";
import Review from "../models/Review.js";
import {listingSchema , reviewSchema} from "../Schema.js";



// validate review schema 

const ValidateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    }
    next();
};


/* REVIEWS */
routes.post(
    "/", ValidateReview ,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) throw new ExpressError(404, "Listing not found");

        const review = new Review(req.body.review);
        await review.save();

        listing.Reviews.push(review._id);
        await listing.save();

        res.redirect(`/listing/${id}`);
    })
);


// delete review route
routes.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }   
    });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);
}));


export default routes;