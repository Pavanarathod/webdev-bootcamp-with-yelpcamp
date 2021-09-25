// @ts-nocheck
const express = require("express");
const colors = require("colors");
const path = require("path");
const connectDb = require("./db/mongoose");
const home = require("./routes/home");
const campground = require("./routes/campGround");
const reviews = require("./routes/review");
const userRoutes = require("./routes/users");
const mehthodOverride = require("method-override");
const ejsEngine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./modals/user");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mehthodOverride("_method"));
app.use(express.static("public"));
app.engine("ejs", ejsEngine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.set("public", path.join(__dirname, "/public"));
connectDb();
const sessionConfig = {
  secret: "yelpcamp",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  next();
});

app.get("/fake", async (req, res) => {
  const user = new User({
    email: "pavan@gmail.com",
    username: "pavan pattinson",
  });
  const newUser = await User.register(user, "dasbot");
  res.send(newUser);
});

app.use("/", home);
app.use("/campgrounds", campground);
app.use("/campgrounds", reviews);
app.use("/", userRoutes);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Soemthing went Wrong" } = err;
  res.status(statusCode).render("error", { err });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Express Server Runing on Port ${PORT}`.yellow.bold);
});
