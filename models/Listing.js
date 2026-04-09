import mongoose from "mongoose";
const Schema = mongoose.Schema;
import Review from "./Review.js";
const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    imgaes:{
        type:String,

    },
    Price:{
        type:Number,
        required:true
    },
    Location:{
        type:String,
        required:true
    },
    Country:{
        type:String,
        required:true
    },
    Reviews: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }
],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
})

// create a post middleware to delete all reviews associated with a listing when listing is deleted

listingSchema.post("findOneAndDelete" , async(listing) =>{
    await Review.deleteMany({reviews : {$in : listing.Reviews}})
})

const Listing = mongoose.model("Listing" , listingSchema);

export default Listing;