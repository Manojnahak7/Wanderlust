const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const usersController = require("../controllers/users.js");
const { saveRedirectUrl } = require("../middleware.js");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post(
  "/signup",
  upload.single("image"),
  wrapAsync(usersController.signup)
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

