const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const { validateReview } = require("../middleware/ValidateCamp");
const CampGround = require("../modals/campground");
const Review = require("../modals/review");
const router = express.Router();

router.post(
  "/:id/review",
  validateReview,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id/reviews/:reviewId",
  expressAsyncHandler(async (req, res) => {
    const { id, reviewId } = req.params;
    await CampGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
