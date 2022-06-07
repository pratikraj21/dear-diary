// index.js contains standalone top-level routes, i.e the routes which aren't followed by anything else. For eg- /dashboard
const express = require("express");
const router = express.Router();

// description- landing(i.e login) page
// route-        GET /
router.get("/", (req, res) => {
  // pass the second argument to render() specifying that the login 'view' (./views/login.hbs) should be using the login 'layout' (./views/layouts/login.hbs) & not the defaultLayout: main.hbs
  res.render("login", {
    layout: "login",
  });
});

// description- dashboard
// route-       GET /dashboard
router.get("/dashboard", (req, res) => {
  // using render() bcz we are using templating engines to generate dynamic html (handlebars)
  // dashboard view will be looked inside the "views" folder by default
  res.render("dashboard");
});

module.exports = router;
