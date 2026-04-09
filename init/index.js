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
    initdata.data = initdata.data.map((obj) =>({ ...obj, owner: '69d7d4f07e6932124bb971d9' }));
    await Listing.insertMany(initdata.data);
    console.log("data was saved");
}

initdb();