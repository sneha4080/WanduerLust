const express = require('express'); // Correct, for example
const route = require('./listing');
const router = express.Router();
const User = require("../models/user.js");
const user = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
})


router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email })
        const registerUser = await User.register(newUser, password); //register katvav
        console.log(registerUser);
        req.flash("success", "Welcome to Wanduerlust!");
        res.redirect("/listing");
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
})
);

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
})

router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}),
    async (req, res) => {
        req.flash("success", "Welcome back to Wanderlust");
        res.redirect("/listing");

    }
);

route.get("/logout",(req,res)=>{
    req.logOut((err)=>{ //res.loout is method prebilt so that aacquire callback as a parametr
  if(err){ //error ave to call next
   return next(err);
  } //else
  req.flash("You are logged out now");
    })
    res.redirect("/listing");
})

module.exports = router;
