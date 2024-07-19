const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js") //use create route 
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/Listing.js");//listing file ne require kari
// const { validateReview } = require("../middleware.js")




const validateReview = ((req, res, next) => {
      let { error } = reviewSchema.validate(req.body);
      if (error) {
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errMsg);
      } else {
            next();
      }
  });


//Reviwes post route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    
    //review model ne reuire karvu uper
  console.log(req.params.id)
    let listing = await Listing.findById(req.params.id)
    console.log(listing)
    let newReview = new Review(req.body.review);
    //   show.ejs ma form banauy aema review rating pass karva newReview ma store karyu
    listing.reviews.push(newReview);
    //   each listing jode review array hashe to ene push karvu newReview ander
    await newReview.save(); //save in both t db
    await listing.save();//beacu existing db ni document ma change karva use save function that is alo Async itself
    req.flash("success","New review created!");
    res.redirect(`/listing/${listing._id}`);
    

}
)) 
// review Delete route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
      let { id, reviewId } = req.params;
     await  Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});//areviewId ni array  inside delete the review use findByIdUpdate kari revi ni id ne delete karvi pade so use MONGOSH $PULL OPERATER
     req.flash("success"," New review deleted!");
      res.redirect(`/listing/${id}`);
})
);   
//here you using app.post and appp is not defind here and second thing in delete route you used req.redirect in place of  res.redirect 
// when review not delte that error
module.exports = router;

// what error y solve?

