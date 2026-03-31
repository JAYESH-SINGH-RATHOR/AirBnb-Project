import mongoose from "mongoose";
const  Schema = mongoose.Schema;

const reviewSchema = new Schema({
    Comment:{
        type:String,
        required:true
    },
    Rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    CreatedAt:{
        type:Date,
        default:Date.now()
    }
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
