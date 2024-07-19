const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js") //use create route 
const Listing = require("../models/Listing.js");//listing file ne require kari
// const flash = require('express-flash');
// const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner} = require("../middleware.js")
const flash = require('connect-flash');




const  validateListing = ((req, res, next) => {
      let { error } = reviewSchema.validate(req.body);
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
      if (!req.isAuthenticated()) {
            req.flash("error", "you must be logged in to create listing!");
            res.redirect("/listing");
            console.log(req.user);
      }
      res.render("listings/new.ejs");
}))

//Show Route //new route ne pela lakhiyu beacz ae pela new check kare pachi id per jay
router.get("/:id", wrapAsync(async (req, res) => {
      console.log("show request accepted");
      let { id } = req.params;
      const listing = await Listing.findById(id)
            .populate("reviews")
            .populate("owner");//method thi owner info print thay
      if (!listing) {
            req.flash("error", "Listing   does't exists!");//always print this
            console.log(listing);
            res.redirect("/listing");
      }
      console.log(listing); //listing ni badhi info print thay

      res.render("listings/show.ejs", { listing })
}))

// Create Route  new lit crerat thay

router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => { //use wrapAsync remove try & catch
      let result = listingSchema.validate(req.body);
      const newListing = new Listing(req.body.listing); //.listing thi data obje key : value pair ma ave not array       
      newListing.owner = req.user._id;
      await newListing.save();
      req.flash("success", "New listing created!");
      res.redirect("/listing");
}))

//    Edit Route
router.get("/:id/edit", 
      isOwner,
      isLoggedIn, wrapAsync(async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id).populate("reviews");
      if (!listing) {
            req.flash("error", "listing  you requested for does't exists!"); //i want print this
            res.redirect("/listing");
      }
      res.render("listings/edit.ejs", { listing });

}))

// UPDATE ROUTE
router.put("/:id",
      isLoggedIn, 
      isOwner,
      validateListing, wrapAsync(async (req, res) => {
      console.log(req.body);
      // if (!req.body.listing) {
      //       throw new ExpressErsror(400, "Send Valid data")
      // } //not need directly validate thi add thay
      let { id } = req.params;
      let listing = await Listing.findById(id); //find kae id cureuser ni sem to j edit kari shake nai to nai
      if (!listing.owner._id.equals( res.locals.currUser._id)) {
           req.flash("error", "You don't have permission edit listing");
           return res.redirect(`/listing/${id}`);
      }
      await Listing.findByIdAndUpdate(id, { ...req.body.listing });
      req.flash("success", "listing updated!");
      res.redirect(`/listing/${id}`);

})
)

// DELETE ROUTE
router.delete("/:id/reviews", 
      isLoggedIn, //first check condition logedIn then check kare owner che ke nai
      isOwner,
       wrapAsync(async (req, res) => {
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
