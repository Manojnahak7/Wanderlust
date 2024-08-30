if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
// const listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const listingSchema = require("./schema.js");
const Review = require("./models/reviews.js");
// const reviewSchema = require("./schema.js");
const routeslistings = require("./routes/listing.js");
const reviewroutes = require("./routes/review.js");
const userroutes = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const dbUrl = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("Connecting to DB Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  // await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
  await mongoose.connect(dbUrl);
}
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
// app.use("/uploads", express.static("uploads"));
app.use("./uploads", express.static(path.join(__dirname, "uploads")));


app.listen(3030, () => {
  console.log("App is running on port 3030");
});

//For MONGO-ATLAS

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR in MONGO SESSION Store", err);
});
//Express session
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expire: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// app.get("/", (req, res) => {
//   res.send("Working nice");
// });

// Session Middleware
app.use(session(sessionOptions));
app.use(flash());

//PassportInitialize
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  // res.locals.errmsg = req.flash("error");
  next();
});

//Demo User
// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "student123",
//   });
//   let newUser = await User.register(fakeUser, "helloworld");
//   res.send(newUser);
// });

app.use("/listings", routeslistings);
app.use("/listings/:id/reviews", reviewroutes);
app.use("/", userroutes);
// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"Mini House",
//         description:"Small house",
//         price:2500,
//         location:"Karatali, Odisha",
//         country:"India",
//     })
//     await sampleListing.save();
//     res.send("Successfull");
//     console.log("Sample was saved");
// })

// // Create Route

// app.post(
//   "/listings",
//   validateListing,
//   wrapAsync(async (req, res, next) => {
// let Listing=req.body.listing;
// try {

// if (!req.body.listing) {
//   throw new ExpressError(400, "Send valid data for listing");
// }
// const newListing = new listing(req.body.listing);
// if (!newListing.description) {
//   throw new ExpressError(400, "Description is missing");
// }
// if (!newListing.title) {
//   throw new ExpressError(400, "Title is missing");
// }
// if (!newListing.country) {
//   throw new ExpressError(400, "Country is missing");
// }
// if (!newListing.location) {
//   throw new ExpressError(400, "Location is missing");
// }

// const result = listingSchema.validate(req.body);
// console.log(result);
// if (result.error) {
//   throw new ExpressError(400, result.error);
// }
//     const newListing = new listing(req.body.listing);
//     await newListing.save();
//     console.log(newListing);
//     res.redirect("/listings");
//     // } catch (err) {
//     //   next(err);
//     // }
//   })
// );

// app.listen(3030, () => {
//   console.log("App is running on port 3030");
// });

// Error Handling Middleware
// app.use((err,req,res,next)=>{
//   res.send("Something went wrong");
// })

//ExpressError
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));
});

// ExpressError
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("Error.ejs", { message });
  // res.status(status).send(message);
  // res.send("Something went wrong");
});
