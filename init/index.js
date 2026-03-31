import mongoose from "mongoose";
import initdata from "./data.js"
import Listing from "../models/Listing.js"

const mongo_url = "mongodb://localhost:27017/Users";
main().then(() =>{
    console.log("connected to db")
}).catch((error) =>{
    console.log(`error is ${error}`);
})

async function main(params) {
    await mongoose.connect(mongo_url);

}

const initdb = async(req , res) =>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("data was saved");
}

initdb();