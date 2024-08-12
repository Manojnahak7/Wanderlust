const joi = require("joi");

const listingSchema = joi.object({
  listingobj: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      location: joi.string().required(),
      country: joi.string().required(),
      price: joi.number().required().min(0),
      image: joi.string().allow("", null),
      contactnumber: joi.string().required().min(1).max(10),
      category: joi
        .string()
        .valid(
          "rooms",
          "mountains",
          "iconic cities",
          "castles",
          "amazing pool",
          "camping",
          "farms",
          "arctic",
          "domes",
          "boats"
        )
        .required(),
    })
    .required(),
});

// module.exports = listingSchema;

const reviewSchema = joi.object({
  review: joi
    .object({
      rating: joi.number().required().min(1).max(5),
      comment: joi.string().required(),
    })
    .required(),
});

// module.exports = reviewSchema;

module.exports = { listingSchema, reviewSchema };
