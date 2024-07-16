module.exports.isLoggedIn = (req, res, next) => {
      // Check if user is authenticated (assuming Passport)
      if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in to create listing!');
        return res.redirect('/login');
      }
    
      // If user is authenticated, proceed to the next middleware
      next();
    };

// module.exports.isLoggedIn = (req, res, next) => {
//       if (!req.isAuthenticated()) {
//         req.flash('error', 'You must be logged in to create listing!');
//         return res.redirect('/login');
//       }
//       next();
//     };
    



const validateReview = ((req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
          let errMsg = error.details.map((el) => el.message).join(",");
          throw new ExpressError(400, errMsg);
    } else {
          next();
    }
});

const validateListing = ((req, res, next) => {
      let { error } = reviewSchema.validate(req.body);
      if (error) {
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errMsg);
      } else {
            next();
      }
  });
