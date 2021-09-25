const express = require("express");
const CampGround = require("../modals/campground");
const route = express.Router();
const asycHandler = require("express-async-handler");
const { validateCamp, validateReview } = require("../middleware/ValidateCamp");
const Review = require("../modals/review");
const { isLoggedIn } = require("../middleware/auth");

route.get(
  "/",
  asycHandler(async (req, res) => {
    const campground = await CampGround.find({});
    res.render("campgrounds/index", { campground });
  })
);

route.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

route.post(
  "/",
  validateCamp,
  asycHandler(async (req, res) => {
    const campground = new CampGround(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully Created New Camp..");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

route.get(
  "/:id",
  asycHandler(async (req, res) => {
    const campground = await CampGround.findById(req.params.id)
      .populate("reviews")
      .populate("author");

    res.render("campgrounds/detail", { campground });
  })
);

route.get(
  "/:id/edit",
  asycHandler(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

route.delete(
  "/:id/reviews/:reviewId",
  asycHandler(async (req, res) => {
    const { id, reviewId } = req.params;
    await CampGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);

route.put(
  "/:id",
  validateCamp,
  asycHandler(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, {
      ...req.body.campground,
    });

    res.redirect(`/campgrounds/${campground._id}`);
  })
);

route.delete(
  "/:id",
  asycHandler(async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
  })
);

route.post(
  "/:id/review",
  validateReview,
  asycHandler(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

module.exports = route;
