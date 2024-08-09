const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usersController = require("../controllers/users.js");

//Router Route

router
  .route("/signup")
  .get(usersController.renderSignupform)
  .post(wrapAsync(usersController.signup));

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
// router.get("/signup", usersController.renderSignupform);

// router.post("/signup", wrapAsync(usersController.signup));

// router.get("/login", usersController.renderLoginform);

// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   usersController.login
// );

router.get("/logout", usersController.logout);
module.exports = router;
