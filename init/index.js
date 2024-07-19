const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/Listing.js");

const MONGO_URl = "mongodb://127.0.0.1:27017/Wanderlust";

main()
      .then(() => {
            console.log("connected to DB");
      }).catch((err) => {
            console.log(err);
      })



async function main() {
      await mongoose.connect(MONGO_URl);
}


const initDB = async () => {
      await listing.deleteMany({}) //db ne empty karvah
      initData.data = initData.data.map((obj) => ({
            ...obj, owner : "669947484756149521cd275e"
      }))
      await listing.insertMany(initData.data); //initData aek obj 
      console.log("data was initialized");
}
initDB();

