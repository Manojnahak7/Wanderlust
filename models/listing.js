const mongoose = require("mongoose");
const Review = require("./reviews.js");
const Schema = mongoose.Schema;
const User = require("./user.js");
const { types } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    filename: String,
   
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
      "castles",
      "amazing pool",
      "camping",
      "farms",
      "arctic",
      "domes",
      "boats",
    ],
    required:true,
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
