import express from "express";
// const routes = express.Router();
const routes = express.Router({ mergeParams: true });
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import Listing from "../models/Listing.js";
import Review from "../models/Review.js";
import {listingSchema , reviewSchema} from "../Schema.js";
import {isLoggedin, ValidateReview , isreviewsAuthor} from "../middleware.js";


// validate review schema 



/* REVIEWS */
routes.post(
    "/",isLoggedin , ValidateReview ,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) throw new ExpressError(404, "Listing not found");

        const review = new Review(req.body.review);
        review.author = req.user._id;
        listing.Reviews.push(review);
        await review.save();
        await listing.save();
        req.flash("success" , "Review added successfully");


        res.redirect(`/listing/${id}`);
    })
);


// delete review route
routes.delete("/:reviewId", isLoggedin , isreviewsAuthor ,  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }   
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review deleted successfully");

    res.redirect(`/listing/${id}`);
}));


export default routes;