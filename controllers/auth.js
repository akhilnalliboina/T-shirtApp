const User = require("../models/user");
const { validationResult, cookie } = require("express-validator");
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
  const errors = validationResult(req);
  const user = new User(req.body);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  user.save((err, user) => {
    if (err) {
      res.status(400).json({
        message: err,
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  User.findOne({ email }, (err, user) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    } else if (!user) {
      return res.status(400).json({
        error: "user email not found",
      });
    } else if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "user email and password didnot match",
      });
    } else {
      //create token
      const token = jwt.sign({ _id: user._id }, process.env.SECRET);
      //put token in cookie
      res.cookie("token", token, { expire: new Date() + 999 });
      //send response to frontend
      const { _id, name, email, role } = user;
      return res.json({
        token,
        user: { _id, name, email, role },
      });
    }
  });
};

exports.signout = (req, res) => {
  //clear the cookie
  res.clearCookie("token");
  res.json({
    message: "user signed out successfully",
  });
};

exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "User is not authenticated! ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    res.status(403).json({
      error: "User is not ADMIN! ACCESS DENIED",
    });
  }
  next();
};
