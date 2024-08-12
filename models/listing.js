const mongoose = require("mongoose");
const Review = require("./reviews.js");
const Schema = mongoose.Schema;
const User = require("./user.js");
const { types } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    filename: String,
    // type: String,
    // default:
    //   "https://housing-images.n7net.in/4f2250e8/4361da1e71fcb4f4167eb0ec299c9717/v0/medium/dn_yoo_odisha-gajapati_nagar-bhubaneswar-dnhomes.jpeg",
    // set: (v) =>
    //   v === ""
    //     ? "https://housing-images.n7net.in/4f2250e8/4361da1e71fcb4f4167eb0ec299c9717/v0/medium/dn_yoo_odisha-gajapati_nagar-bhubaneswar-dnhomes.jpeg"
    //     : v,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  contactnumber: {
     type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid 10-digit phone number!`,
    },
  },
  // For filters

  category: {
    type: String,
    enum: [
      "rooms",
      "mountains",
      "iconic cities",
      "mountain",
      "castles",
      "amazing pool",
      "camping",
      "farms",
      "arctic",
      "domes",
      "boats",
    ],
  },
});

//Deleting listing with review delete
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const listing = mongoose.model("Listing", listingSchema);

module.exports = listing;
