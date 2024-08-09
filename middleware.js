const listing = require("./models/listing");
const Review = require("./models/reviews.js");

const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

const isLoggedin = (req, res, next) => {
  console.log(req.path, "..", req.originalUrl);
  // console.log(req.user);
  if (!req.isAuthenticated()) {
    //RedirectUrl Save
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create new listing!");
    return res.redirect("/login");
  }
  next();
};
module.exports = { isLoggedin };

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// For only user can edit or delete the listing
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;

  let listingobj = await listing.findById(id);
  if (!listingobj.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//middleware
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// For only owner can delete the reviews
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;

  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
