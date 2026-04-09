import Listing from "../models/Listing.js";

export const index  = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index", { allListing });
}