const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const listing = require("../models/listing.js");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
// Start with index Route
router.route("/").get(wrapAsync(listingController.index)).post(
  isLoggedin,
  // validateListing,
  upload.single("listingobj[image]"),
  validateListing,
  wrapAsync(listingController.createListing)
);

// New Route
router.get("/new", isLoggedin, wrapAsync(listingController.renderNewform));

// Start with Id
router
  .route("/:id")
  // Show Route
  .get(wrapAsync(listingController.showListing))
  // Update Route
  .put(
    isLoggedin,
    isOwner,
    upload.single("listingobj[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  // Delete Route
  .delete(isLoggedin, isOwner, wrapAsync(listingController.deleteListing));

// Index Route
// router.get("/", wrapAsync(listingController.index));

// New Route
// router.get("/new", isLoggedin, wrapAsync(listingController.renderNewform));

// Show Route
// router.get("/:id", wrapAsync(listingController.showListing));

// Create Route
// router.post(
//   "/",
//   isLoggedin,
//   validateListing,
//   wrapAsync(listingController.createListing)
// );

// Edit Route

router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  wrapAsync(listingController.editListing)
);

// Update Route
// router.put(
//   "/:id",
//   isLoggedin,
//   isOwner,
//   validateListing,
//   wrapAsync(listingController.updateListing)
// );

// Delete Route

// router.delete(
//   "/:id",
//   isLoggedin,
//   isOwner,
//   wrapAsync(listingController.deleteListing)
// );

module.exports = router;
