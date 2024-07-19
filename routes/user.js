const express = require('express'); // Correct, for example
const route = require('./listing');
const router = express.Router();
const User = require("../models/user.js");
const user = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

router.get("/signup", (req, res) => {
    res.render("./users/signup.ejs");
})


router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email })
        const registerUser = await User.register(newUser, password); //register katvav
        console.log(registerUser); //user login nathi to print undefined() aave
        req.login(registerUser, (err) => {
            if (err) { //direct je user register hashe to ae automatic login thai jashe req.login funtion thi
                return next(err); //direct logout no option show thay signup, login no nai
            }
            req.flash("success", "Welcome to Wanduerlust!");
            res.redirect("/listing");
        })

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
})
);

router.get("/login", (req, res) => {
    res.render("./users/login.ejs");
})

router.post("/login",
    saveRedirectUrl ,
     passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}),
    async (req, res) => {
        req.flash("success", "Welcome back to Wanderlust");
        let redirectUrl = res.locals.redirectUrl || "/listing"
        // jo res.es.locals.redirectUrl ma url exist kare to let varible redirect  ma store thay nai to /listing per redirect thay
        res.redirect(redirectUrl);

    }
);

router.get("/logout", (req, res, next) => {
    req.logout((err) => { //res.loout is method prebilt so that aacquire callback as a parametr
        if (err) { //error ave to call next
            return next(err);
        } //else
        req.flash("success", "You are logged out now");
        res.redirect("/listing");
    });
});
router.get("/login", (req, res) => {
    res.render("./users/login.ejs");
})
module.exports = router;
