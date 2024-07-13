const express = require('express'); // Correct, for example
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/Listing.js");//listing file ne require kari
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js") //use create route 
const ExpressError = require("./utils/ExpressError.js");


const listings = require("./routes/listing.js")

const { wrap } = require('module');
const { error } = require('console');
const { listingSchema, reviewSchema } = require("./schema.js");
console.log(listingSchema); // This should log the schema definition

const Review = require("./models/review.js");

app.use(express.json());

// Use the review routes

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



const MONGO_URl = "mongodb://127.0.0.1:27017/Wanderlust";

async function main() {
      try {
            await mongoose.connect(MONGO_URl);
            console.log("Connected to MongoDB.");
      } catch (err) {
            console.error("Failed to connect to MongoDB:", err);
      }
}
main()


app.get("/listing", wrapAsync(async (req, res) => {
      const allListings = await Listing.find({});
      // await Listing.find({})
      res.render("listings/index", { allListings });
}));




const validateReview = ((req, res, next) => {
      let { error } = reviewSchema.validate(req.body);
      if (error) {
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errMsg);
      } else {
            next();
      }
});

app.use("./listing",listings)


//Reviwes post route
app.post("/listing/:id/reviews", validateReview, wrapAsync(async (req, res) => {
      //review model ne reuire karvu uper
      await Listing.findByIdAndUpdate();
      console.log(req.params.id);
      console.log(req.body);
      let listing = await Listing.findById(req.params.id)
      let newReview = new Review(req.body.review);
      //      console.log(newReview)
      //   show.ejs ma form banauy aema review rating pass karva newReview ma store karyu

      listing.reviews.push(newReview);
      //   each listing jode review array hashe to ene push karvu newReview ander
      await newReview.save(); //save in both t db
      await listing.save();//beacu existing db ni document ma change karva use save function that is alo Async itself
      res.redirect(`/listing/${listing._id}`);
      // res.send("worked")

})
)
// review Delete route
// app.delete("/listing/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
//       let { id, reviewId } = req.params;


//      await  Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});//areviewId ni array  inside delete the review use findByIdUpdate kari revi ni id ne delete karvi pade so use MONGOSH $PULL OPERATER
//       await Review.findByIdAndDelete(reviewId);

//       req.redirect(`/listing/${id}`);

// })
// );
app.delete("/listing/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
      let { id, reviewId } = req.params;


     await  Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}}).then(res => console.log(res)).catch(err => console.log(err))
      await Review.findByIdAndDelete(reviewId);

      res.redirect(`/listing/${id}`);

})
);

app.use((err, req, res, next) => {
      const { statusCode = 500, message = "Something went wrong" } = err;
      // console.error(err); // Log the error to the console
      res.status(statusCode).render("listings/error.ejs", { message })
      // res.status(statusCode).send(message);
})

app.get("/", (req, res) => {
      res.send("Hi, i am root")
}
)
// Middleware to set flash messages
app.use((req, res, next) => {
      res.locals.success = req.flash("success");
      res.locals.error = req.flash("error");
      next();
});

  


// app.get("/testListing",async(req,res)=>{
//       let sampleListing = new Listing({
//             title : "my vila",
//             description : "over the fly",
//             price : 12000,
//             location: "udaypur",
//             country : "India",
//       });
//       await sampleListing.save();
//       console.log("sample was saved");
//       res.send("successful testing");
// });

// app.all("*", (req, res, next) => {
//       next(new ExpressError(404, "Page Not Found"));//NOT 
// })

app.use((err, req, res, next) => { //middleare thi handle the error to price valid enter 
      let { statusCode = 500, message = "something went wrong" } = err;//NOT 
      res.status(statusCode).send(message);
})
app.listen(8080, () => {
      console.log("server working")

})
