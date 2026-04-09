import Listing from "../models/Listing.js";

export const index  = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index", { allListing });
}

export const newForm  = (req, res) => {
    res.render("listings/form");
}

export const showRoute = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "Reviews",
         populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error" , "Listing that you are trying to find is not extists");
        return res.redirect("/listing");
    }
    console.log(listing)
    res.render("listings/show", { listing });
}

export const createListing = async (req, res) => {
        const newListing = new Listing(req.body.listings);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success" , "Listing created successfully");
       return res.redirect("/listing");
    }

export const editForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error" , "Listing that you are trying to edit is not extists");
        res.redirect("/listing");
    }
    res.render("listings/edit", { listing });
}

export const update = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listings);
    req.flash("success", "Listing updated successfully");
    res.redirect(`/listing/${id}`);
  }

export const deleteee =  async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing deleted successfully");
    res.redirect("/listing");
}

