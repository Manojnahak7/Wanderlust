const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/reviews.js");
const { reviewSchema } = require("../schema.js");
const listing = require("../models/listing.js");
const { isLoggedin, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//Review Validate using joi
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Router Route

//Post review Route
// router
//   .route("/")
//   .post(isLoggedin, validateReview, wrapAsync(reviewController.createReview));

// Delete Review Route
// router
//   .route("/:reviewId")
//   .delete(isLoggedin, isReviewAuthor, wrapAsync(reviewController.deleteReview));

// Post Review Route
router.post(
  "/",
  isLoggedin,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedin,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
