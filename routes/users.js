const express = require("express");
const User = require("../modals/user");
const expressAsyncHandler = require("express-async-handler");
const router = express.Router();
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    await User.register(user, password);
    res.redirect("/campgrounds");
  })
);
router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  expressAsyncHandler(async (req, res) => {
    res.redirect("/campgrounds");
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/campgrounds");
});

module.exports = router;
