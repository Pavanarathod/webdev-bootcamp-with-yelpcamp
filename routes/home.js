const express = require("express");
const route = express.Router();

route.get("/", (req, res) => {
  const cats = ["Blue", "Rocket", "Monty", "Stephen", "Winston"];
  res.render("campgrounds/home", { cats });
});

module.exports = route;
