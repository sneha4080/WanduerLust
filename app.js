const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");


const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsrouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const wrapAsync = require("./utils/wrapAsync.js");
const Listing = require("./models/Listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});






const sessionOptions = {
      secret: "mysupercode",
      resave: false,
      saveUninitialized: true,
      Cookie: {
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
      },
};
app.use(passport.initialize());
app.use(session(sessionOptions))//user aek web na page & diffrent tab ma access kare password use kare nt need to login
app.use(flash());

// app.use(passport.initialize);
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// passport na ander badha user localstrategy thi authenticate hova joi 

passport.serializeUser(User.serializeUser());
// serialize users into the session all info store user into session
passport.deserializeUser(User.deserializeUser());
// user finsh work so deserialize the user


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Define your routes after this middleware
app.use("/listing", listingsRouter);
app.use("/listing/:id/reviews", reviewsrouter);  //is require to create review
app.use("/",userRouter);

// Your other routes here...
// register mate
// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "deltastudent1"
//   });
//   console.log("flesh")
  
//   let registerdUser = await User.register(fakeUser, "helloworld");
//   res.send(registerdUser);
// })


// Verify that you are setting the flash messages correctly in your routes
app.get("/listing", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

// Example route that sets a flash message
app.post("/someRoute", (req, res) => {
  req.flash("success", "Successfully completed the action!");
  res.redirect("/listing");
});

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

app.all("*", (req, res, next) => {
      next(new ExpressError(404, "Page Not Found"));//NOT 
})

app.use((err, req, res, next) => { //middleare thi handle the error to price valid enter 
  let { statusCode = 500, message = "something went wrong" } = err;//NOT 
  res.status(statusCode).send(message);
})
app.listen(8080, () => {
  console.log("server working")

})
