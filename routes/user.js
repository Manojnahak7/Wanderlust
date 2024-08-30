const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const usersController = require("../controllers/users.js");
const { saveRedirectUrl } = require("../middleware.js");
const { storage } = require("../cloudConfig"); 
const User = require("../models/user"); 

const upload = multer({ storage }); 

router.post(
  "/signup",
  upload.single("image"),
  wrapAsync(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const image = req.file ? req.file.path : null; 

      console.log("Uploaded file details:", req.file); 
      console.log("Image URL:", image); 

      const newUser = new User({
        email,
        username,
        image, 
      });

      const registeredUser = await User.register(newUser, password);

      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Wonderlust");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

router.get("/signup", usersController.renderSignupform);

router
  .route("/login")
  .get(usersController.renderLoginform)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    usersController.login
  );

router.get("/logout", usersController.logout);

module.exports = router;
