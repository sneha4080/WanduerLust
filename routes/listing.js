const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js") //use create route 
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/Listing.js");//listing file ne require kari
// const flash = require('express-flash');
const { isLoggedIn } = require("../middleware.js")
const flash = require('connect-flash');




const validateListing = ((req, res, next) => {
      console.log(req.body)
      const { error } = listingSchema.validate(req.body);
      if (error) {
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errMsg);
      } else {
            next();
      }
});


// index Route
router.get("/", wrapAsync(async (req, res) => {
      const allListings = await Listing.find({});
      res.render("listings/index.ejs", { allListings });
})
);

//   New Route
router.get("/new", isLoggedIn, (async (req, res) => { //new form mate new.ejs
      if (req.isAuthenticated()) {
            req.flash("error", "you must be logged in to create listing!");
            res.redirect("/login");
            console.log(req.user);
      }
      res.render("listings/new.ejs");
}))

//Show Route //new route ne pela lakhiyu beacz ae pela new check kare pachi id per jay
router.get("/:id", wrapAsync(async (req, res) => {
      console.log("show request accepted");
      let { id } = req.params;
      const listing = await Listing.findById(id).populate("reviews");
      if (!listing) {
            req.flash("error", "listing does't exists!");
            console.log(listing);
            res.redirect("/listing");
      }

      res.render("listings/show.ejs", { listing })
}))



// Create Route  new lit crerat thay

router.post("/",isLoggedIn, validateListing, wrapAsync(async (req, res, next) => { //use wrapAsync remove try & catch
      let result = listingSchema.validate(req.body);
      const newListing = new Listing(req.body.listing); //.listing thi data obje key : value pair ma ave not array       
      await newListing.save();
      req.flash("success", "New listing created!");
      res.redirect("/listing");
}))


//    Edit Route
router.get("/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id);
      if (!listing) {
            req.flash("error", "listing  you requested for does't exists!");
            res.redirect("/listing");
      }
      res.render("listings/edit.ejs", { listing });

}))

// UPDATE ROUTE
router.put("/:id", isLoggedIn,validateListing, wrapAsync(async (req, res) => {
      console.log(req.body);
      // if (!req.body.listing) {
      //       throw new ExpressErsror(400, "Send Valid data")
      // } //not need directly validate thi add thay
      let { id } = req.params;
      await Listing.findByIdAndUpdate(id, { ...req.body.listing });
      req.flash("success", "listing updated!");
      res.redirect(`/listing/${id}`);
})
)

// DELETE ROUTE
router.delete("/:id/reviews",isLoggedIn, wrapAsync(async (req, res) => {
      let { id } = req.params;
      let deletedListing = await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
      req.flash("success", "listing deleted!");
      res.redirect("/listing");
}))

module.exports = router;



// the error was because of wrong route listing and listings
// app.use listings = listing //here
// yes and in delete too there was listings
