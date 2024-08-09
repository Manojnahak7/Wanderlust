const listing = require("../models/listing");
const Review = require("../models/reviews");
// Post Review Routes
module.exports.createReview = async (req, res) => {
  let listing2 = await listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing2.reviews.push(newReview);

  await newReview.save();
  await listing2.save();
  req.flash("success", "Review created!");

  res.redirect(`/listings/${listing2._id}`);
};

// Delete Review Route
module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  await listing.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");

  res.redirect(`/listings/${id}`);
};
