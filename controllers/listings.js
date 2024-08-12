const listing = require("../models/listing");

// Index Route
module.exports.index = async (req, res) => {
  // For Search Functionality
  const { search } = req.query;

  // Default to an empty string if no search query is provided
  const searchQuery = search || "";

  let query = {};
  if (searchQuery) {
    const regex = new RegExp(searchQuery, "i");
    query = {
      $or: [
        { title: regex },
        { description: regex },
        { location: regex },
        { country: regex },
        { category: regex },
        { state: regex }, // Add additional fields here
        { mountain: regex }, // Add additional fields here
        { apartment: regex }, // Add additional fields here
      ],
    };
  }

  // const allListing = await listing.find({});
  const allListing = await listing.find(query);

  res.render("./listings/index.ejs", { allListing, search: searchQuery });
};

// New Route
module.exports.renderNewform = async (req, res) => {
  res.render("./listings/new.ejs");
};

// Show Route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const showall = await listing
    .findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!showall) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  // console.log(showall);
  res.render("./listings/show.ejs", { showall });
};

// Create Route
module.exports.createListing = async (req, res, next) => {
  //Newly added
   let { contactnumber } = req.body.listingobj;
  if (!contactnumber || contactnumber.toString().length !== 10) {
    req.flash("error", "Contact number must be exactly 10 digits");
    return res.redirect("/listings/new");
  }
  
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new listing(req.body.listingobj);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

// Edit Route
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let editList = await listing.findById(id);
  // console.log(editList);
  if (!editList) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  let originalImageUrl = editList.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("./listings/edit.ejs", { editList, originalImageUrl });
};

// Update Route
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let updateListing = await listing.findByIdAndUpdate(id, {
    ...req.body.listingobj,
  });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updateListing.image = { url, filename };
    await updateListing.save();
  }
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

// Delete Route
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let dleteList = await listing.findByIdAndDelete(id);
  console.log(dleteList);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
