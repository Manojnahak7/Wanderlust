const User = require("../models/user");

module.exports.renderSignupform = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const image = req.file ? req.file.filename : null;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash("error", "Username already taken. Please choose another.");
      return res.redirect("/signup");
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      req.flash("error", "Email already registered. Please use another.");
      return res.redirect("/signup");
    }

    const newUser = new User({ email, username, image });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Wonderlust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginform = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Wonderlust!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged You Out!");
    res.redirect("/listings");
  });
};
