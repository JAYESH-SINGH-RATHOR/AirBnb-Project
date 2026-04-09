import Listing from "./models/Listing.js";
import ExpressError from "./utils/ExpressError.js";
import { listingSchema, reviewSchema } from "./Schema.js";
import Review from "./models/Review.js";

export const isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create a new listing ");
        return res.redirect("/login")
    }
    next();
}  


export const saveRedirectUrl = (req, res ,next) =>{
    if (req.session && req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


export const isowner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listing");
        }

        if (!req.user || !listing.owner.equals(req.user._id)) {
            req.flash("error", "You are not the owner of this listing");
            return res.redirect(`/listing/${id}`);
        }

        next();
    } catch (err) {
        next(err);
    }
};

export const  validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    }
    next();
};


export const ValidateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    }
    next();
};

export const isreviewsAuthor = (req, res, next) => {
    const { id , reviewId } = req.params;
    if (!req.user) {
        req.flash("error", "You must be logged in to perform this action");
        return res.redirect("/login");
    }
    Review.findById(reviewId).then(review => {
            if (!review) {
                req.flash("error", "Review not found");
                return res.redirect(`/listing/${id}`);
            }
            if (!review.author.equals(req.user._id)) {
                req.flash("error", "You are not the author of this review");
                return res.redirect(`/listing/${id}`);
            }
            next();
        });

};

