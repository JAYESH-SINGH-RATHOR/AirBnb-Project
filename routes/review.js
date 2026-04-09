import express from "express";
// const routes = express.Router();
const routes = express.Router({ mergeParams: true });
import wrapAsync from "../utils/wrapAsync.js";

import Listing from "../models/Listing.js";
import Review from "../models/Review.js";
import {listingSchema , reviewSchema} from "../Schema.js";
import {isLoggedin, ValidateReview , isreviewsAuthor} from "../middleware.js";
import { reviews , deleteReview } from "../controllers/reviews.js";

// validate review schema 



/* REVIEWS */
routes.post(
    "/",isLoggedin , ValidateReview ,
    wrapAsync(reviews));


// delete review route
routes.delete("/:reviewId", isLoggedin , isreviewsAuthor ,  wrapAsync(deleteReview));


export default routes;