// index.js contains standalone top-level routes, i.e the routes which aren't followed by anything else. For eg- /dashboard
const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

const Story = require("../models/Story");

// description- landing(i.e login) page
// route-        GET /
// we are using our own middleware to protect the '/' route from logged in users
router.get("/", ensureGuest, (req, res) => {
  // pass the second argument to render() specifying that the login 'view' (./views/login.hbs) should be using the login 'layout' (./views/layouts/login.hbs) & not the defaultLayout: main.hbs
  res.render("login", {
    layout: "login",
  });
});

// description- dashboard
// route-       GET /dashboard
// we are using our own middleware to protect the '/dashboard' route from un-logged users
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user._id }).lean(); // lean() converts mongoose model to plain JS object to be rendered properly in browsers
    // using render() bcz we are using templating engines to generate dynamic html (handlebars)
    // dashboard view will be looked inside the "views" folder by default
    res.render("dashboard", {
      name: req.user.firstName, // It's coming from serializeUser() passportJS & we should be able to access this in our dashboard.hbs view
      stories,
    });
  } catch (error) {
    res.render("error/500"); // since rendering a view, no need to give full path. "views" folder will be automatically looked up
  }
});

module.exports = router;
