const Listing = require("./models/Listing.js")
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");



module.exports.isLoggedIn = (req, res, next) => {
      console.log(req.user);
      // Check if user is authenticated (assuming Passport)
      
      if (!req.isAuthenticated()) {
            req.session.redirectUrl = req.originalUrl ; //user logged na hoy to save original url hoy to
        req.flash('error', 'You must be logged in to create listing!');
        return res.redirect('/login');
      }
    
      // If user is authenticated, proceed to the next middleware
      next();
    };




module.exports.saveRedirectUrl = (req,res,next) => {
      if(req.session.redirectUrl){
            res.locals.redirectUrl = req.session.redirectUrl;
      }
      next();
};

module.exports.isOwner = async(req,res,next) =>{
      let { id } = req.params;
      let listing = await Listing.findById(id); //find kae id cureuser ni sem to j edit kari shake nai to nai
      if (!listing.owner._id.equals( res.locals.currUser._id)) {
           req.flash("error", "You have not Owner of this listing");
          return  res.redirect(`/listing/${id}`);
      }
      next();
}


module.exports.validateReview = ((req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
          let errMsg = error.details.map((el) => el.message).join(",");
          throw new ExpressError(400, errMsg);
    } else {
          next();
    }
});

module.exports. validateListing = ((req, res, next) => {
      let { error } = reviewSchema.validate(req.body);
      if (error) {
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errMsg);
      } else {
            next();
      }
  });
